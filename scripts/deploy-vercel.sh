#!/usr/bin/env bash
# ============================================================
#  scripts/deploy-vercel.sh
#  منصة الرياضيات | الأستاذ عدلي أسعد
# ============================================================
#  سكربت نشر برمجي إلى Vercel باستخدام Access Token.
#
#  الاستخدام:
#    bash scripts/deploy-vercel.sh             # نشر إنتاج (افتراضي)
#    bash scripts/deploy-vercel.sh --preview   # نشر معاينة
#    bash scripts/deploy-vercel.sh --link      # ربط مشروع (أول مرة)
#
#  المتطلبات:
#    - VERCEL_TOKEN (من Vercel → Settings → Tokens)
#    - أو ملف .env.local يحتوي VERCEL_TOKEN
#
#  يمكن تمرير المتغيرات أيضًا:
#    VERCEL_TOKEN=xxx bash scripts/deploy-vercel.sh
# ============================================================
set -e

cd "$(dirname "$0")/.."

# ------------------------------------------------------------
# الألوان
# ------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 النشر البرمجي على Vercel                          ║${NC}"
echo -e "${CYAN}║  منصة الرياضيات | الأستاذ عدلي أسعد                   ║${CYAN}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"

# ------------------------------------------------------------
# 0) تحميل .env إن وُجد
# ------------------------------------------------------------
if [[ -f .env ]]; then
  set -a
  source .env 2>/dev/null || true
  set +a
fi

# ------------------------------------------------------------
# 1) تحليل الأوامر
# ------------------------------------------------------------
MODE="prod"
DO_LINK=false
for arg in "$@"; do
  case "$arg" in
    --preview) MODE="preview" ;;
    --link)    DO_LINK=true ;;
    --prod)    MODE="prod" ;;
    *) echo "وسم غير معروف: $arg"; exit 1 ;;
  esac
done

# ------------------------------------------------------------
# 2) التحقق من VERCEL_TOKEN
# ------------------------------------------------------------
if [[ -z "$VERCEL_TOKEN" ]]; then
  echo -e "${RED}❌ VERCEL_TOKEN غير مُعرّف.${NC}"
  echo ""
  echo -e "${BOLD}للحصول على التوكن:${NC}"
  echo "  1. اذهب إلى https://vercel.com/account/tokens"
  echo "  2. اضغط \"Create Token\""
  echo "  3. أعطِ اسمًا مثل \"math-platform-deploy\""
  echo "  4. اضبط Scope: Full Account (أو Specific Team)"
  echo "  5. انسخ التوكن (لن يُعرض مرة أخرى)"
  echo ""
  echo -e "${BOLD}ثم شغّل:${NC}"
  echo "  export VERCEL_TOKEN=\"vercel_xxx...\""
  echo "  bash scripts/deploy-vercel.sh"
  echo ""
  echo -e "${BOLD}أو أضف إلى .env:${NC}"
  echo "  echo \"VERCEL_TOKEN=vercel_xxx...\" >> .env"
  exit 1
fi

echo -e "${GREEN}✓${NC} VERCEL_TOKEN مُعرّف: ${VERCEL_TOKEN:0:14}..."

# ------------------------------------------------------------
# 3) التحقق من Vercel CLI
# ------------------------------------------------------------
if ! command -v npx &>/dev/null; then
  echo -e "${RED}❌ npx غير مثبت.${NC}"
  exit 1
fi

echo -e "${GREEN}✓${NC} Vercel CLI: $(npx vercel --version 2>&1 | head -1)"

# ------------------------------------------------------------
# 4) تبديل مزوّد Prisma إلى postgresql (للإنتاج)
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}1) تبديل مزوّد Prisma إلى PostgreSQL...${NC}"
SCHEMA="prisma/schema.prisma"
if grep -q 'provider = "sqlite"' "$SCHEMA"; then
  sed -i 's|provider = "sqlite"|provider = "postgresql"|' "$SCHEMA"
  echo -e "   ${GREEN}✓${NC} تم التبديل إلى postgresql"
elif grep -q 'provider = "postgresql"' "$SCHEMA"; then
  echo -e "   ${GREEN}✓${NC} مزوّد Prisma已经是 postgresql"
fi

# ------------------------------------------------------------
# 5) توليد Prisma Client
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}2) توليد Prisma Client...${NC}"
npx prisma generate 2>&1 | tail -3
echo -e "   ${GREEN}✓${NC} Prisma Client جاهز"

# ------------------------------------------------------------
# 6) ربط المشروع (اختياري، أول مرة)
# ------------------------------------------------------------
if [[ "$DO_LINK" == "true" ]]; then
  echo ""
  echo -e "${BOLD}3) ربط المشروع بـ Vercel...${NC}"
  # إن لم يوجد .vercel/project.json، ننشئ مشروعًا جديدًا
  if [[ ! -f .vercel/project.json ]]; then
    echo "   إنشاء مشروع جديد على Vercel..."
    PROJECT_NAME="math-platform-adli"
    npx vercel link --yes --token "$VERCEL_TOKEN" 2>&1 | tail -5 || true

    # إن فشل link، نستعمل project add عبر API
    if [[ ! -f .vercel/project.json ]]; then
      echo "   محاولة إنشاء مشروع جديد عبر API..."
      npx vercel projects add "$PROJECT_NAME" --token "$VERCEL_TOKEN" 2>&1 | tail -3 || true
      # ثم link
      npx vercel link --yes --token "$VERCEL_TOKEN" 2>&1 | tail -3 || true
    fi
  fi
  echo -e "   ${GREEN}✓${NC} المشروع مرتبط"
fi

# ------------------------------------------------------------
# 7) إعداد متغيرات البيئة على Vercel (إن لم تُضبط)
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}4) التحقق من متغيرات البيئة على Vercel...${NC}"

# إن وُجد ملف .env، نرفع المتغيرات المطلوبة فقط (لا نرفع الأسرار المحلية)
ENV_VARS_TO_PUSH=(
  "ADMIN_KEY"
  "ADMIN_EMAIL"
  "NEXTAUTH_SECRET"
  "DATABASE_URL"
  "SMTP_HOST"
  "SMTP_PORT"
  "SMTP_USER"
)

for var in "${ENV_VARS_TO_PUSH[@]}"; do
  value=$(eval echo "\$$var")
  if [[ -n "$value" ]]; then
    masked="${value:0:30}..."
    if [[ "$var" == "DATABASE_URL" ]]; then
      masked=$(echo "$value" | sed 's|://[^:]+:([^@]+)@|://\1:****@|')
    fi
    echo "   • $var = $masked"
    # إزالة المتغير إن كان موجودًا ثم إضافته (لتفادي التكرار)
    npx vercel env rm "$var" production --yes --token "$VERCEL_TOKEN" 2>/dev/null || true
    echo "$value" | npx vercel env add "$var" production --token "$VERCEL_TOKEN" 2>&1 | tail -1 || true
  else
    echo -e "   ${YELLOW}⚠️  $var غير مُعرّف في .env — تخطّي${NC}"
  fi
done

# ------------------------------------------------------------
# 8) النشر على Vercel
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}5) النشر على Vercel (mode: $MODE)...${NC}"

if [[ "$MODE" == "prod" ]]; then
  DEPLOY_CMD="npx vercel deploy --prod --yes --token $VERCEL_TOKEN"
else
  DEPLOY_CMD="npx vercel deploy --yes --token $VERCEL_TOKEN"
fi

echo "   جارٍ النشر..."
DEPLOY_URL=$(eval "$DEPLOY_CMD" 2>&1 | tee /dev/stderr | grep -E "^https://" | tail -1 || true)

if [[ -z "$DEPLOY_URL" ]]; then
  echo -e "\n${RED}❌ فشل النشر. تحقق من الأخطاء أعلاه.${NC}"
  # إعادة ضبط Prisma لـ SQLite محليًا
  bash scripts/set-prisma-provider.sh 2>&1 | tail -2
  exit 1
fi

echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD} ✅ اكتمل النشر بنجاح                       ${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BOLD}🌐 رابط المنصة:${NC} ${CYAN}${DEPLOY_URL}${NC}"
echo ""

# ------------------------------------------------------------
# 9) إعادة ضبط Prisma لـ SQLite محليًا
# ------------------------------------------------------------
echo -e "${BOLD}6) إعادة ضبط Prisma لـ SQLite محليًا...${NC}"
bash scripts/set-prisma-provider.sh 2>&1 | tail -2
echo -e "   ${GREEN}✓${NC} Prisma جاهز لـ SQLite محلي"

echo ""
echo -e "${BOLD}📋 الخطوات التالية:${NC}"
echo "  • افتح الرابط المنشور واختبر المنصة"
echo "  • جرّب: تسجيل دخول، امتحان تجريبي، /admin"
echo "  • إن أردت نشرًا تلقائيًا: ارفع VERCEL_TOKEN إلى GitHub Secrets"
echo "    ثم فعّل GitHub Actions workflow"
echo ""
