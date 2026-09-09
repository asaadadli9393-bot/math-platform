#!/bin/bash
# ============================================================
#  سكريبت النسخ الاحتياطي الشامل — منصة الرياضيات
#  ينشئ نسخة كاملة قابلة للاسترجاع من كل التحسينات
# ============================================================

set -e

PROJECT_DIR="/home/z/my-project"
BACKUP_DIR="/home/z/my-project/download/backup-$(date +%Y%m%d-%H%M%S)"
ARCHIVE="/home/z/my-project/download/math-platform-backup-$(date +%Y%m%d-%H%M%S).tar.gz"

echo "📦 بدء النسخ الاحتياطي الشامل..."
echo "   المسار: $BACKUP_DIR"
echo ""

# 1. إنشاء مجلد النسخة
mkdir -p "$BACKUP_DIR"

# 2. نسخ الكود المصدري (بدون node_modules و .next)
echo "📋 نسخ الكود المصدري..."
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' \
  "$PROJECT_DIR/src/" "$BACKUP_DIR/src/"
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' \
  "$PROJECT_DIR/public/" "$BACKUP_DIR/public/"
rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' \
  "$PROJECT_DIR/prisma/" "$BACKUP_DIR/prisma/"

# 3. نسخ ملفات الإعداد
echo "📋 نسخ ملفات الإعداد..."
cp "$PROJECT_DIR/package.json" "$BACKUP_DIR/"
cp "$PROJECT_DIR/tsconfig.json" "$BACKUP_DIR/"
cp "$PROJECT_DIR/next.config.ts" "$BACKUP_DIR/"
cp "$PROJECT_DIR/tailwind.config.ts" "$BACKUP_DIR/" 2>/dev/null || true
cp "$PROJECT_DIR/postcss.config.mjs" "$BACKUP_DIR/" 2>/dev/null || true
cp "$PROJECT_DIR/components.json" "$BACKUP_DIR/" 2>/dev/null || true
cp "$PROJECT_DIR/.gitignore" "$BACKUP_DIR/"
cp "$PROJECT_DIR/Caddyfile" "$BACKUP_DIR/" 2>/dev/null || true

# 4. نسخ قاعدة البيانات
echo "📋 نسخ قاعدة البيانات..."
cp "$PROJECT_DIR/db/custom.db" "$BACKUP_DIR/db/" 2>/dev/null || true
mkdir -p "$BACKUP_DIR/db"
cp "$PROJECT_DIR/db/custom.db" "$BACKUP_DIR/db/" 2>/dev/null || true

# 5. نسخ scripts
echo "📋 نسخ السكريبتات..."
rsync -av "$PROJECT_DIR/scripts/" "$BACKUP_DIR/scripts/" 2>/dev/null || true

# 6. إنشاء ملف معلومات النسخة
cat > "$BACKUP_DIR/BACKUP_INFO.txt" << EOF
============================================================
  منصة الرياضيات — النسخة الاحتياطية
============================================================

التاريخ: $(date)
آخر commit: $(cd "$PROJECT_DIR" && git log -1 --oneline)
عدد commits: $(cd "$PROJECT_DIR" && git rev-list --count HEAD)

الملفات الأساسية:
- src/app/page.tsx — الصفحة الرئيسية (مع القفل + المساعد الذكي + أداة رسم الدوال)
- src/app/admin/ — لوحة الإدارة (4 تبويبات + APIs)
- src/app/api/ — كل APIs (ai-assistant, payments, admin/login, stats, etc.)
- src/app/error.tsx + loading.tsx + not-found.tsx — صفحات الخطأ
- src/components/function-plot.tsx — مكوّن الرسم البياني
- src/components/ai-assistant.tsx — المساعد الذكي
- src/data/premium-courses.ts — الدورات المميزة (5 دورات)
- src/data/monetization.ts — نظام الاشتراك (عرض واحد 500 دج)
- src/lib/student-store.ts — نظام الاشتراك الأمن
- public/anime/ — صور الأنمي (5 صور)

الاسترجاع:
1. انسخ محتويات النسخة إلى مشروع Next.js جديد
2. npm install
3. npx prisma db push
4. npm run dev

أو من GitHub:
git clone https://github.com/USERNAME/math-platform.git
cd math-platform
npm install
npx prisma db push
npm run dev
EOF

# 7. إنشاء الأرشيف المضغوط
echo "📦 إنشاء الأرشيف المضغوط..."
cd /home/z/my-project/download
tar -czf "math-platform-backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
  "backup-$(date +%Y%m%d-%H%M%S)/"

# 8. عرض النتيجة
ARCHIVE_NAME=$(ls -t math-platform-backup-*.tar.gz | head -1)
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_NAME" | cut -f1)

echo ""
echo "✅ تم إنشاء النسخة الاحتياطية بنجاح!"
echo "   📁 المجلد: $BACKUP_DIR"
echo "   📦 الأرشيف: /home/z/my-project/download/$ARCHIVE_NAME"
echo "   📏 الحجم: $ARCHIVE_SIZE"
echo ""
echo "📝 للاسترجاع:"
echo "   1. فك الضغط: tar -xzf $ARCHIVE_NAME"
echo "   2. انسخ المحتويات إلى مشروع جديد"
echo "   3. npm install && npx prisma db push && npm run dev"
