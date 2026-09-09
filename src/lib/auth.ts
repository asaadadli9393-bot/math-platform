// ============================================================
//  @/lib/auth.ts — أدوات المصادقة للوحة الإدارة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  - safeEqual: مقارنة ثابتة الزمن لتفادي timing attacks
//  - verifyAdminToken: يتحقق من رمز Bearer المرسل في الطلب
//  - ADMIN_KEY: كلمة سر الإدارة (يجب أن تطابق المتوقع على الخادم)
// ============================================================

import crypto from "node:crypto";

/**
 * كلمة سر الإدارة المتوقعة (يجب أن تطابق ما يُرسل من زر الدخول).
 * لا تُكشف في العميل أبداً. تستعمل كمفتاح Bearer للطلبات المحمية.
 */
export const ADMIN_KEY = "adli-asad-2024-math";

/**
 * مقارنة ثابتة الزمن لتفادي هجمات التوقيت (timing attacks).
 * تطبّق نفس منطق crypto.timingSafeEqual لكنها تتحمّل أطوالاً مختلفة
 * دون أن يكشف طول السلسلة شيئاً عن النتيجة.
 */
export function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");

  // إذا اختلف الطول نُجري مقارنة وهمية بنفس الطول ثم نُرجع false
  if (aBuf.length !== bBuf.length) {
    const dummy = Buffer.alloc(aBuf.length);
    crypto.timingSafeEqual(aBuf, dummy);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * يستخرج رمز Bearer من ترويسة Authorization ويتحقق منه عبر safeEqual.
 * يُرجع true فقط إذا كان الرمز صحيحاً تماماً.
 */
export function verifyAdminToken(authHeader: string | null): boolean {
  if (!authHeader) return false;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader.trim());
  if (!match) return false;
  const token = match[1].trim();
  return safeEqual(token, ADMIN_KEY);
}

/**
 * يقرأ ترويسة Authorization من كائن Request ثم يتحقق منها.
 */
export async function isAuthorized(req: Request): Promise<boolean> {
  const auth = req.headers.get("authorization");
  return verifyAdminToken(auth);
}
