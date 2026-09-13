// ============================================================
//  src/lib/z-ai.ts
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  مُساعد لتحميل z-ai-web-dev-sdk.
//
//  في الإنتاج (Vercel): يستعمل متغيرات البيئة Z_AI_* لإنشاء ملف
//  .z-ai-config مؤقّتًا، ثم يستدعي ZAI.create() التي تبحث عنه.
//
//  محليًا: إن وُجد ملف .z-ai-config في الجذر، يستعمله مباشرة.
//
//  المتغيرات المطلوبة (Vercel env vars):
//    - Z_AI_BASE_URL  (مثلاً: https://internal-api.z.ai/v1)
//    - Z_AI_API_KEY
//    - Z_AI_CHAT_ID   (اختياري)
//    - Z_AI_USER_ID   (اختياري)
//    - Z_AI_TOKEN     (اختياري)
// ============================================================

import path from "node:path";
import fs from "node:fs/promises";
import type ZAISDK from "z-ai-web-dev-sdk";

let cachedZAI: ZAISDK | null = null;
let configWritten = false;

const CONFIG_FILE_NAME = ".z-ai-config";

/**
 * كتابة ملف .z-ai-config من متغيرات البيئة.
 * (تنفّذ مرة واحدة فقط — cachedZAI بعد ذلك)
 */
async function writeConfigFromEnv(): Promise<boolean> {
  if (configWritten) return true;

  const baseUrl = process.env.Z_AI_BASE_URL;
  const apiKey = process.env.Z_AI_API_KEY;

  if (!baseUrl || !apiKey) {
    return false;
  }

  const config = {
    baseUrl,
    apiKey,
    chatId: process.env.Z_AI_CHAT_ID ?? undefined,
    userId: process.env.Z_AI_USER_ID ?? undefined,
    token: process.env.Z_AI_TOKEN ?? undefined,
  };

  // الكتابة في عدة مواقع محتملة لتغطية Vercel + Local
  const paths = [
    path.join(process.cwd(), CONFIG_FILE_NAME),       // cwd
    path.join("/tmp", CONFIG_FILE_NAME),               // /tmp (Vercel writable)
    path.join(process.env.HOME || "/home/z", CONFIG_FILE_NAME), // home
  ];

  for (const p of paths) {
    try {
      await fs.writeFile(p, JSON.stringify(config), "utf-8");
    } catch {
      // بعض المسارات قد لا تكون قابلة للكتابة — نتجاوز
    }
  }

  // Vercel: نشير إلى HOME الذي يبحث فيه z-ai-web-dev-sdk
  // تحديد HOME إلى /tmp قد يحل المشكلة في serverless functions
  if (!process.env.HOME) {
    process.env.HOME = "/tmp";
  }

  configWritten = true;
  return true;
}

/**
 * تحميل Z-AI SDK — يستعمل cache للحفاظ على الأداء.
 */
export async function getZAI(): Promise<ZAISDK> {
  if (cachedZAI) return cachedZAI;

  // محاولة 1: كتابة ملف config من env vars، ثم استدعاء ZAI.create()
  const wroteConfig = await writeConfigFromEnv();
  if (wroteConfig) {
    try {
      const ZAIModule = await import("z-ai-web-dev-sdk");
      const ZAIClass = (ZAIModule as unknown as { default: { create(): Promise<ZAISDK> } }).default;
      cachedZAI = await ZAIClass.create();
      return cachedZAI;
    } catch (e) {
      // نتابع إلى الطريقة التالية
    }
  }

  // محاولة 2: استدعاء ZAI.create() مباشرة (للتطوير المحلي مع .z-ai-config موجود)
  try {
    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAIClass = (ZAIModule as unknown as { default: { create(): Promise<ZAISDK> } }).default;
    cachedZAI = await ZAIClass.create();
    return cachedZAI;
  } catch (e) {
    throw new Error(
      "تعذّر تحميل Z-AI SDK. تأكد من توفّر متغيرات البيئة Z_AI_BASE_URL و Z_AI_API_KEY " +
      "أو ملف .z-ai-config في المسار."
    );
  }
}

/**
 * اختبار Z-AI — يعيد نجاح أو فشل.
 */
export async function testZAI(): Promise<{ ok: boolean; message: string }> {
  try {
    const zai = await getZAI();
    const r = await zai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a test bot." },
        { role: "user", content: "Reply with: OK" },
      ],
      temperature: 0,
      max_tokens: 5,
    });
    const content = r.choices?.[0]?.message?.content ?? "";
    return { ok: true, message: `Z-AI OK: ${String(content).slice(0, 50)}` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `Z-AI فشل: ${msg}` };
  }
}
