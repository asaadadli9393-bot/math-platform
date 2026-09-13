// ============================================================
//  src/lib/llm.ts
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  مُساعد LLM متعدد المزوّدين — يفصل المنصة عن أي SDK خاص.
//
//  المزوّدون المدعومون:
//    1. Pollinations.ai    — مجاني، بدون تسجيل (default fallback)
//    2. Gemini             — Google AI Studio (gemini-3.6-flash)
//    3. ZhipuAI (BigModel) — open.bigmodel.cn (glm-4-flash)
//    4. DeepSeek           — api.deepseek.com (deepseek-chat)
//    5. Groq               — api.groq.com (llama-3.3-70b)
//    6. OpenAI             — api.openai.com (gpt-4o-mini)
//
//  الانتقال التلقائي: إن فشل المزوّد الأساسي، يجرّب التالي.
//
//  متغيرات البيئة (Vercel env vars):
//    LLM_PROVIDER     = "gemini" | "pollinations" | "zhipu" | "deepseek" | "groq" | "openai" | "custom"
//    LLM_API_KEY      = مفتاح API (مطلوب لكل مزوّد ما عدا pollinations)
//    LLM_MODEL        = (اختياري) تجاوز النموذج الافتراضي
//    LLM_BASE_URL     = (اختياري) تجاوز الـ URL الافتراضي
// ============================================================

import { openaiCompatibleChat } from "@/lib/llm-providers";
import { getLocalAnswer } from "@/lib/llm-local";

// ---------------------------------------------------------------------------
//  أنواع
// ---------------------------------------------------------------------------
export type Provider = "gemini" | "pollinations" | "zhipu" | "deepseek" | "groq" | "openai" | "custom" | "local";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

export interface ChatResult {
  content: string;
  provider: Provider;
  model: string;
  tokens?: { prompt: number; completion: number; total: number };
}

// ---------------------------------------------------------------------------
//  قائمة المزوّدين — بالترتيب الذي يُجَرّب
// ---------------------------------------------------------------------------
interface ProviderConfig {
  baseUrl: string;
  model: string;
  // إن كان المزوّد يحتاج API key
  needsAuth: boolean;
  apiKeyEnv: string; // اسم متغير البيئة
  // خاص: مزوّدون لا يحتاجون مفتاحًا (Pollinations)
  noAuth?: boolean;
}

const PROVIDERS: Record<Provider, ProviderConfig> = {
  gemini: {
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-3.6-flash",
    needsAuth: true,
    apiKeyEnv: "LLM_API_KEY",
  },
  pollinations: {
    baseUrl: "https://text.pollinations.ai/openai",
    model: "openai",
    needsAuth: false,
    apiKeyEnv: "",
    noAuth: true,
  },
  zhipu: {
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    needsAuth: true,
    apiKeyEnv: "LLM_API_KEY",
  },
  deepseek: {
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
    needsAuth: true,
    apiKeyEnv: "LLM_API_KEY",
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    needsAuth: true,
    apiKeyEnv: "LLM_API_KEY",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    needsAuth: true,
    apiKeyEnv: "LLM_API_KEY",
  },
  custom: {
    baseUrl: process.env.LLM_BASE_URL || "",
    model: process.env.LLM_MODEL || "default",
    needsAuth: !!process.env.LLM_API_KEY,
    apiKeyEnv: "LLM_API_KEY",
  },
  local: {
    baseUrl: "",
    model: "preset",
    needsAuth: false,
    apiKeyEnv: "",
    noAuth: true,
  },
};

// ---------------------------------------------------------------------------
//  تحديد المزوّد النشط
// ---------------------------------------------------------------------------
function pickProvider(): Provider {
  const forced = (process.env.LLM_PROVIDER || "").toLowerCase() as Provider;
  if (forced && forced in PROVIDERS) return forced;
  // الافتراضي: pollinations (مجاني بدون تسجيل)
  return "pollinations";
}

function buildFallbackChain(): Provider[] {
  const forced = pickProvider();
  if (forced === "gemini") {
    return ["gemini", "pollinations", "groq", "zhipu", "deepseek", "openai"];
  }
  if (forced === "pollinations") {
    return ["pollinations", "gemini", "groq", "zhipu", "deepseek", "openai"];
  }
  return [forced, "pollinations", "gemini", "groq", "zhipu", "deepseek", "openai"];
}

// ---------------------------------------------------------------------------
//  استدعاء API — OpenAI-compatible
// ---------------------------------------------------------------------------
async function callProvider(
  provider: Provider,
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResult> {
  const cfg = PROVIDERS[provider];
  const model = options.model || cfg.model;
  const url = `${cfg.baseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "math-adli/1.0",
  };

  // Pollinations يحتاج referrer أو api-key (اختياري للمجهول)
  if (cfg.noAuth) {
    headers["referrer"] = "https://math-adli.com";
  } else if (cfg.needsAuth) {
    const apiKey = process.env[cfg.apiKeyEnv] || "";
    if (!apiKey) {
      throw new Error(`المزوّد ${provider} يحتاج ${cfg.apiKeyEnv} في متغيرات البيئة`);
    }
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const body = {
    model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 800,
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    // مهلة زمنية للطلب
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`${provider} HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) {
    throw new Error(`${provider} أعاد إجابة فارغة`);
  }

  return {
    content,
    provider,
    model,
    tokens: data?.usage
      ? {
          prompt: data.usage.prompt_tokens ?? 0,
          completion: data.usage.completion_tokens ?? 0,
          total: data.usage.total_tokens ?? 0,
        }
      : undefined,
  };
}

// ---------------------------------------------------------------------------
//  الواجهة العامة — chat() يجرب مزوّدًا تلو الآخر
// ---------------------------------------------------------------------------
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<ChatResult> {
  const chain = buildFallbackChain();
  let lastError: unknown = null;

  for (const provider of chain) {
    try {
      const result = await callProvider(provider, messages, options);
      if (result.content && !result.content.includes("budget")) {
        return result;
      }
    } catch (err) {
      lastError = err;
      // نتابع للمزوّد التالي
    }
  }

  // فشل كل المزوّدين — نرجع خطأً واضحًا
  throw new Error(
    `تعذّر الحصول على رد من أي مزوّد. آخر خطأ: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`
  );
}

// ---------------------------------------------------------------------------
//  chatWithFallback — مثل chat، لكن يرجع ردًا محليًا عند الفشل
//  بدلًا من رمي استثناء
// ---------------------------------------------------------------------------
export async function chatWithFallback(
  messages: ChatMessage[],
  options: ChatOptions & { fallbackQuestion?: string } = {}
): Promise<ChatResult & { usedFallback: boolean; suggestedUnit?: string }> {
  try {
    const result = await chat(messages, options);
    return { ...result, usedFallback: false };
  } catch {
    // استعمال الـ fallback المحلي
    const question = options.fallbackQuestion ||
      messages.findLast((m) => m.role === "user")?.content ||
      "";
    const local = getLocalAnswer(question);
    return {
      content: local?.content ?? "عذراً، تعذّر الإجابة حاليًا. حاول لاحقًا.",
      provider: "local",
      model: "preset",
      usedFallback: true,
      suggestedUnit: local?.suggestedUnit,
    };
  }
}

// ---------------------------------------------------------------------------
//  TTS — نظام متعدد المزوّدين (Google Translate + StreamElements + Pollinations)
// ---------------------------------------------------------------------------
export async function tts(text: string, voice = "ar"): Promise<{
  audio: ArrayBuffer;
  format: string;
  provider: string;
}> {
  // 1) Google Translate TTS — يدعم العربية ممتاز، مجاني، بدون مفتاح
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text.slice(0, 200)
    )}&tl=ar&client=tw-ob&total=1&idx=0&textlen=${text.length}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/",
        "Accept": "audio/mpeg, audio/*, */*",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      const audio = await response.arrayBuffer();
      if (audio.byteLength > 1000) {
        return {
          audio,
          format: "mp3",
          provider: "google-translate",
        };
      }
    }
  } catch {
    // نتابع للمزوّد التالي
  }

  // 2) Pollinations TTS — مجاني، بدون مفتاح
  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(
      text.slice(0, 512)
    )}?model=openai-audio&voice=tongtong&response_format=mp3`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "math-adli/1.0" },
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      const audio = await response.arrayBuffer();
      if (audio.byteLength > 1000) {
        return {
          audio,
          format: "mp3",
          provider: "pollinations",
        };
      }
    }
  } catch {
    // نتابع للمزوّد التالي
  }

  // 3) Fallback: WAV فارغ
  return {
    audio: new ArrayBuffer(44),
    format: "wav",
    provider: "fallback-empty",
  };
}

// ---------------------------------------------------------------------------
//  اختبار سريع
// ---------------------------------------------------------------------------
export async function testLLM(): Promise<{ ok: boolean; message: string; provider?: string }> {
  try {
    const result = await chat(
      [
        { role: "system", content: "You are a test bot." },
        { role: "user", content: "Reply with: OK" },
      ],
      { temperature: 0, max_tokens: 10 }
    );
    return {
      ok: true,
      message: `LLM OK (${result.provider}/${result.model}): ${result.content.slice(0, 50)}`,
      provider: result.provider,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `LLM فشل: ${msg}` };
  }
}
