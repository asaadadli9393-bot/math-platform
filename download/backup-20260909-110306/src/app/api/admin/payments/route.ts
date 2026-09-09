// ============================================================
//  /api/admin/payments — إدارة المدفوعات (لوحة الإدارة)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET   : جلب كل المدفوعات (مع فلترة اختيارية بـ status و search)
//          ?status=PENDING|VERIFIED|REJECTED|EXPIRED|CANCELLED
//          ?search=...  (يبحث في paymentId, transactionRef, phone, studentName, email)
//          محمي بـ Authorization: Bearer ADMIN_KEY
//  PATCH : تحديث حالة دفعة واحدة (verify/reject/expire/cancel)
//          الجسم: { paymentId: string, action: "verify"|"reject"|"expire"|"cancel", durationMonths?: number }
//          عند verify: يضبط expiresAt = now + durationMonths شهراً (افتراضي 1)
// ============================================================

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";
import {
  notifyPaymentVerified,
  notifyPaymentRejected,
  notifyPaymentExpired,
  notifyPaymentCancelled,
} from "@/lib/notifications";

export const runtime = "nodejs";

type PaymentStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED" | "CANCELLED";
type Action = "verify" | "reject" | "expire" | "cancel";

const ACTION_TO_STATUS: Record<Action, PaymentStatus> = {
  verify: "VERIFIED",
  reject: "REJECTED",
  expire: "EXPIRED",
  cancel: "CANCELLED",
};

const VALID_STATUSES = new Set<PaymentStatus>([
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
]);

/**
 * إضافة عدد شهور إلى تاريخ (معالجة الفائض في الأيام تلقائياً).
 */
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setMonth(targetMonth);
  return d;
}

export async function GET(req: Request) {
  // التحقق من Bearer ADMIN_KEY
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const statusParam = (url.searchParams.get("status") ?? "").toUpperCase();
  const search = (url.searchParams.get("search") ?? "").trim();

  try {
    // بناء شرط البحث
    const where: Prisma.PaymentWhereInput = {};

    if (statusParam && VALID_STATUSES.has(statusParam as PaymentStatus)) {
      where.status = statusParam as PaymentStatus;
    }

    if (search) {
      where.OR = [
        { paymentId: { contains: search } },
        { transactionRef: { contains: search } },
        { phone: { contains: search } },
        { studentName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const payments = await db.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    return NextResponse.json({ success: true, payments });
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
  const paymentId = typeof obj.paymentId === "string" ? obj.paymentId : "";
  const actionRaw = typeof obj.action === "string" ? obj.action : "";
  const action = actionRaw as Action;

  // durationMonths اختياري — عند verify فقط (افتراضي 1)
  const durationMonthsRaw = obj.durationMonths;
  const durationMonths =
    typeof durationMonthsRaw === "number" && Number.isFinite(durationMonthsRaw) && durationMonthsRaw > 0
      ? Math.floor(durationMonthsRaw)
      : typeof durationMonthsRaw === "string" && /^\d+$/.test(durationMonthsRaw)
      ? parseInt(durationMonthsRaw, 10)
      : 1;

  if (!paymentId) {
    return NextResponse.json(
      { success: false, error: "paymentId مطلوب" },
      { status: 400 }
    );
  }
  if (!(action in ACTION_TO_STATUS)) {
    return NextResponse.json(
      {
        success: false,
        error: "action غير معروف — استعمل verify|reject|expire|cancel",
      },
      { status: 400 }
    );
  }

  try {
    const existing = await db.payment.findUnique({
      where: { paymentId },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "الدفعة غير موجودة" },
        { status: 404 }
      );
    }

    const newStatus = ACTION_TO_STATUS[action];
    const now = new Date();
    const verifiedAt = action === "verify" ? now : existing.verifiedAt;

    // عند التحقق، نضبط انتهاء الصلاحية = الآن + durationMonths شهراً
    let expiresAt: Date | null = existing.expiresAt;
    if (action === "verify") {
      expiresAt = addMonths(now, durationMonths);
    }

    const updated = await db.payment.update({
      where: { paymentId },
      data: {
        status: newStatus,
        verifiedAt,
        expiresAt,
      },
    });

    // إشعارات لوحة الإدارة (داخل try ولا تُسقط العملية)
    try {
      if (action === "verify") {
        await notifyPaymentVerified({
          paymentId: existing.paymentId,
          phone: existing.phone,
        });
      } else if (action === "reject") {
        await notifyPaymentRejected({
          paymentId: existing.paymentId,
          phone: existing.phone,
        });
      } else if (action === "expire") {
        await notifyPaymentExpired({
          paymentId: existing.paymentId,
          phone: existing.phone,
        });
      } else if (action === "cancel") {
        await notifyPaymentCancelled({
          paymentId: existing.paymentId,
          phone: existing.phone,
        });
      }
    } catch {
      // الإشعارات تحسين وليست شرطاً
    }

    return NextResponse.json({ success: true, payment: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}
