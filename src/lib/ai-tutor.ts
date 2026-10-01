import fs from 'fs/promises';
import os from 'os';
import path from 'path';

// ============================================================
//  طبقة الذكاء الاصطناعي — المدرّس الذكي (تدرّج AI)
//  خادميّة فقط. تدعم مزوّدين:
//  1) z.ai الداخلي (بيئة التطوير) عبر ZAI_* أو ملف .z-ai-config
//  2) بوابة Pollinations (الإنتاج على Vercel) عبر LLM_API_KEY
// ============================================================

export interface AiConfig {
  kind: 'zai' | 'pollinations';
  chatUrl: string;
  apiKey: string;
  chatId?: string;
  userId?: string;
  token?: string;
  model?: string;
}

/** مرشّحات المزوّدين بالترتيب: بوابة z.ai (نص + رؤية) ← Pollinations (نص فقط) ← ملفات الإعداد المحلية */
async function buildCandidates(): Promise<AiConfig[]> {
  const env = process.env;
  const list: AiConfig[] = [];

  if (env.ZAI_BASE_URL && env.ZAI_API_KEY) {
    list.push({
      kind: 'zai',
      chatUrl: `${env.ZAI_BASE_URL.replace(/\/$/, '')}/chat/completions`,
      apiKey: env.ZAI_API_KEY,
      chatId: env.ZAI_CHAT_ID || undefined,
      userId: env.ZAI_USER_ID || undefined,
      token: env.ZAI_TOKEN || undefined,
      model: env.ZAI_MODEL || undefined,
    });
  }
  if (env.LLM_API_KEY) {
    list.push({
      kind: 'pollinations',
      chatUrl: 'https://text.pollinations.ai/openai',
      apiKey: env.LLM_API_KEY,
      model: env.LLM_MODEL || 'openai',
    });
  }

  const paths = [
    path.join(process.cwd(), '.z-ai-config'),
    path.join(os.homedir(), '.z-ai-config'),
    '/etc/.z-ai-config',
  ];
  for (const p of paths) {
    try {
      const raw = await fs.readFile(p, 'utf-8');
      const cfg = JSON.parse(raw) as {
        baseUrl?: string;
        apiKey?: string;
        chatId?: string;
        userId?: string;
        token?: string;
      };
      if (cfg.baseUrl && cfg.apiKey) {
        list.push({
          kind: 'zai',
          chatUrl: `${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`,
          apiKey: cfg.apiKey,
          chatId: cfg.chatId,
          userId: cfg.userId,
          token: cfg.token,
        });
      }
      break; // أول ملف موجود يكفي
    } catch {
      /* الملف غير موجود — نتابع */
    }
  }

  return list;
}

/** الإعداد الأساسي (يُفضّل z.ai — GLM أقوى في الرياضيات ويدعم الرؤية) */
export async function resolveAIConfig(): Promise<AiConfig> {
  const list = await buildCandidates();
  if (!list.length) throw Object.assign(new Error('ai-config-missing'), { expose: true });
  return list[0];
}

/** الإعداد الأساسي + بديل من مزوّد آخر للنصوص */
export async function resolveAIConfigsWithFallback(): Promise<{ primary: AiConfig; fallback?: AiConfig }> {
  const list = await buildCandidates();
  if (!list.length) throw Object.assign(new Error('ai-config-missing'), { expose: true });
  const primary = list[0];
  const fallback = list.find((c) => c.kind !== primary.kind);
  return { primary, fallback };
}

const YEAR_NAMES: Record<string, string> = {
  y1: 'السنة الأولى ثانوي (جذع مشترك علوم وتكنولوجيا أو جذع مشترك آداب)',
  y2: 'السنة الثانية ثانوي (علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد أو آداب)',
  y3: 'السنة الثالثة ثانوي (علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد أو آداب) — سنة البكالوريا',
};

/** رسالة النظام: شخصية المدرّس الذكي ومنهجيته */
export function buildTutorSystemPrompt(year: string): string {
  const level = YEAR_NAMES[year] ?? YEAR_NAMES.y1;
  return [
    'أنت «المدرّس الذكي» في منصة تدرّج للرياضيات، وتعمل تحت إشراف الأستاذ عدلي اسعد.',
    `تلميذك في التعليم الثانوي الجزائري — ${level}.`,
    '',
    'منهجيتك في كل جواب:',
    '1) أجب دائماً بالعربية الفصحى الواضحة، بأسلوب معلم مشجع وصبور وواثق.',
    '2) اكتب الرياضيات بصيغة LaTeX داخل $...$ للسطري و$$...$$ للمعادلات المستقلة فقط — لا تستعمل أبداً فواصل \\[ \\] أو \\( \\) — ولا تستعمل أوسمة ماركداون إلا **العريض**. لا تستعمل عناوين # ولا جداول ولا وسوم HTML مثل <br> إطلاقاً — نص وأسطر مرقمة فقط.',
    '3) اشرح خطوة بخطوة: المطلوب، ثم المعطيات، ثم القانون أو النظرية المستعملة، ثم الحل، ثم تحقق سريع أو خلاصة.',
    '4) اربط الشرح بمنهاج الثانوي الجزائري (المتتاليات، الدوال، الاشتقاق، اللوغاريتمات، الاحتمالات، الأعداد المركبة، الهندسة في الفضاء… حسب المستوى).',
    '5) أمام تمرين كامل: اشرح الفكرة الأولى وخطوة البداية ثم اسأل التلميذ ليُكمل بنفسه، إلا إذا طلب الحل الكامل صراحة أو كان الأمر نظرياً — عندها قدّمه كاملاً مرقّماً.',
    '6) عند إرسال تلميذ صورة (تمرين، فرض، موضوع بكالوريا، ورقة مكتوبة بخط اليد): اقرأ نصّ التمرين من الصورة بدقة أولاً، إن تعذّرت قراءة جزء فاطلب توضيحه، ثم عامل التمرين كما لو كُتب نصاً — ابدأ بعبارة «قرأتُ في الصورة: …» واكتب المعطيات، ثم حلّ خطوة بخطوة. إذا كانت الصورة ليست تمريناً في الرياضيات فتذكّر التلميذ بلطف أنك مدرّس رياضيات.',
    '7) صحّح أخطاء التلميذ بلطف وبيّن «الخطأ الشائع» عند الاقتضاء.',
    '8) اختم كل جواب بسؤال قصير للتأكد من الفهم أو باقتراح خطوة تالية.',
    '9) أبقِ الأجوبة مقتضبة ومنظمة (3 إلى 8 أسطر غالباً) ما لم يُطلب تفصيل أكثر.',
    '10) ابقَ حصراً في نطاق الرياضيات والدراسة والحياة المدرسية لهذا المستوى؛ اعتذر بلطف عن أي طلب آخر.',
    '11) لا تدّعِ أبداً أنك الأستاذ عدلي اسعد نفسه — أنت مساعد ذكي يعمل تحت إشرافه، وإذا سُئلت عن الاشتراك أو المنصة فوجّه التلميذ إلى صفحة الاشتراك.',
  ].join('\n');
}

export interface ChatTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/** استدعاء بثّي لنقطة نهاية المحادثة — يعيد Response الخام للبث */
export async function streamChat(
  cfg: AiConfig,
  messages: ChatTurn[],
  signal?: AbortSignal,
): Promise<Response> {
  const body =
    cfg.kind === 'pollinations'
      ? {
          model: cfg.model ?? 'openai',
          messages: messages.map((m) => ({
            role: m.role === 'system' ? 'system' : m.role,
            content: m.content,
          })),
          stream: true,
        }
      : {
          messages: messages.map((m) =>
            m.role === 'system' ? { role: 'assistant', content: m.content } : { role: m.role, content: m.content },
          ),
          thinking: { type: 'disabled' },
          stream: true,
        };

  return fetch(cfg.chatUrl, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cfg.apiKey}`,
      ...(cfg.kind === 'zai'
        ? {
            'X-Z-AI-From': 'Z',
            ...(cfg.chatId ? { 'X-Chat-Id': cfg.chatId } : {}),
            ...(cfg.userId ? { 'X-User-Id': cfg.userId } : {}),
            ...(cfg.token ? { 'X-Token': cfg.token } : {}),
          }
        : {}),
    },
    body: JSON.stringify(body),
  });
}

// ---------- الرؤية: قراءة صور التمارين عبر بوابة z.ai (glm-5v-turbo) ----------
export interface VisionPart {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string };
}

export interface VisionTurn {
  role: 'user' | 'assistant' | 'system';
  content: string | VisionPart[];
}

/** نموذج الرؤية الافتراضي على بوابة z.ai */
const VISION_MODEL = process.env.ZAI_VISION_MODEL || 'glm-5v-turbo';

function zaiVisionHeaders(cfg: AiConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cfg.apiKey}`,
    'X-Z-AI-From': 'Z',
    ...(cfg.chatId ? { 'X-Chat-Id': cfg.chatId } : {}),
    ...(cfg.userId ? { 'X-User-Id': cfg.userId } : {}),
    ...(cfg.token ? { 'X-Token': cfg.token } : {}),
  };
}

/** استدعاء غير بثّي لنموذج الرؤية — يعيد النص الكامل أو يرمي خطأ */
export async function visionChat(
  cfg: AiConfig,
  messages: VisionTurn[],
  signal?: AbortSignal,
): Promise<string> {
  if (cfg.kind !== 'zai') {
    throw Object.assign(new Error('vision-unsupported'), { expose: true });
  }
  const visionUrl = cfg.chatUrl.replace(/\/chat\/completions$/, '') + '/chat/completions/vision';

  const call = async (msgs: VisionTurn[]): Promise<string> => {
    const res = await fetch(visionUrl, {
      method: 'POST',
      signal,
      headers: zaiVisionHeaders(cfg),
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: msgs,
        thinking: { type: 'disabled' },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[tutor-vision] upstream', res.status, detail.slice(0, 400));
      throw Object.assign(
        new Error(`vision-upstream-${res.status}`),
        { expose: true, status: res.status, detail: detail.slice(0, 300) },
      );
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
    };
    const raw = json.choices?.[0]?.message?.content;
    if (typeof raw === 'string') return raw;
    if (Array.isArray(raw)) return raw.map((p) => p?.text ?? '').join('');
    return '';
  };

  try {
    const text = await call(messages);
    if (text.trim()) return text;
    throw Object.assign(new Error('vision-empty'), { expose: true });
  } catch (e) {
    const status = (e as { status?: number }).status;
    // بعض البوابات ترفض دور system في الرؤية — ندمج التعليمات في رسالة المستخدم الأولى ونعيد المحاولة مرة واحدة
    if (status && status >= 400 && status < 500 && messages[0]?.role === 'system') {
      const sysText =
        typeof messages[0].content === 'string'
          ? messages[0].content
          : messages[0].content.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('\n');
      const rest = messages.slice(1).map((m) => {
        if (m.role === 'user' && typeof m.content === 'string') {
          return { role: m.role, content: [{ type: 'text' as const, text: sysText + '\n\n---\n' + m.content }] };
        }
        if (m.role === 'user' && Array.isArray(m.content)) {
          const textParts = m.content.filter((p) => p.type === 'text');
          const other = m.content.filter((p) => p.type !== 'text');
          return {
            role: m.role,
            content: [{ type: 'text' as const, text: sysText + '\n\n---\n' + textParts.map((p) => p.text ?? '').join('\n') }, ...other],
          };
        }
        return { role: m.role, content: m.content };
      }) as VisionTurn[];
      const text = await call(rest);
      if (text.trim()) return text;
    }
    throw e;
  }
}

// ---------- حد بسيط للطلب الحقيقي (حماية من الاستعمال المفرط) ----------
const hits = new Map<string, number[]>();
const WINDOW_MS = 5 * 60 * 1000;
const WINDOW_MAX = 25;

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= WINDOW_MAX) {
    hits.set(ip, arr);
    return false;
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return true;
}
