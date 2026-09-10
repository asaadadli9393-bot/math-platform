// ============================================================
//  /api/auth/register — تسجيل طالب جديد
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { name, email, password, phone?, city?, stream? }
//  يُرجع: { success: true, token, user } | { success: false, error }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, isStrongPassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim().toLowerCase();
    const password = (body?.password ?? "").toString();
    const phone = (body?.phone ?? "").toString().trim() || null;
    const city = (body?.city ?? "").toString().trim() || null;
    const stream = (body?.stream ?? "EXPERIMENTAL_SCIENCES").toString();

    // التحقق من المدخلات
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "الاسم مطلوب (حرفان على الأقل)" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني غير صالح" },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error: "كلمة السر يجب أن تكون 6 أحرف على الأقل وتحتوي على حروف وأرقام",
        },
        { status: 400 }
      );
    }

    // التحقق من عدم تكرار البريد
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "هذا البريد الإلكتروني مُسجّل مسبقاً" },
        { status: 409 }
      );
    }

    // التحقق من صحة الشعبة
    const validStreams = ["EXPERIMENTAL_SCIENCES", "MATHEMATICS", "TECHNICAL_MATH"];
    const finalStream = validStreams.includes(stream) ? stream : "EXPERIMENTAL_SCIENCES";

    // إنشاء المستخدم
    const user = await db.user.create({
      data: {
        email,
        name,
        passwordHash: hashPassword(password),
        role: "STUDENT",
        phone,
        city,
      },
    });

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
        stream: finalStream,
      },
    });
  } catch (err) {
    console.error("[register] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء التسجيل. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
