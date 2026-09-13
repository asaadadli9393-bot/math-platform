// ============================================================
//  src/lib/llm-providers.ts
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  مُساعدات للمزوّدين OpenAI-compatible.
// ============================================================

export interface OpenAICompatibleResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  model?: string;
}

/**
 * استدعاء OpenAI-compatible API عام.
 */
export async function openaiCompatibleChat(opts: {
  baseUrl: string;
  apiKey?: string;
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  temperature?: number;
  max_tokens?: number;
}): Promise<OpenAICompatibleResponse> {
  const { baseUrl, apiKey, model, messages, temperature = 0.7, max_tokens = 800 } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "math-adli/1.0",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages, temperature, max_tokens }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
  }
  return (await response.json()) as OpenAICompatibleResponse;
}
