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

/** ترتيب الأولوية: LLM_API_KEY (pollinations — متاح على Vercel) ← ZAI_* ← ملفات الإعداد المحلية */
export async function resolveAIConfig(): Promise<AiConfig> {
  const env = process.env;
  if (env.LLM_API_KEY) {
    return {
      kind: 'pollinations',
      chatUrl: 'https://text.pollinations.ai/openai',
      apiKey: env.LLM_API_KEY,
      model: env.LLM_MODEL || 'openai',
    };
  }
  if (env.ZAI_BASE_URL && env.ZAI_API_KEY) {
    return {
      kind: 'zai',
      chatUrl: `${env.ZAI_BASE_URL.replace(/\/$/, '')}/chat/completions`,
      apiKey: env.ZAI_API_KEY,
      chatId: env.ZAI_CHAT_ID || undefined,
      userId: env.ZAI_USER_ID || undefined,
      token: env.ZAI_TOKEN || undefined,
    };
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
        return {
          kind: 'zai',
          chatUrl: `${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`,
          apiKey: cfg.apiKey,
          chatId: cfg.chatId,
          userId: cfg.userId,
          token: cfg.token,
        };
      }
    } catch {
      /* الملف غير موجود — نتابع */
    }
  }
  throw Object.assign(new Error('ai-config-missing'), { expose: true });
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
    '6) صحّح أخطاء التلميذ بلطف وبيّن «الخطأ الشائع» عند الاقتضاء.',
    '7) اختم كل جواب بسؤال قصير للتأكد من الفهم أو باقتراح خطوة تالية.',
    '8) أبقِ الأجوبة مقتضبة ومنظمة (3 إلى 8 أسطر غالباً) ما لم يُطلب تفصيل أكثر.',
    '9) ابقَ حصراً في نطاق الرياضيات والدراسة والحياة المدرسية لهذا المستوى؛ اعتذر بلطف عن أي طلب آخر.',
    '10) لا تدّعِ أبداً أنك الأستاذ عدلي اسعد نفسه — أنت مساعد ذكي يعمل تحت إشرافه، وإذا سُئلت عن الاشتراك أو المنصة فوجّه التلميذ إلى صفحة الاشتراك.',
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
