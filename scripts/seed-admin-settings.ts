// ============================================================
//  scripts/seed-admin-settings.ts
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  سكربت مؤقّت: يهيّئ الإعدادات الافتراضية في جدول AdminSetting
//  إن لم تكن موجودة (upsert) — يمكن تشغيله عدّة مرات بأمان.
//
//  التشغيل:
//      bun run scripts/seed-admin-settings.ts
//
//  المفاتيح المُدرجة:
//      - ADMIN_EMAIL  = asaadadli9393@gmail.com
//      - SMTP_HOST    = smtp.gmail.com
//      - SMTP_PORT    = 587
//      - SMTP_USER    = asaadadli9393@gmail.com
// ============================================================

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const DEFAULTS: Array<{ key: string; value: string }> = [
  { key: "ADMIN_EMAIL", value: "asaadadli9393@gmail.com" },
  { key: "SMTP_HOST", value: "smtp.gmail.com" },
  { key: "SMTP_PORT", value: "587" },
  { key: "SMTP_USER", value: "asaadadli9393@gmail.com" },
];

async function main(): Promise<void> {
  console.log("▶️  تهيئة الإعدادات الافتراضية في AdminSetting...");
  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const { key, value } of DEFAULTS) {
    const existing = await db.adminSetting.findUnique({ where: { key } });
    if (!existing) {
      await db.adminSetting.create({ data: { key, value } });
      inserted++;
      console.log(`   ➕ أُنشئ: ${key} = ${value}`);
    } else if (existing.value !== value) {
      await db.adminSetting.update({ where: { key }, data: { value } });
      updated++;
      console.log(`   ✏️  تم تحديث: ${key} = ${value} (كان: ${existing.value})`);
    } else {
      unchanged++;
      console.log(`   ✓ بدون تغيير: ${key} = ${value}`);
    }
  }

  console.log("\n✅ اكتمل.");
  console.log(`   إدراج جديد: ${inserted}`);
  console.log(`   تحديث: ${updated}`);
  console.log(`   بدون تغيير: ${unchanged}`);

  // طباعة ملخّص الإعدادات الحالية في الجدول
  const all = await db.adminSetting.findMany({ orderBy: { key: "asc" } });
  console.log(`\n📦 الإجمالي في الجدول: ${all.length} مفتاح`);
  for (const row of all) {
    console.log(`   • ${row.key} = ${row.value}`);
  }
}

main()
  .catch((err) => {
    console.error("❌ فشل التشغيل:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
