#!/usr/bin/env bash
# ============================================================
#  scripts/postgres-wizard.sh
#  منصة الرياضيات | الأستاذ عدلي أسعد
# ============================================================
#  معالج تفاعلي لتهيئة قاعدة PostgreSQL على Neon:
#    1) يطلب من المستخدم DATABASE_URL
#    2) يتحقق من صحتها
#    3) يهيّئ Prisma ويبني الجداول
#    4) يرحّل بيانات SQLite المحلي (اختياري)
#    5) يطبع تقريرًا نهائيًا
# ============================================================
set -e

cd "$(dirname "$0")/.."

# ============================================================
#  0) ألوان ANSI
# ============================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║  تهيئة قاعدة بيانات PostgreSQL على Neon                ║"
echo "║  منصة الرياضيات | الأستاذ عدلي أسعد                   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================
#  1) التحقق من Prerequisites
# ============================================================
echo -e "${BOLD}1) التحقق من المتطلبات...${NC}"
if ! command -v bun &>/dev/null && ! command -v npx &>/dev/null; then
  echo -e "${RED}❌ يحتاج هذا السكربت إلى bun أو npx مثبّتًا.${NC}"
  exit 1
fi
echo -e "   ${GREEN}✓${NC} bun/npx متوفر"

if ! command -v node &>/dev/null; then
  echo -e "${RED}❌ Node.js غير مثبت.${NC}"
  exit 1
fi
echo -e "   ${GREEN}✓${NC} Node.js $(node -v)"

if [[ -f ".env" ]]; then
  source .env 2>/dev/null || true
fi

# ============================================================
#  2) طلب DATABASE_URL من المستخدم
# ============================================================
echo ""
echo -e "${BOLD}2) إدخال رابط قاعدة البيانات (DATABASE_URL)${NC}"
echo -e "   ${YELLOW}الخطوات على Neon:${NC}"
echo "   1. سجّل في https://neon.tech (مجاني)"
echo "   2. أنشئ مشروعًا جديدًا (region: Frankfurt أو أي قريب)"
echo "   3. اختر \"Pooled connection\" أو \"Direct connection\""
echo "   4. انسخ رابط postgresql://..."
echo "   5. الصقه هنا (Ctrl+Shift+V)"
echo ""

# إن وُجد DATABASE_URL في البيئة، استعمله
if [[ -n "$DATABASE_URL" ]]; then
  masked="${DATABASE_URL/\/\/([^:]+:)[^@]+@\/\/\1****@}"
  echo -e "   ${BLUE}موجود DATABASE_URL سابق:${NC} ${masked:0:60}..."
  read -p "   استبدله برابط جديد؟ (y/N): " replace
  if [[ "$replace" != "y" && "$replace" != "Y" ]]; then
    echo -e "   ${GREEN}✓${NC} سنستخدم القيمة الحالية."
  else
    read -s -p "   DATABASE_URL: " DATABASE_URL
    echo ""
  fi
else
  read -s -p "   DATABASE_URL: " DATABASE_URL
  echo ""
fi

# ============================================================
#  3) التحقق من صحة الرابط
# ============================================================
if [[ -z "$DATABASE_URL" ]]; then
  echo -e "${RED}❌ DATABASE_URL فارغ. إيقاف.${NC}"
  exit 1
fi

if [[ ! "$DATABASE_URL" =~ ^postgres(ql)?:// ]]; then
  echo -e "${RED}❌ الرابط لا يبدأ بـ postgresql://. هل نسخت الرابط الصحيح؟${NC}"
  exit 1
fi

# التحقق من وجود sslmode=require (مطلوب لـ Neon)
if [[ ! "$DATABASE_URL" =~ sslmode ]]; then
  # إضافة sslmode=require إن لم يكن موجودًا
  if [[ "$DATABASE_URL" =~ \? ]]; then
    DATABASE_URL="${DATABASE_URL}&sslmode=require"
  else
    DATABASE_URL="${DATABASE_URL}?sslmode=require"
  fi
  echo -e "   ${YELLOW}⚠️  أضفنا sslmode=require تلقائيًا (مطلوب لـ Neon).${NC}"
fi

echo -e "   ${GREEN}✓${NC} الرابط صحيح."

# ============================================================
#  4) حفظ DATABASE_URL في .env محليًا (آمن - لا يُرفع لـ GitHub)
# ============================================================
echo ""
echo -e "${BOLD}3) تحديث .env محليًا...${NC}"

# قراءة .env الحالي
if [[ -f ".env" ]]; then
  # حذف أي سطر DATABASE_URL سابق
  grep -v "^DATABASE_URL=" .env > .env.tmp || true
  mv .env.tmp .env
else
  touch .env
fi

echo "DATABASE_URL=\"${DATABASE_URL}\"" >> .env
echo -e "   ${GREEN}✓${NC} حُفظ DATABASE_URL في .env"

# التحقق من أن .env في .gitignore
if [[ -f ".gitignore" ]]; then
  if ! grep -q "^\.env" .gitignore; then
    echo ".env" >> .gitignore
    echo -e "   ${GREEN}✓${NC} أضفنا .env إلى .gitignore (حماية من الرفع)"
  fi
fi

# ============================================================
#  5) تثبيت better-sqlite3 للترحيل (اختياري)
# ============================================================
if [[ -f "db/custom.db" ]]; then
  echo ""
  echo -e "${BOLD}4) قاعدة SQLite محلية موجودة (${CYAN}db/custom.db${NC}).${NC}"
  read -p "   ترحيل البيانات إلى PostgreSQL؟ (y/N): " migrate

  if [[ "$migrate" == "y" || "$migrate" == "Y" ]]; then
    if ! grep -q "better-sqlite3" package.json 2>/dev/null; then
      echo -e "   ${YELLOW}تثبيت better-sqlite3 مؤقتًا للترحيل...${NC}"
      bun add -d better-sqlite3 2>/dev/null || npm install --save-dev better-sqlite3
    fi
    MIGRATE_FLAG=""
  else
    MIGRATE_FLAG="--skip-migrate"
  fi
else
  echo ""
  echo -e "${BOLD}4)${NC} لا توجد قاعدة SQLite محلية — سنتخطّى الترحيل."
  MIGRATE_FLAG="--skip-migrate"
fi

# ============================================================
#  6) تشغيل سكربت setup-postgres.ts
# ============================================================
echo ""
echo -e "${BOLD}5) تشغيل التهيئة...${NC}"
echo -e "   ${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

export DATABASE_URL
DATABASE_URL="$DATABASE_URL" bun run scripts/setup-postgres.ts $MIGRATE_FLAG

EXIT_CODE=$?
echo ""
echo -e "   ${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [[ $EXIT_CODE -ne 0 ]]; then
  echo -e "${RED}❌ فشل الإعداد. راجع الأخطاء أعلاه.${NC}"
  exit $EXIT_CODE
fi

# ============================================================
#  7) الخطوات التالية
# ============================================================
echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD} ✅ اكتمل إعداد PostgreSQL بنجاح               ${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}📋 الخطوات التالية:${NC}"
echo ""
echo -e "  ${CYAN}1)${NC} اذهب إلى Vercel Dashboard"
echo -e "     → مشروعك → Settings → Environment Variables"
echo -e "     → أضف المتغير:"
echo -e "     ${YELLOW}DATABASE_URL${NC} = ${DATABASE_URL:0:50}..."
echo ""
echo -e "  ${CYAN}2)${NC} انشر نسخة جديدة على Vercel:"
echo -e "     ${YELLOW}npx vercel --prod${NC}"
echo "     أو git push (إذا كان النشر التلقائي مفعّلاً)"
echo ""
echo -e "  ${CYAN}3)${NC} اخبر المنصة عبر فتح الرابط المنشور"
echo -e "     جرّب: تسجيل مستخدم + امتحان تجريبي + /admin"
echo ""
echo -e "  ${CYAN}4)${NC} (اختياري) تفعيل إشعارات البريد:"
echo -e "     - أنشئ كلمة تطبيق Gmail: https://myaccount.google.com/apppasswords"
echo -e "     - في /admin → الإعدادات: أدخل SMTP_PASS"
echo ""
echo -e "${BOLD}🔐 لا تشارك DATABASE_URL مع أحد!${NC}"
echo ""
