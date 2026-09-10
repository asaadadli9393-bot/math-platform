// ============================================================
//  /api/auth/login — تسجيل دخول الطالب
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { email, password }
//  يُرجع: { success: true, token, user } | { success: false, error }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "البريد وكلمة السر مطلوبان" },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      await new Promise((r) => setTimeout(r, 200)); // تأخير لتفادي brute force
      return NextResponse.json(
        { success: false, error: "البريد أو كلمة السر غير صحيحة" },
        { status: 401 }
      );
    }

    // التحقق من كلمة السر
    if (!verifyPassword(password, user.passwordHash)) {
      await new Promise((r) => setTimeout(r, 200));
      return NextResponse.json(
        { success: false, error: "البريد أو كلمة السر غير صحيحة" },
        { status: 401 }
      );
    }

    // إنشاء JWT
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        city: user.city,
      },
    });
  } catch (err) {
    console.error("[login] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
