// ============================================================
//  /api/auth/me — معلومات المستخدم الحالي
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET مع ترويسة Authorization: Bearer <token>
//  يُرجع: { success: true, user } | { success: false, error: 401 }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const payload = await getCurrentUser(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "غير مُسجّل الدخول" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        city: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("[me] خطأ:", err);
    return NextResponse.json(
      { success: false, error: "حدث خطأ. حاول مرة أخرى." },
      { status: 500 }
    );
  }
}
