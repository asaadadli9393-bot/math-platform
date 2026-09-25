# النسخة الاحتياطية — منصة تدرّج | تدرّج | منصة الرياضيات للثانوي

تاريخ الإنشاء: 2026-09-25 13:00
الإنتاج: https://math-adli.vercel.app (و adli-math.vercel.app)
مشروع Vercel: math-platform (org: team_JZvbO8QvFAimHHtQkjDVUJx1 / prj_fmumwoENNgTzguMu4xAKkyqJAC3t)
GitHub: https://github.com/asaadadli9393-bot/math-platform (فرع main + فرع احتياطي backup-sep16)

## محتويات هذه النسخة
- src/            كل الكود المصدري (الواجهات + API + المكتبات + بيانات التمارين)
- public/         كل المحتوى: تجميعيات البكالوريا 2008-2026، السلاسل، الفروض، الفيديو، الصور، og-image
- scripts/        سكريبتات QA والأدوات (قابلة لإعادة الاستخدام)
- backup/         الأصول الخام للصور + لقطة متغيرات بيئة الإنتاج (vercel-env-production.txt)
- qa/             لقطات فحص الجودة
- vendor/         deployggb.js المرجعي (جيوجبرا)
- prisma/         مخطط قاعدة البيانات
- .env + .env.local  متغيرات البيئة المحلية (⚠️ تحتوي مفاتيح سرية — احفظ الملف بخصوصية)
- .vercel/        ربط مشروع Vercel (يحفظ إعادة الربط)
- .zscripts/dev.sh  سكريبت إقلاع المعاينة الإنتاجي
- كل ملفات الإعداد: package.json, bun.lock, next.config.ts, tsconfig.json, tailwind.config.ts,
  postcss.config.mjs, eslint.config.mjs, components.json, vercel.json, .gitignore, .vercelignore
- worklog.md      سجل العمل الكامل للمشروع
- BACKUP_README.md  هذا الدليل

## مستثنى (قابل لإعادة التوليد)
- node_modules/   يعاد بـ bun install
- .next/          يعاد بـ bun run build
- .git/           محفوظ في ملف منفصل: tadaruj-git-history-<DATE>.bundle
- skills/, tool-results/, upload/  أدوات بيئة التطوير (ليست من المنصة)

## خطوات الاستعادة (Restore)
1. تثبيت Bun من https://bun.sh  (أو استخدم Node 20+ مع npm/pnpm)
2. فك الأرشيف:
     tar -xzf tadaruj-backup-<DATE>.tar.gz -C tadaruj
3. داخل مجلد tadaruj:
     bun install
     bun run build
4. التشغيل المحلي:
     PORT=3000 NODE_ENV=production node .next/standalone/server.js
5. النشر على Vercel:
     npx vercel link --project math-platform
     npx vercel --prod --yes
   أو تلقائياً: ارفع إلى GitHub (main) وVercel ينشر وحده
6. متغيرات البيئة: إن لم تُنقل تلقائياً، اضبطها في Vercel بالأسماء الموجودة في
     backup/vercel-env-production.txt (القيم السرية الـ5 معلّمة [SENSITIVE] — موجودة
     في لوحة Vercel).

## استعادة تاريخ git (اختياري)
    git clone tadaruj-git-history-<DATE>.bundle tadaruj-with-history

## متطلبات
- Bun أو Node 20+
- حساب Vercel بنفس الفريق للنشر
