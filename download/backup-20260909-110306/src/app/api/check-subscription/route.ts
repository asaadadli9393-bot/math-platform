// ============================================================
//  /api/check-subscription — تحقق من حالة الاشتراك على الخادم
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { phone?: string, transactionRef?: string, paymentId?: string }
//   - يُعيد نتيجة موثّقة من قاعدة البيانات (الحالة + فعّال أم لا)
//   - يُستعمل بعد إتمام الدفع أو بعد التحقق اليدوي من لوحة الإدارة
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function sanitize(s: unknown, max = 64): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

/**
 * نوع مدفوعة كاملة كما يُرجعها Prisma.
 */
type PaymentRow = NonNullable<
  Awaited<ReturnType<typeof db.payment.findFirst>> | Awaited<ReturnType<typeof db.payment.findUnique>>
>;

function isSubscriptionActive(payment: PaymentRow): boolean {
  if (payment.status !== "VERIFIED") return false;
  if (!payment.expiresAt) return true;
  return new Date(payment.expiresAt) > new Date();
}

export async function POST(req: Request) {
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
  const phone = sanitize(obj.phone, 32);
  const transactionRef = sanitize(obj.transactionRef, 64);
  const paymentId = sanitize(obj.paymentId, 64);

  if (!phone && !transactionRef && !paymentId) {
    return NextResponse.json(
      {
        success: false,
        error: "phone أو transactionRef أو paymentId مطلوب",
      },
      { status: 400 }
    );
  }

  try {
    let payment: PaymentRow | null = null;

    if (paymentId) {
      const found = await db.payment.findUnique({ where: { paymentId } });
      payment = found ?? null;
    } else if (transactionRef) {
      const found = await db.payment.findFirst({
        where: { transactionRef },
        orderBy: { createdAt: "desc" },
      });
      payment = found ?? null;
    } else if (phone) {
      const found = await db.payment.findFirst({
        where: { phone },
        orderBy: { createdAt: "desc" },
      });
      payment = found ?? null;
    }

    if (!payment) {
      return NextResponse.json({
        success: true,
        active: false,
        status: "NOT_FOUND",
        message: "لا توجد دفعة مسجلة.",
      });
    }

    const active = isSubscriptionActive(payment);

    return NextResponse.json({
      success: true,
      active,
      status: payment.status,
      plan: payment.plan,
      amount: payment.amount,
      paymentId: payment.paymentId,
      transactionRef: payment.transactionRef,
      verifiedAt: payment.verifiedAt,
      expiresAt: payment.expiresAt,
      createdAt: payment.createdAt,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}
