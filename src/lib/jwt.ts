// ============================================================
//  @/lib/jwt.ts — أدوات JWT باستخدام مكتبة jose
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  - signToken: يُنشئ JWT للمستخدم
//  - verifyToken: يتحقق من صحة الـ JWT
//  - تستعمل HS256 + سر من NEXTAUTH_SECRET أو ADMIN_KEY
// ============================================================

import { jwtVerify, SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.ADMIN_KEY || "math-platform-default-secret"
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

/**
 * يُنشئ JWT صالح لمدة 30 يومًا.
 */
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("math-platform")
    .setExpirationTime("30d")
    .sign(SECRET);
}

/**
 * يتحقق من JWT ويُرجع المحتوى أو null إذا كان غير صالح.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: "math-platform",
    });
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      role: String(payload.role),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}

/**
 * يستخرج JWT من ترويسة Authorization: Bearer ...
 */
export function extractToken(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const match = /^Bearer\s+(.+)$/i.exec(auth.trim());
  return match ? match[1].trim() : null;
}

/**
 * يحصل على المستخدم الحالي من الطلب.
 */
export async function getCurrentUser(req: Request): Promise<JWTPayload | null> {
  const token = extractToken(req);
  if (!token) return null;
  return await verifyToken(token);
}
