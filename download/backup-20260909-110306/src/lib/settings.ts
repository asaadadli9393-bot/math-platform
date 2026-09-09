// ============================================================
//  @/lib/settings.ts — إعدادات المنصة (Key/Value من قاعدة البيانات)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  كل المفاتيح لها قيم افتراضية معقولة. عند أول تشغيل نضمن
//  وجود صف في جدول Setting لكل مفتاح لكي تستعمله اللوحة.
// ============================================================

import { db } from "@/lib/db";

// المفاتيح المعروفة — لكل واحد قيمة افتراضية وفئة
export interface SettingKeyDef {
  key: string;
  value: string;
  category: string;
  description?: string;
}

export const DEFAULT_SETTINGS: SettingKeyDef[] = [
  // SMTP — خادم البريد المُرسِل
  {
    key: "SMTP_HOST",
    value: "smtp.gmail.com",
    category: "smtp",
    description: "عنوان خادم SMTP (مثلاً smtp.gmail.com)",
  },
  {
    key: "SMTP_PORT",
    value: "587",
    category: "smtp",
    description: "منفذ SMTP (587 لـ STARTTLS، 465 لـ SSL)",
  },
  {
    key: "SMTP_USER",
    value: "",
    category: "smtp",
    description: "اسم المستخدم SMTP (عادة بريد Gmail)",
  },
  {
    key: "SMTP_PASS",
    value: "",
    category: "smtp",
    description: "كلمة سر SMTP — لـ Gmail: App Password من 16 خانة",
  },
  {
    key: "SMTP_FROM",
    value: "",
    category: "smtp",
    description: "عنوان المُرسِل (From) الظاهر في البريد",
  },
  // بريد المسؤول
  {
    key: "ADMIN_EMAIL",
    value: "asaadadli9393@gmail.com",
    category: "admin",
    description: "بريد المسؤول الذي يستقبل إشعارات المنصة",
  },
  // تكامل Resend (اختياري)
  {
    key: "RESEND_API_KEY",
    value: "",
    category: "email",
    description: "مفتاح Resend API (اختياري، بديل عن SMTP)",
  },
  // Webhook — استدعاء خارجي عند أحداث الدفع
  {
    key: "WEBHOOK_URL",
    value: "",
    category: "webhook",
    description: "رابط Webhook يُستدعى عند كل حدث دفع (اختياري)",
  },
  // عام
  {
    key: "PLATFORM_NAME",
    value: "منصة الرياضيات — الأستاذ عدلي أسعد",
    category: "general",
    description: "اسم المنصة",
  },
];

/**
 * يضمن وجود كل مفاتيح DEFAULT_SETTINGS في قاعدة البيانات
 * بقيمها الافتراضية إذا لم تكن موجودة. لا يكتب فوق قيمة محفوظة.
 */
export async function ensureDefaultSettings(): Promise<void> {
  for (const def of DEFAULT_SETTINGS) {
    try {
      await db.setting.upsert({
        where: { key: def.key },
        update: {},
        create: {
          key: def.key,
          value: def.value,
          category: def.category,
        },
      });
    } catch {
      // تجاهل — قد تفشل upsert نادراً
    }
  }
}

/**
 * يجلب قيمة مفتاح واحد من قاعدة البيانات، مع fallback على الافتراضي.
 */
export async function getSettingValue(key: string): Promise<string> {
  try {
    const row = await db.setting.findUnique({ where: { key } });
    if (row && row.value.length > 0) return row.value;
    const def = DEFAULT_SETTINGS.find((d) => d.key === key);
    return def?.value ?? "";
  } catch {
    const def = DEFAULT_SETTINGS.find((d) => d.key === key);
    return def?.value ?? "";
  }
}

/**
 * يجلب كل الإعدادات دفعة واحدة ويُرجعها ككائن { [key]: value }.
 * يضمن القيم الافتراضية أولاً.
 */
export async function getAllSettings(): Promise<Record<string, string>> {
  await ensureDefaultSettings();
  const rows = await db.setting.findMany();
  const result: Record<string, string> = {};
  // ابدأ بالافتراضي ثم اكتب بقيم DB
  for (const def of DEFAULT_SETTINGS) {
    result[def.key] = def.value;
  }
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

/**
 * يحدّث مجموعة مفاتيح دفعة واحدة (upsert). يُرجع الكائن المحدّث.
 */
export async function updateSettings(
  updates: Record<string, string>
): Promise<Record<string, string>> {
  for (const [key, value] of Object.entries(updates)) {
    const def = DEFAULT_SETTINGS.find((d) => d.key === key);
    const category = def?.category ?? "general";
    try {
      await db.setting.upsert({
        where: { key },
        update: { value, category },
        create: { key, value, category },
      });
    } catch {
      // تجاهل أخطاء الكتابة الفردية
    }
  }
  return getAllSettings();
}
