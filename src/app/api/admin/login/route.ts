// ============================================================
//  /api/admin/login — تسجيل دخول لوحة الإدارة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { password: string }
//   - safeEqual (مقارنة ثابتة الزمن)
//   - تأخير 200ms عند الفشل لتفادي brute force
//   - يُرجع { success: true, token: password, message } عند النجاح
//   - كلمة السر الافتراضية: adli-asad-2024-math
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// كلمة السر الافتراضية للوحة الإدارة
const DEFAULT_ADMIN_KEY = "adli-asad-2024-math";

/**
 * مقارنة ثابتة الزمن لتفادي هجمات التوقيت (timing attacks).
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = (body?.password ?? "").trim();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "كلمة السر مطلوبة" },
        { status: 400 }
      );
    }

    // كلمة السر من البيئة أو الافتراضية
    const adminKey = process.env.ADMIN_KEY ?? DEFAULT_ADMIN_KEY;

    if (!safeEqual(password, adminKey)) {
      // تأخير 200ms لتفادي brute force
      await new Promise((r) => setTimeout(r, 200));
      return NextResponse.json(
        { success: false, error: "كلمة السر غير صحيحة" },
        { status: 401 }
      );
    }

    // الرمز هو نفسه كلمة السر (حسب المواصفات)
    return NextResponse.json({
      success: true,
      token: password,
      message: "تم تسجيل الدخول",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطأ في تسجيل الدخول" },
      { status: 500 }
    );
  }
}
