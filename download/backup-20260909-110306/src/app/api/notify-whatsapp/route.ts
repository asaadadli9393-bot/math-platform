// ============================================================
//  /api/notify-whatsapp — إنشاء رابط wa.me مع رسالة جاهزة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { phone: string, message?: string, paymentId?: string, action?: "verify"|"reject"|"expire"|"cancel"|"welcome" }
//   - يبني رابط https://wa.me/<phone>?text=<encoded message>
//   - إذا لم تُمرَّ message، يولّد رسالة جاهزة بناءً على paymentId/action
//   - لا يتطلب تسجيل دخول (واجهة عمومية يستعملها الزر في صفحة الاشتراك)
//   - لا يرسل رسالة فعلياً — فقط يبني الرابط الذي يفتحه المستعمل يدوياً
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function sanitize(s: unknown, max = 512): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

/**
 * يُحوّل رقم الهاتف الجزائري إلى صيغة دولية بدون "+" أو مسافات:
 *  - "0661 12 34 56" → "213661123456"
 *  - "+213 661 12 34 56" → "213661123456"
 *  - "213661123456" → كما هو
 *  - أرقام أخرى → نُزيل كل ما هو غير رقمي
 */
function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[\s+\-().]/g, "");
  // إذا بدأ بـ 0 (محلي جزائري) نستبدلها بـ 213
  if (/^0\d{9}$/.test(cleaned)) {
    cleaned = "213" + cleaned.slice(1);
  }
  // تحقق بسيط
  if (!/^\d{6,15}$/.test(cleaned)) return "";
  return cleaned;
}

/**
 * يولّد رسالة عربية جاهزة بناءً على الإجراء المطلوب وحالة الدفعة.
 */
function buildMessage(action: string, payment?: {
  paymentId: string;
  plan: string;
  amount: number;
  phone: string;
  status: string;
} | null): string {
  const header = "السلام عليكم،\nمنصة الرياضيات — الأستاذ عدلي أسعد.\n";
  if (!payment) {
    return header + "نتواصل معكم بخصوص اشتراككم في المنصة. شكراً لثقتكم.";
  }
  const base = `${header}رقم الدفعة: ${payment.paymentId}\nالباقة: ${payment.plan}\nالمبلغ: ${payment.amount} دج\n`;
  switch (action) {
    case "verify":
      return base + "\n✅ تم التحقق من دفعتكم بنجاح. اشتراككم فعّال الآن. بالتوفيق في دراستكم.";
    case "reject":
      return base + "\n⚠️ تعذّر التحقق من الدفعة. يرجى مراجعة رقم العملية وإعادة الإرسال.";
    case "expire":
      return base + "\n⏰ انتهت صلاحية اشتراككم. يرجى تجديد الاشتراك لمواصلة الدروس.";
    case "cancel":
      return base + "\nتم إلغاء الدفعة بناءً على طلبكم. للتواصل مع الأستاذ عدلي أسعد.";
    case "welcome":
      return base + "\n🎉 أهلاً بكم في منصة الرياضيات. نتمنى لكم دراسة مفيدة ومثمرة.";
    default:
      return base + "\nنتواصل معكم بخصوص اشتراككم. شكراً لثقتكم.";
  }
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
  const phoneRaw = sanitize(obj.phone, 32);
  const customMessage = sanitize(obj.message, 1024);
  const paymentId = sanitize(obj.paymentId, 64);
  const action = sanitize(obj.action, 16) || "default";

  if (!phoneRaw) {
    return NextResponse.json(
      { success: false, error: "phone مطلوب" },
      { status: 400 }
    );
  }

  const phone = normalizePhone(phoneRaw);
  if (!phone) {
    return NextResponse.json(
      {
        success: false,
        error: "رقم الهاتف غير صالح. استعمل صيغة دولية (مثلاً 213XXXXXXXXX) أو محلية (مثلاً 06XXXXXXXX).",
      },
      { status: 400 }
    );
  }

  // إذا أُعطي paymentId نحاول جلب الدفعة لتوليد رسالة دقيقة
  let payment: {
    paymentId: string;
    plan: string;
    amount: number;
    phone: string;
    status: string;
  } | null = null;
  if (paymentId) {
    try {
      const found = await db.payment.findUnique({ where: { paymentId } });
      if (found) {
        payment = {
          paymentId: found.paymentId,
          plan: found.plan,
          amount: found.amount,
          phone: found.phone,
          status: found.status,
        };
      }
    } catch {
      // تجاهل — نولّد رسالة عامة
    }
  }

  const message = customMessage || buildMessage(action, payment);
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;

  return NextResponse.json({
    success: true,
    url,
    phone,
    message,
  });
}
