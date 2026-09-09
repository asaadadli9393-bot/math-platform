// ============================================================
//  @/lib/email.ts — إرسال البريد عبر Nodemailer SMTP
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  يقرأ إعدادات SMTP من جدول Setting ثم يُنشئ نقل Nodemailer
//  في كل استدعاء (نقل خفيف، يُغلق تلقائياً بعد الإرسال).
//  لا يُستعمل في العميل — يبقى على الخادم فقط.
// ============================================================

import nodemailer, { type Transporter } from "nodemailer";
import { getSettingValue, DEFAULT_SETTINGS } from "@/lib/settings";

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  secure: boolean;
}

/**
 * يجلب إعدادات SMTP من قاعدة البيانات ويعيد كائن config جاهز.
 * إذا لم تكن مكتملة، يُرجع null ويُمكن استعماله لإظهار خطأ واضح.
 */
export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const host = await getSettingValue("SMTP_HOST");
  const portStr = await getSettingValue("SMTP_PORT");
  const user = await getSettingValue("SMTP_USER");
  const pass = await getSettingValue("SMTP_PASS");
  let from = await getSettingValue("SMTP_FROM");

  if (!host || !user || !pass) return null;
  if (!from) from = user;
  const port = parseInt(portStr, 10) || 587;

  return {
    host,
    port,
    user,
    pass,
    from,
    // 465 => SSL مباشر، 587 => STARTTLS (افتراضي آمن)
    secure: port === 465,
  };
}

/**
 * يبني ناقل Nodemailer من إعدادات SMTP الحالية.
 */
function buildTransporter(cfg: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/**
 * يرسل بريداً اختبارياً/حقيقياً عبر SMTP. يُرجع نتيجة صريحة.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<SendEmailResult> {
  const cfg = await getSmtpConfig();
  if (!cfg) {
    return {
      ok: false,
      error: "إعدادات SMTP غير مكتملة. اضبط SMTP_HOST/USER/PASS/FROM في تبويب الإعدادات.",
    };
  }
  try {
    const transporter = buildTransporter(cfg);
    const info = await transporter.sendMail({
      from: cfg.from,
      to: opts.to,
      subject: opts.subject,
      text: opts.text ?? "",
      html: opts.html ?? "",
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

/**
 * يتحقق من صحة إعدادات SMTP بتجربة اتصال (verify) بدون إرسال فعلي.
 */
export async function verifySmtp(): Promise<SendEmailResult> {
  const cfg = await getSmtpConfig();
  if (!cfg) {
    return { ok: false, error: "إعدادات SMTP غير مكتملة." };
  }
  try {
    const transporter = buildTransporter(cfg);
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

export { DEFAULT_SETTINGS };
