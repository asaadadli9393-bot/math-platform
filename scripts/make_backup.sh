#!/usr/bin/env bash
# ============================================================
# make_backup.sh — نسخة احتياطية كاملة لمنصة تدرّج
# الاستخدام: bash scripts/make_backup.sh
# الناتج في download/:
#   1) tadaruj-backup-<DATE>.tar.gz        — المشروع كاملاً (كود+محتوى+إعدادات)
#   2) tadaruj-git-history-<DATE>.bundle   — تاريخ git كاملاً
#   3) BACKUP_README.md                    — دليل الاستعادة
# ============================================================
set -euo pipefail
cd /home/z/my-project

DATE=$(date +%Y%m%d-%H%M)
OUT=/home/z/my-project/download
mkdir -p "$OUT"
ARCHIVE="$OUT/tadaruj-backup-$DATE.tar.gz"
BUNDLE="$OUT/tadaruj-git-history-$DATE.bundle"
README=/home/z/my-project/BACKUP_README.md

echo "== [1/5] كتابة دليل الاستعادة BACKUP_README.md =="
cat > "$README" <<'EOF'
# النسخة الاحتياطية — منصة تدرّج | تدرّج | منصة الرياضيات للثانوي

تاريخ الإنشاء: __DATE__
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
EOF
sed -i "s/__DATE__/$(date '+%Y-%m-%d %H:%M')/" "$README"

echo "== [2/5] بناء الأرشيف الكامل (قد يستغرق دقيقة) =="
tar -czf "$ARCHIVE" \
  --exclude='./node_modules' \
  --exclude='./.next' \
  --exclude='./.git' \
  --exclude='./download' \
  --exclude='./skills' \
  --exclude='./tool-results' \
  --exclude='./upload' \
  --exclude='./db' \
  --exclude='./mini-services' \
  --exclude='./examples' \
  --exclude='./tests' \
  --exclude='./.claude' \
  --exclude='./.z-ai-config' \
  --exclude='.z-ai-config*' \
  --exclude='.zscripts/*.log' \
  --exclude='.zscripts/dev.pid' \
  --exclude='.zscripts/mini-service-*' \
  --exclude='*.log' \
  --exclude='./prompt' \
  -C /home/z/my-project .

echo "== [3/5] حفظ تاريخ git كاملاً (bundle) =="
git bundle create "$BUNDLE" --all

echo "== [4/5] نسخ الدليل إلى download/ =="
cp "$README" "$OUT/BACKUP_README.md"

echo "== [5/5] التحقق من السلامة =="
FILES=$(tar -tzf "$ARCHIVE" | grep -vc '/$' || true)
echo "عدد الملفات داخل الأرشيف: $FILES"
echo "--- فحوصات وجود الملفات الحرجة داخل الأرشيف ---"
for f in ./package.json ./src/app/page.tsx ./src/lib/ai-tutor.ts \
         ./src/components/views/GraphingView.tsx ./src/data/bac-solutions.ts \
         ./public/teacher-adli.jpg ./public/og-image.jpg ./public/video/promo.mp4 \
         ./.env.local ./.vercel/project.json ./backup/vercel-env-production.txt \
         ./worklog.md ./scripts/make_backup.sh ./.zscripts/dev.sh ./public/chains/dz/c2-func.pdf; do
  if tar -tzf "$ARCHIVE" "$f" > /dev/null 2>&1; then echo "OK   $f"; else echo "MISS $f"; fi
done

echo ""
echo "== الناتج النهائي =="
ls -lh "$ARCHIVE" "$BUNDLE" "$OUT/BACKUP_README.md"
echo ""
sha256sum "$ARCHIVE" "$BUNDLE"
echo "DONE tadaruj-backup-$DATE"
