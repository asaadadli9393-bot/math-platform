import { NextRequest } from 'next/server';
import {
  buildTutorSystemPrompt,
  rateLimit,
  resolveAIConfigsWithFallback,
  streamChat,
  visionChat,
  type ChatTurn,
  type VisionTurn,
} from '@/lib/ai-tutor';

// ============================================================
//  POST /api/tutor — محادثة المدرّس الذكي (بثّ SSE)
//  المدخل: { year, history: [{role, content}], images?: string[] }
//  images: صور مرفقة برسالة المستخدم الأخيرة (data URLs) — تُقرأ بنموذج الرؤية
//  المخرج: SSE — data: {"t":"نص"} | {"e":"خطأ"} | [DONE]
// ============================================================

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_HISTORY = 12;
const MAX_TURN_CHARS = 2000;
const MAX_TOTAL_CHARS = 9000;
const MAX_IMAGES = 3;
const MAX_IMAGE_BYTES = 1_600_000; // ≈1.6MB لكل صورة (بعد التصغير لدى العميل)

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'local'
  );
}

function sse(payload: string): Uint8Array {
  return new TextEncoder().encode(`data: ${payload}\n\n`);
}

function isValidImageDataUrl(s: string): boolean {
  if (s.length > MAX_IMAGE_BYTES * 1.4) return false; // base64 يضخّم 4/3
  return /^data:image\/(jpe?g|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s);
}

export async function POST(req: NextRequest) {
  // حماية بسيطة من الإفراط
  if (!rateLimit(clientIp(req))) {
    return Response.json({ error: 'rate-limited' }, { status: 429 });
  }

  let year = 'y1';
  let history: ChatTurn[] = [];
  let images: string[] = [];
  try {
    const body = (await req.json()) as { year?: string; history?: ChatTurn[]; images?: unknown };
    year = typeof body.year === 'string' ? body.year : 'y1';
    history = Array.isArray(body.history) ? body.history : [];
    if (Array.isArray(body.images)) {
      images = body.images
        .filter((x): x is string => typeof x === 'string' && isValidImageDataUrl(x))
        .slice(0, MAX_IMAGES);
    }
  } catch {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  // تنظيف وتحديد المدخلات
  history = history
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_TURN_CHARS),
    }));

  const total = history.reduce((s, m) => s + m.content.length, 0);
  if (!history.length || history[history.length - 1].role !== 'user' || total > MAX_TOTAL_CHARS) {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  const question = history[history.length - 1].content;

  // ============ مسار الرؤية: صورة مرفقة ============
  if (images.length > 0) {
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const done = () => {
          try {
            controller.enqueue(sse('[DONE]'));
          } catch {
            /* مغلقة */
          }
          controller.close();
        };
        try {
          const { primary } = await resolveAIConfigsWithFallback();
          if (primary.kind !== 'zai') {
            controller.enqueue(
              sse(
                JSON.stringify({
                  e: 'vision-unsupported',
                }),
              ),
            );
            return done();
          }

          // رسائل الرؤية: تعليمات النظام + السياق النصي + السؤال الحالي مع الصور
          const sys = buildTutorSystemPrompt(year);
          const contextTurns: VisionTurn[] = history.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          }));
          const parts = [
            {
              type: 'text' as const,
              text: question + '\n\n(مرفق مع هذه الرسالة ' + images.length + ' صورة — اقرأ التمرين منها بدقة.)',
            },
            ...images.map((url) => ({
              type: 'image_url' as const,
              image_url: { url },
            })),
          ];
          const messages: VisionTurn[] = [
            { role: 'system', content: sys },
            ...contextTurns,
            { role: 'user', content: parts },
          ];

          const answer = await visionChat(primary, messages, AbortSignal.timeout(55000));
          // إرسال النص كأجزاء صغيرة ليعطي إحساس البثّ
          const CHUNK = 120;
          for (let i = 0; i < answer.length; i += CHUNK) {
            controller.enqueue(sse(JSON.stringify({ t: answer.slice(i, i + CHUNK) })));
            await new Promise((r) => setTimeout(r, 30));
          }
          if (!answer.trim()) {
            controller.enqueue(sse(JSON.stringify({ e: 'empty' })));
          }
          done();
        } catch (e) {
          const code = e instanceof Error ? e.message : 'vision-failed';
          controller.enqueue(
            sse(
              JSON.stringify({
                e: code.startsWith('vision-unsupported')
                  ? 'vision-unsupported'
                  : code.includes('-504') || code.includes('timeout')
                    ? 'vision-timeout'
                    : 'vision-failed',
              }),
            ),
          );
          done();
        }
      },
    });
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  }

  // ============ مسار النص: بثّي مع بديل تلقائي ============
  let upstream: Response | null = null;
  try {
    const { primary, fallback } = await resolveAIConfigsWithFallback();
    const messages: ChatTurn[] = [
      { role: 'system', content: buildTutorSystemPrompt(year) },
      ...history,
    ];
    // إعادة محاولة حتى 3 مرات عند فشل الشبكة أو 429/5xx قبل بدء البث
    let lastErr: unknown = null;
    let ok = false;
    const tryStream = async (cfg: Awaited<ReturnType<typeof resolveAIConfigsWithFallback>>['primary']) => {
      for (let attempt = 0; attempt < 3 && !ok; attempt++) {
        try {
          const res = await streamChat(cfg, messages, AbortSignal.timeout(55000));
          if (res.ok && res.body) {
            upstream = res;
            ok = true;
            break;
          }
          lastErr = new Error(`upstream-${res.status}`);
          if (![429, 500, 502, 503, 504].includes(res.status)) break;
        } catch (e) {
          lastErr = e;
        }
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    };
    await tryStream(primary);
    if (!ok && fallback) {
      await new Promise((r) => setTimeout(r, 300));
      await tryStream(fallback);
    }
    if (!ok) throw lastErr;
  } catch (e) {
    const code = e instanceof Error && e.message === 'ai-config-missing' ? 'ai-config-missing' : 'ai-fetch-failed';
    const cause = e instanceof Error ? (e as Error & { cause?: unknown }).cause : undefined;
    console.error('[tutor]', code, e instanceof Error ? e.message : e, 'cause:', cause instanceof Error ? cause.message : String(cause ?? ''));
    return Response.json({ error: code }, { status: 502 });
  }

  const upstreamFinal = upstream as Response | null;
  if (!upstreamFinal || !upstreamFinal.body) {
    return Response.json({ error: 'ai-upstream' }, { status: 502 });
  }

  const upstreamBody = upstreamFinal.body;

  // إعادة البثّ: نفكّ SSE الخام ونمرّر المحتوى للعميل كسطور SSE موحّدة
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let sent = false;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const delta: string | undefined = json.choices?.[0]?.delta?.content;
              if (delta) {
                sent = true;
                controller.enqueue(sse(JSON.stringify({ t: delta })));
              }
            } catch {
              /* سطر غير مكتمل — نتجاهل */
            }
          }
        }
        if (!sent) {
          controller.enqueue(sse(JSON.stringify({ e: 'empty' })));
        }
      } catch {
        if (!sent) {
          try {
            controller.enqueue(sse(JSON.stringify({ e: 'stream-error' })));
          } catch {
            /* القناة مغلقة */
          }
        }
      } finally {
        try {
          controller.enqueue(sse('[DONE]'));
        } catch {
          /* القناة مغلقة */
        }
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() {
      upstreamBody?.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
