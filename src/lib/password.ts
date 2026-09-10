// ============================================================
//  @/lib/password.ts — أدوات تجزئة كلمات السر
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  - hashPassword: باستخدام scrypt (مدمج في Node.js، بدون مكتبات خارجية)
//  - verifyPassword: مقارنة ثابتة الزمن
// ============================================================

import crypto from "node:crypto";

/**
 * يُجَزّئ كلمة السر باستخدام scrypt (N=16384, r=8, p=1).
 * يُرجع سلسلة بصيغة: <salt_hex>:<hash_hex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
  });
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * يتحقق من كلمة السر مقابل التجزئة المخزّنة.
 * يستعمل مقارنة ثابتة الزمن لتفادي timing attacks.
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [saltHex, hashHex] = stored.split(":");
    if (!saltHex || !hashHex) return false;
    const salt = Buffer.from(saltHex, "hex");
    const storedHash = Buffer.from(hashHex, "hex");
    const computed = crypto.scryptSync(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
    });
    if (computed.length !== storedHash.length) return false;
    return crypto.timingSafeEqual(computed, storedHash);
  } catch {
    return false;
  }
}

/**
 * يتحقق من قوة كلمة السر.
 * على الأقل 6 أحرف، حرف واحد + رقم واحد.
 */
export function isStrongPassword(password: string): boolean {
  if (password.length < 6) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}
