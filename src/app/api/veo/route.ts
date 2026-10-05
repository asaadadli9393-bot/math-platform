import { NextRequest } from 'next/server';

// ============================================================
//  جسر Veo — استدعاء Gemini Video API من بنية Vercel المدعومة
//  ------------------------------------------------------------
//  المشكلة: Google يحجب Gemini API من مناطق معينة (خطأ FAILED_PRECONDITION
//  "User location is not supported") — فلا يمكن استدعاؤه من خوادم التطوير.
//  الحل: خوادم Vercel الإنتاجية في مناطق مدعومة، فتتولى هذه الدالة
//  تمرير الطلبات إلى Google بمفتاح GEMINI_API_KEY المخزّن كمتغير بيئة.
//
//  الأمان: كل الطلبات تتطلب ترويسة x-veo-secret مطابقة لـ VEO_ADMIN_SECRET
//  (متغير بيئة أيضاً) — فلا يستطيع أحد استهلاك الحصة المدفوعة.
//
//  الإجراءات:
//    POST { action: 'models' }                    → قائمة نماذج Veo المتاحة
//    POST { action: 'submit', prompt, imageBase64?, mimeType? } → إطلاق مهمة توليد
//    POST { action: 'poll', op: '<operation>' }   → استعلام حالة المهمة
// ============================================================

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

function apiKey(): string {
  return (process.env.GEMINI_API_KEY || '').trim();
}

function secretOk(req: NextRequest): boolean {
  const s = (process.env.VEO_ADMIN_SECRET || '').trim();
  if (!s) return false;
  const given = req.headers.get('x-veo-secret') || '';
  return given.length === s.length && given === s;
}

async function googleFetch(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      'x-goog-api-key': apiKey(),
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
}

export async function POST(req: NextRequest) {
  if (!apiKey()) return Response.json({ error: 'no-key-configured' }, { status: 500 });
  if (!secretOk(req)) return forbid();

  let body: {
    action?: string;
    prompt?: string;
    imageBase64?: string;
    mimeType?: string;
    op?: string;
    model?: string;
    aspectRatio?: string;
    durationSeconds?: number;
    generateAudio?: boolean;
    negativePrompt?: string;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  /* ---------- قائمة النماذج (تشخيص) ---------- */
  if (body.action === 'models') {
    try {
      const r = await googleFetch(`${BASE}/models?pageSize=200`);
      const j = await r.json().catch(() => ({}));
      const models: string[] = Array.isArray((j as { models?: { name?: string }[] }).models)
        ? (j as { models: { name?: string }[] }).models
          .map((m) => m.name || '')
          .filter((n) => n.toLowerCase().includes('veo'))
        : [];
      return Response.json({ status: r.status, veoModels: models, raw: r.ok ? undefined : j }, { status: r.status });
    } catch (e) {
      return Response.json({ error: 'models-failed', detail: e instanceof Error ? e.message : '?' }, { status: 502 });
    }
  }

  /* ---------- استعلام حالة مهمة ---------- */
  if (body.action === 'poll') {
    const op = (body.op || '').replace(/^\/+/, '');
    if (!op || !op.includes('operations')) return Response.json({ error: 'bad-request' }, { status: 400 });
    try {
      const r = await googleFetch(`${BASE}/${op}`);
      const j = await r.json().catch(() => ({}));
      return Response.json(j, { status: r.status });
    } catch (e) {
      return Response.json({ error: 'poll-failed', detail: e instanceof Error ? e.message : '?' }, { status: 502 });
    }
  }

  /* ---------- إطلاق مهمة توليد ---------- */
  const prompt = (body.prompt || '').trim().slice(0, 2000);
  if (!prompt) return Response.json({ error: 'prompt-required' }, { status: 400 });
  if (body.imageBase64 && body.imageBase64.length > 9_000_000) {
    return Response.json({ error: 'image-too-large' }, { status: 413 });
  }

  const instances: Record<string, unknown>[] = [{ prompt }];
  if (body.imageBase64 && body.mimeType) {
    instances[0].image = { bytesBase64Encoded: body.imageBase64, mimeType: body.mimeType };
  }
  if (body.negativePrompt) {
    instances[0].negativePrompt = body.negativePrompt.slice(0, 500);
  }

  const model = (body.model || 'veo-3.0-generate-001').replace(/[^a-z0-9.\-]/gi, '');
  const parameters: Record<string, unknown> = {
    aspectRatio: body.aspectRatio === '16:9' ? '16:9' : '9:16',
    durationSeconds: 8,
    generateAudio: body.generateAudio === true,
    personGeneration: 'allow_adult',
  };

  try {
    const r = await googleFetch(`${BASE}/models/${model}:predictLongRunning`, {
      method: 'POST',
      body: JSON.stringify({ instances, parameters }),
    });
    const j = await r.json().catch(() => ({}));
    return Response.json(j, { status: r.status });
  } catch (e) {
    return Response.json({ error: 'submit-failed', detail: e instanceof Error ? e.message : '?' }, { status: 502 });
  }
}
