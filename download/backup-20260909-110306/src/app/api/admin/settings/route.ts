// ============================================================
//  /api/admin/settings — إعدادات لوحة الإدارة (Key/Value)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  القيم محفوظة في جدول AdminSetting (مفصولة عن Setting العامة).
//  محمي بـ Authorization: Bearer ADMIN_KEY
//
//  GET  : جلب كل الإعدادات (يرجع كائن { key: value } مع القيم الافتراضية)
//  POST : upsert لمجموعة مفاتيح (يمرر كائن { key: value }) —
//         فقط المفاتيح في ALLOWED_KEYS مسموح بها.
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

// قائمة المفاتيح المسموح بها (أي مفتاح آخر يُرفض)
export const ALLOWED_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "WEBHOOK_URL",
  "TELEGRAM_CHAT_ID",
  "ADMIN_EMAIL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
] as const;

export type AllowedKey = (typeof ALLOWED_KEYS)[number];

// القيم الافتراضية للمفاتيح (تُستعمل إذا لم تكن محفوظة في DB)
export const DEFAULT_VALUES: Record<AllowedKey, string> = {
  RESEND_API_KEY: "",
  RESEND_FROM_EMAIL: "",
  WEBHOOK_URL: "",
  TELEGRAM_CHAT_ID: "",
  ADMIN_EMAIL: "asaadadli9393@gmail.com",
  SMTP_HOST: "smtp.gmail.com",
  SMTP_PORT: "587",
  SMTP_USER: "",
  SMTP_PASS: "",
  SMTP_FROM: "",
};

const ALLOWED_KEYSET = new Set<string>(ALLOWED_KEYS);

/**
 * يجلب قيمة مفتاح واحد من db.adminSetting مع fallback على DEFAULT_VALUES.
 */
export async function getAdminSetting(key: AllowedKey): Promise<string> {
  try {
    const row = await db.adminSetting.findUnique({ where: { key } });
    if (row && row.value.length > 0) return row.value;
  } catch {
    // تجاهل — نرجّع الافتراضي
  }
  return DEFAULT_VALUES[key];
}

/**
 * يجلب كل الإعدادات دفعة واحدة (يفضّل القيم المحفوظة على الافتراضية).
 */
async function getAllAdminSettings(): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...DEFAULT_VALUES };
  try {
    const rows = await db.adminSetting.findMany();
    for (const row of rows) {
      if (ALLOWED_KEYSET.has(row.key)) {
        // لا نكتب فوق القيمة الافتراضية إلا إذا كانت القيمة المحفوظة غير فارغة
        // (إلا إذا كانت القيمة الافتراضية فارغة أيضاً — عندئذ نسمح بالقيمة المحفوظة حتى لو فارغة)
        if (row.value.length > 0 || DEFAULT_VALUES[row.key as AllowedKey] === "") {
          result[row.key] = row.value;
        }
      }
    }
  } catch {
    // تجاهل — نرجّع الافتراضي
  }
  return result;
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  try {
    const settings = await getAllAdminSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

  // تحويل القيم إلى سلاسل نصية وفلترة المفاتيح المسموحة
  const input = body as Record<string, unknown>;
  const safe: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (!ALLOWED_KEYSET.has(k)) continue;
    if (typeof v === "string") safe[k] = v;
    else if (typeof v === "number" || typeof v === "boolean") safe[k] = String(v);
    // null/undefined/object/array تُتجاهل
  }

  if (Object.keys(safe).length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "لا توجد مفاتيح مسموحة في الجسم. المسموح: " + ALLOWED_KEYS.join(", "),
      },
      { status: 400 }
    );
  }

  try {
    // upsert لكل مفتاح
    for (const [key, value] of Object.entries(safe)) {
      await db.adminSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    const settings = await getAllAdminSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}
