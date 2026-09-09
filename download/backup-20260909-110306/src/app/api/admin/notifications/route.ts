// ============================================================
//  /api/admin/notifications — إشعارات لوحة الإدارة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET   : جلب كل الإشعارات (فلترة اختيارية ?unread=true)
//          محمي بـ Authorization: Bearer ADMIN_KEY
//  PATCH : تعليم إشعار كمقروء
//          الجسم: { id: string } لتعليم واحد
//                 { all: true } لتعليم الكل كمقروء
// ============================================================

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

// معرّف المستخدم الإداري الوهمي الذي تُربط به إشعارات اللوحة
const ADMIN_USER_ID = "admin-notifications";

export async function GET(req: Request) {
  // التحقق من Bearer ADMIN_KEY
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const unreadParam = url.searchParams.get("unread");
  const onlyUnread = unreadParam === "true" || unreadParam === "1";

  try {
    const where: Prisma.NotificationWhereInput = { userId: ADMIN_USER_ID };
    if (onlyUnread) {
      where.read = false;
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    // إحصاء الإشعارات غير المقروءة لإظهارها في الشارة
    const unreadCount = await db.notification.count({
      where: { userId: ADMIN_USER_ID, read: false },
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  // التحقق من Bearer ADMIN_KEY
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON" },
      { status: 400 }
    );
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { success: false, error: "Invalid body" },
      { status: 400 }
    );
  }
  const obj = body as Record<string, unknown>;

  try {
    // تعليم كل الإشعارات كمقروءة
    if (obj.all === true) {
      const result = await db.notification.updateMany({
        where: { userId: ADMIN_USER_ID, read: false },
        data: { read: true },
      });
      return NextResponse.json({
        success: true,
        updated: result.count,
      });
    }

    // تعليم إشعار واحد كمقروء
    const id = typeof obj.id === "string" ? obj.id : "";
    if (!id) {
      return NextResponse.json(
        { success: false, error: "id مطلوب أو all: true" },
        { status: 400 }
      );
    }
    const updated = await db.notification.update({
      where: { id },
      data: { read: true },
    });
    return NextResponse.json({ success: true, notification: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}
