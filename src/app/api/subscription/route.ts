// ============================================================
//  /api/subscription — استعلام عن حالة الاشتراك
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET : استعلام عبر ?phone=... أو ?transactionRef=...
//    يُرجع حالة الاشتراك:
//    {
//      success: true,
//      active: boolean,
//      status: PaymentStatus | "NOT_FOUND",
//      plan?: string,
//      amount?: number,
//      paymentId?: string,
//      transactionRef?: string | null,
//      verifiedAt?: Date | null,
//      expiresAt?: Date | null,
//      createdAt?: Date
//    }
//  الاشتراك يُعتبر فعّالاً إذا كانت آخر دفعة VERIFIED ولم تنته صلاحيتها.
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function sanitize(s: string | null, max = 64): string {
  if (!s) return "";
  return s.trim().slice(0, max);
}

/**
 * نوع مدفوعة كاملة كما يُرجعها Prisma (لتجنّب أخطاء null type-narrowing).
 */
type PaymentRow = NonNullable<
  Awaited<ReturnType<typeof db.payment.findFirst>>
>;

/**
 * يحدد ما إذا كانت المدفوعة فعّالة الآن.
 */
function isSubscriptionActive(payment: PaymentRow): boolean {
  if (payment.status !== "VERIFIED") return false;
  if (!payment.expiresAt) return true; // موثّقة بدون تاريخ انتهاء: فعّالة
  return new Date(payment.expiresAt) > new Date();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const phone = sanitize(url.searchParams.get("phone"), 32);
  const transactionRef = sanitize(url.searchParams.get("transactionRef"), 64);

  if (!phone && !transactionRef) {
    return NextResponse.json(
      { success: false, error: "استعمل ?phone= أو ?transactionRef=" },
      { status: 400 }
    );
  }

  try {
    let payment: PaymentRow | null = null;

    if (phone) {
      const found = await db.payment.findFirst({
        where: { phone },
        orderBy: { createdAt: "desc" },
      });
      payment = found ?? null;
    } else if (transactionRef) {
      const found = await db.payment.findFirst({
        where: { transactionRef },
        orderBy: { createdAt: "desc" },
      });
      payment = found ?? null;
    }

    if (!payment) {
      return NextResponse.json({
        success: true,
        active: false,
        status: "NOT_FOUND",
        message: "لا توجد دفعة مسجلة بهذا الرقم.",
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
