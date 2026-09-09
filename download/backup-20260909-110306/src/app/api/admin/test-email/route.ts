// ============================================================
//  /api/admin/test-email — إرسال بريد اختباري عبر Nodemailer
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  POST { to?: string }
//   - يقرأ إعدادات SMTP من db.adminSetting (SMTP_HOST/PORT/USER/PASS/FROM)
//   - إذا لم تُمرَّ to، يُرسل إلى ADMIN_EMAIL (من db.adminSetting)
//   - محمي بـ Authorization: Bearer ADMIN_KEY
// ============================================================

import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { isAuthorized } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const DEFAULTS: Record<string, string> = {
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: "587",
  SMTP_USER: "",
  SMTP_PASS: "",
  SMTP_FROM: "",
  ADMIN_EMAIL: "asaadadli9393@gmail.com",
};

/**
 * يجلب قيمة مفتاح من db.adminSetting مع fallback على القيم الافتراضية.
 */
async function getSetting(key: string): Promise<string> {
  try {
    const row = await db.adminSetting.findUnique({ where: { key } });
    if (row && row.value.length > 0) return row.value;
  } catch {
    // تجاهل
  }
  return DEFAULTS[key] ?? "";
}

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // يمكن استدعاء بدون جسم
  }
  const toRaw =
    typeof body === "object" && body !== null && "to" in body
      ? String((body as Record<string, unknown>).to ?? "").trim()
      : "";

  const to = toRaw || (await getSetting("ADMIN_EMAIL"));
  if (!to) {
    return NextResponse.json(
      {
        success: false,
        error: "لا يوجد بريد مستلم. اضبط ADMIN_EMAIL في الإعدادات أو مرّر to.",
      },
      { status: 400 }
    );
  }

  // قراءة إعدادات SMTP من db.adminSetting
  const host = await getSetting("SMTP_HOST");
  const portStr = await getSetting("SMTP_PORT");
  const user = await getSetting("SMTP_USER");
  const pass = await getSetting("SMTP_PASS");
  let from = await getSetting("SMTP_FROM");

  if (!host || !user || !pass) {
    return NextResponse.json(
      {
        success: false,
        error:
          "إعدادات SMTP غير مكتملة. اضبط SMTP_HOST/SMTP_USER/SMTP_PASS في تبويب الإعدادات.",
      },
      { status: 400 }
    );
  }

  if (!from) from = user;
  const port = parseInt(portStr, 10) || 587;
  const secure = port === 465;

  try {
    const transporter: Transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject: "اختبار SMTP — منصة الرياضيات | الأستاذ عدلي أسعد",
      text: "هذه رسالة اختبار من لوحة الإدارة. إذا وصلتك، فإن إعدادات SMTP صحيحة.",
      html: `
        <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;direction:rtl;text-align:right;line-height:1.8;color:#222;">
          <h2 style="color:#2D6A4F;border-bottom:2px solid #2D6A4F;padding-bottom:8px;">
            منصة الرياضيات — الأستاذ عدلي أسعد
          </h2>
          <p>هذه رسالة اختبار من لوحة الإدارة.</p>
          <p>إذا وصلتك هذه الرسالة، فإن إعدادات <strong>SMTP</strong> مُكوّنة بشكل صحيح ✅</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
          <p style="color:#666;font-size:13px;">
            وقت الإرسال: ${new Date().toLocaleString("ar-DZ", { hour12: false })}
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      to,
      messageId: info.messageId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
