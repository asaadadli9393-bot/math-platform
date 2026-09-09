// ============================================================
//  /api/payments — واجهة الدفع العمومية (تستعملها صفحة الاشتراك)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST : إنشاء دفعة جديدة (يسجل في db.payment)
//    الجسم: {
//      plan: string,
//      method: "CIB" | "BARIDI_MOB",
//      amount: number,
//      phone: string,
//      email?: string,
//      studentName?: string,
//      transactionRef?: string,
//      metadata?: object,
//    }
//    يُرجع: { success, paymentId, status: "PENDING", amount, createdAt }
//  GET  : استعلام عن دفعة عبر ?paymentId=... أو ?transactionRef=...
//    يُرجع: { success, payment } أو 404
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyPaymentCreated } from "@/lib/notifications";

export const runtime = "nodejs";

// يدعم BARIDI_MOB و CIB (حسب المواصفات)؛ ومع ذلك نقبل CCP و BANK_TRANSFER لأغراض التوسعة
const VALID_METHODS = new Set(["CIB", "BARIDI_MOB", "CCP", "BANK_TRANSFER"]);
const VALID_PLANS = new Set(["FREE", "BASIC", "PREMIUM", "FAMILY"]);

/**
 * يولّد معرّف فريد للدفعة: PAY-<timestamp36>-<6 alphanumeric>
 */
function genPaymentId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PAY-${ts}-${rand}`;
}

function sanitize(s: unknown, max = 256): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

/**
 * نوع Payment كما يُرجعه Prisma (لتجنّب أخطاء null type-narrowing).
 */
type PaymentRow = Awaited<ReturnType<typeof db.payment.create>>;

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

  const plan = sanitize(obj.plan).toUpperCase();
  const method = sanitize(obj.method).toUpperCase();
  const phone = sanitize(obj.phone, 32);
  const email = sanitize(obj.email, 128);
  const studentName = sanitize(obj.studentName, 128);
  const transactionRef = sanitize(obj.transactionRef, 64);
  const amountRaw = obj.amount;
  const amount =
    typeof amountRaw === "number"
      ? Math.floor(amountRaw)
      : parseInt(sanitize(amountRaw), 10) || 0;

  if (!VALID_PLANS.has(plan)) {
    return NextResponse.json(
      { success: false, error: "plan غير صالح (FREE/BASIC/PREMIUM/FAMILY)" },
      { status: 400 }
    );
  }
  if (!VALID_METHODS.has(method)) {
    return NextResponse.json(
      { success: false, error: "method غير صالح (CIB أو BARIDI_MOB)" },
      { status: 400 }
    );
  }
  if (!phone) {
    return NextResponse.json(
      { success: false, error: "phone مطلوب" },
      { status: 400 }
    );
  }
  if (amount < 0) {
    return NextResponse.json(
      { success: false, error: "amount غير صالح" },
      { status: 400 }
    );
  }

  const paymentId = genPaymentId();

  // metadata اختياري — يُخزّن كسلسلة JSON
  let metadata: string | null = null;
  if (obj.metadata && typeof obj.metadata === "object") {
    try {
      metadata = JSON.stringify(obj.metadata);
    } catch {
      metadata = null;
    }
  }

  try {
    const payment: PaymentRow = await db.payment.create({
      data: {
        paymentId,
        transactionRef: transactionRef || null,
        plan,
        method: method as "CIB" | "BARIDI_MOB" | "CCP" | "BANK_TRANSFER",
        amount,
        status: "PENDING",
        studentName: studentName || null,
        phone,
        email: email || null,
        metadata,
      },
    });

    // إشعار لوحة الإدارة بوجود دفعة جديدة قيد المراجعة (تحسين وليس شرطاً)
    try {
      await notifyPaymentCreated({ paymentId, plan, amount, phone });
    } catch {
      // تجاهل
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const paymentId = sanitize(url.searchParams.get("paymentId"), 64);
  const transactionRef = sanitize(url.searchParams.get("transactionRef"), 64);

  if (!paymentId && !transactionRef) {
    return NextResponse.json(
      {
        success: false,
        error: "استعمل ?paymentId= أو ?transactionRef=",
      },
      { status: 400 }
    );
  }

  try {
    let payment: Awaited<ReturnType<typeof db.payment.findUnique>> = null;
    let paymentByRef: Awaited<ReturnType<typeof db.payment.findFirst>> = null;

    if (paymentId) {
      payment = await db.payment.findUnique({ where: { paymentId } });
      if (payment) {
        return NextResponse.json({ success: true, payment });
      }
    }
    if (transactionRef) {
      paymentByRef = await db.payment.findFirst({
        where: { transactionRef },
        orderBy: { createdAt: "desc" },
      });
      if (paymentByRef) {
        return NextResponse.json({ success: true, payment: paymentByRef });
      }
    }

    return NextResponse.json(
      { success: false, error: "لم يُعثر على الدفعة" },
      { status: 404 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}
