// ============================================================
//  scripts/setup-postgres.ts
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  سكربت شامل لتهيئة قاعدة بيانات PostgreSQL على Neon/Supabase
//  وترحيل البيانات من SQLite المحلي إن وُجدت.
//
//  الاستخدام:
//      DATABASE_URL="postgresql://..." bun run scripts/setup-postgres.ts
//      DATABASE_URL="postgresql://..." bun run scripts/setup-postgres.ts --skip-migrate
// ============================================================

import { execSync } from "node:child_process";
import { existsSync, readFileSync, copyFileSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

async function main(): Promise<void> {
  // ------------------------------------------------------------------
  //  0) قراءة DATABASE_URL والتحقق منها
  // ------------------------------------------------------------------
  const DATABASE_URL = process.env.DATABASE_URL ?? "";
  const SKIP_MIGRATE = process.argv.includes("--skip-migrate");

  if (!DATABASE_URL) {
    console.error("\n❌ DATABASE_URL غير مُعرّف.");
    console.error("   استخدم:");
    console.error('   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" bun run scripts/setup-postgres.ts\n');
    process.exit(1);
  }

  if (!/^postgres(ql)?:\/\//.test(DATABASE_URL)) {
    console.error("\n❌ DATABASE_URL لا يبدأ بـ postgresql:// — المزوّد الحالي ليس PostgreSQL.\n");
    process.exit(1);
  }

  // إخفاء كلمة المرور عند الطباعة
  function maskUrl(url: string): string {
    return url.replace(/(\/\/[^:]+:)[^@]+@/, "$1****@");
  }
  console.log(`\n🔗 DATABASE_URL: ${maskUrl(DATABASE_URL)}\n`);

  // ------------------------------------------------------------------
  //  1) تبديل مزوّد Prisma في schema.prisma
  // ------------------------------------------------------------------
  const SCHEMA_PATH = "prisma/schema.prisma";
  const schema = readFileSync(SCHEMA_PATH, "utf8");

  if (schema.includes('provider = "sqlite"')) {
    const updated = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
    writeFileSync(SCHEMA_PATH, updated, "utf8");
    console.log("🔄 تم تبديل مزوّد Prisma من SQLite إلى PostgreSQL.\n");
  } else if (schema.includes('provider = "postgresql"')) {
    console.log("✅ مزوّد Prisma هو PostgreSQL.\n");
  } else {
    console.error("❌ تعذّر تحديد المزوّد الحالي في schema.prisma.\n");
    process.exit(1);
  }

  // ------------------------------------------------------------------
  //  2) توليد Prisma Client بمزوّد postgresql
  // ------------------------------------------------------------------
  console.log("🔨 توليد Prisma Client...");
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
  } catch {
    console.error("❌ فشل prisma generate");
    process.exit(1);
  }

  // ------------------------------------------------------------------
  //  3) إنشاء الجداول في PostgreSQL (db push)
  // ------------------------------------------------------------------
  console.log("\n📦 إنشاء الجداول في PostgreSQL (prisma db push)...");
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
  } catch {
    console.error("❌ فشل prisma db push. تحقق من DATABASE_URL وصلاحيات الاتصال.");
    process.exit(1);
  }

  // ------------------------------------------------------------------
  //  4) ترحيل البيانات من SQLite المحلي إن وُجد
  // ------------------------------------------------------------------
  const SQLITE_DB_PATH = "db/custom.db";
  const SQLITE_DB_BACKUP = "db/custom.db.backup";
  const shouldMigrate = !SKIP_MIGRATE && existsSync(SQLITE_DB_PATH);

  if (shouldMigrate) {
    console.log("\n📥 بدء ترحيل البيانات من SQLite المحلي...");

    // نسخة احتياطية قبل الترحيل
    try {
      copyFileSync(SQLITE_DB_PATH, SQLITE_DB_BACKUP);
      console.log(`   ✓ نسخة احتياطية: ${SQLITE_DB_BACKUP}`);
    } catch (e) {
      console.warn(`   ⚠️  تعذّر إنشاء نسخة احتياطية: ${e}`);
    }

    // محاولة استيراد better-sqlite3 إن كان مثبتًا
    type SqliteDb = {
      prepare(sql: string): { all(): unknown[]; run(...args: unknown[]): void };
      close(): void;
    };
    let Database: ((path: string, opts?: { readonly?: boolean }) => SqliteDb) | null = null;
    try {
      // @ts-expect-error - better-sqlite3 اختياري وقد لا يكون مثبتًا
      const mod = await import("better-sqlite3");
      Database = mod.default as unknown as typeof Database;
    } catch {
      console.warn(
        "\n⚠️  تعذّر ترحيل البيانات تلقائيًا — better-sqlite3 غير مثبت.\n" +
        "   للحصول على ترحيل كامل، ثبّته ثم أعد التشغيل:\n" +
        "   \u001b[36mbun add -d better-sqlite3\u001b[0m\n" +
        "   يمكنك أيضًا تخطّي الترحيل بإضافة --skip-migrate.\n"
      );
    }

    if (Database) {
      const sqliteDb = Database(SQLITE_DB_PATH, { readonly: true });
      console.log("   ✓ SQLite المحلي مفتوح للقراءة فقط.");

      const postgresDb = new PrismaClient();

      // قائمة الجداول المراد ترحيلها (بالترتيب الذي يحترم العلاقات)
      const TABLES = [
        "User",
        "ParentRelation",
        "Unit",
        "Chapter",
        "Lesson",
        "Exercise",
        "ExerciseAttempt",
        "Quiz",
        "QuizQuestion",
        "QuizResult",
        "UnitProgress",
        "ProgressRecord",
        "Notification",
        "Payment",
        "PaymentNotification",
        "Setting",
        "AdminSetting",
        "Video",
      ];

      let totalRows = 0;
      for (const table of TABLES) {
        try {
          const rows = sqliteDb.prepare(`SELECT * FROM "${table}"`).all() as Record<string, unknown>[];
          if (rows.length === 0) {
            console.log(`   • ${table}: 0 صفوف (تخطّي)`);
            continue;
          }
          console.log(`   • ${table}: ${rows.length} صفوف جارٍ الترحيل...`);

          // تنظيف البيانات
          // - BigInt → Number
          // - Buffer → string
          // - الأرقام الكبيرة في أعمدة DateTime (updatedAt, createdAt) → Date
          //   (SQLite يخزّنها كـ Int Unix timestamp بالمللي ثانية)
          const DATETIME_COLUMNS = new Set([
            "createdAt",
            "updatedAt",
            "lastVisitedAt",
            "date",
            "scheduledAt",
            "sentAt",
            "paidAt",
            "expiresAt",
            "watchedAt",
            "completedAt",
            "startedAt",
            "finishedAt",
          ]);

          const cleaned = rows.map((row) => {
            const out: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(row)) {
              if (v === null) {
                out[k] = null;
              } else if (DATETIME_COLUMNS.has(k) && typeof v === "number") {
                // تحويل Unix ms → Date
                out[k] = new Date(v);
              } else if (typeof v === "bigint") {
                out[k] = Number(v);
              } else if (Buffer.isBuffer(v)) {
                out[k] = v.toString("utf8");
              } else {
                out[k] = v;
              }
            }
            return out;
          });

          // الوصول الديناميكي إلى النموذج
          const modelKey = table.charAt(0).toLowerCase() + table.slice(1);
          const model = (postgresDb as unknown as Record<string, unknown>)[modelKey] as {
            createMany(args: {
              data: Record<string, unknown>[];
              skipDuplicates?: boolean;
            }): Promise<{ count: number }>;
          } | undefined;
          if (!model) {
            console.warn(`     ⚠️  النموذج ${modelKey} غير موجود في PrismaClient.`);
            continue;
          }

          try {
            const result = await model.createMany({ data: cleaned, skipDuplicates: true });
            totalRows += result.count;
          } catch (e: unknown) {
            console.warn(
              `     ⚠️  فشل ترحيل ${table}: ${e instanceof Error ? e.message : String(e)}`
            );
          }
        } catch {
          // الجدول غير موجود في SQLite — تخطّي بصمت
        }
      }

      sqliteDb.close();
      await postgresDb.$disconnect();
      console.log(`\n✅ اكتمل الترحيل. إجمالي الصفوف: ${totalRows}\n`);
    }
  } else {
    console.log("\nℹ️  تخطّي الترحيل (إما لا SQLite محلي، أو --skip-migrate).\n");
  }

  // ------------------------------------------------------------------
  //  5) تشغيل seed-admin-settings
  // ------------------------------------------------------------------
  console.log("🌱 تشغيل seed-admin-settings...");
  try {
    execSync("bun run scripts/seed-admin-settings.ts", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL },
    });
  } catch {
    console.warn("⚠️  فشل seed-admin-settings — يمكنك تشغيله يدويًا لاحقًا.");
  }

  // ------------------------------------------------------------------
  //  6) تقرير ملخّص لقاعدة PostgreSQL الجديدة
  // ------------------------------------------------------------------
  console.log("\n📊 تقرير قاعدة البيانات بعد الإعداد:");
  const reportDb = new PrismaClient();

  const MODEL_KEYS = [
    "user",
    "parentRelation",
    "unit",
    "chapter",
    "lesson",
    "exercise",
    "exerciseAttempt",
    "quiz",
    "quizQuestion",
    "quizResult",
    "unitProgress",
    "progressRecord",
    "notification",
    "payment",
    "paymentNotification",
    "setting",
    "adminSetting",
    "video",
  ];

  let totalAll = 0;
  for (const name of MODEL_KEYS) {
    try {
      const model = (reportDb as unknown as Record<string, unknown>)[name] as
        | { count(): Promise<number> }
        | undefined;
      if (!model) continue;
      const count = await model.count();
      totalAll += count;
      console.log(`   • ${name}: ${count} صفوف`);
    } catch {
      // تخطّي الجداول غير الموجودة
    }
  }

  await reportDb.$disconnect();

  console.log(`\n✅ الإعداد الكامل لقاعدة PostgreSQL اكتمل بنجاح.`);
  console.log(`   إجمالي الصفوف في قاعدة البيانات الجديدة: ${totalAll}\n`);
  console.log("📋 الخطوات التالية:");
  console.log("   1. أضف DATABASE_URL إلى Vercel → Settings → Environment Variables");
  console.log("   2. أعد النشر على Vercel: git push (النشر التلقائي) أو npx vercel --prod");
  console.log("   3. اختبر الإنتاج عبر فتح الرابط المنشور");
  console.log("");
}

main().catch((err) => {
  console.error("\n❌ خطأ غير متوقع:", err);
  process.exit(1);
});
