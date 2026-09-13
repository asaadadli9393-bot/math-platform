#!/usr/bin/env bash
# ============================================================
#  scripts/sync-vercel-env.sh
#  منصة الرياضيات | الأستاذ عدلي أسعد
# ============================================================
#  يرفع متغيرات البيئة من .env المحلي إلى Vercel.
#
#  الاستخدام:
#    bash scripts/sync-vercel-env.sh           # رفع + production
#    bash scripts/sync-vercel-env.sh --preview # رفع لـ preview فقط
#    bash scripts/sync-vercel-env.sh --all     # رفع لـ preview + production
#
#  المتطلبات:
#    - VERCEL_TOKEN (Vercel → Settings → Tokens)
#    - ملف .env يحتوي المتغيرات المطلوبة
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
echo -e "${CYAN}║  🔄 مزامنة متغيرات البيئة مع Vercel                 ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"

# ------------------------------------------------------------
# 0) تحميل .env
# ------------------------------------------------------------
if [[ ! -f .env ]]; then
  echo -e "${RED}❌ ملف .env غير موجود.${NC}"
  echo "   أنشئه أولًا: cp .env.example .env"
  exit 1
fi

# قراءة .env بأمان
set -a
source .env 2>/dev/null || true
set +a

if [[ -z "$VERCEL_TOKEN" ]]; then
  echo -e "${RED}❌ VERCEL_TOKEN غير مُعرّف في .env${NC}"
  echo "   احصل عليه من: https://vercel.com/account/tokens"
  exit 1
fi

# ------------------------------------------------------------
# 1) تحليل الأوامر
# ------------------------------------------------------------
ENV_TARGETS=("production")
for arg in "$@"; do
  case "$arg" in
    --preview) ENV_TARGETS=("preview") ;;
    --all)     ENV_TARGETS=("production" "preview" "development") ;;
    --prod)    ENV_TARGETS=("production") ;;
  esac
done

echo -e "البيئة المستهدفة: ${BOLD}${ENV_TARGETS[*]}${NC}"
echo ""

# ------------------------------------------------------------
# 2) قائمة المتغيرات المطلوبة للإنتاج
# ------------------------------------------------------------
REQUIRED_VARS=(
  "DATABASE_URL"
  "ADMIN_KEY"
  "ADMIN_EMAIL"
  "NEXTAUTH_SECRET"
  "SMTP_HOST"
  "SMTP_PORT"
  "SMTP_USER"
  "SMTP_PASS"
)

echo -e "${BOLD}المتغيرات المراد رفعها:${NC}"
for var in "${REQUIRED_VARS[@]}"; do
  value=$(eval echo "\$$var")
  if [[ -z "$value" ]]; then
    echo -e "  ${YELLOW}⚠️  $var غير مُعرّف${NC}"
  else
    # إخفاء القيمة
    if [[ ${#value} -gt 30 ]]; then
      masked="${value:0:30}..."
    else
      masked="$value"
    fi
    echo -e "  ${GREEN}✓${NC} $var = $masked"
  fi
done
echo ""

# ------------------------------------------------------------
# 3) ربط المشروع إن لم يكن مرتبطًا
# ------------------------------------------------------------
if [[ ! -f .vercel/project.json ]]; then
  echo -e "${BOLD}🔗 ربط المشروع بـ Vercel...${NC}"
  npx vercel link --yes --token "$VERCEL_TOKEN" 2>&1 | tail -3
fi

# ------------------------------------------------------------
# 4) رفع كل متغير إلى Vercel
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}📤 رفع المتغيرات إلى Vercel...${NC}"

success_count=0
fail_count=0

for var in "${REQUIRED_VARS[@]}"; do
  value=$(eval echo "\$$var")
  if [[ -z "$value" ]]; then
    echo -e "  ${YELLOW}⚠️  تخطّي $var (فارغ)${NC}"
    continue
  fi

  for target in "${ENV_TARGETS[@]}"; do
    echo -n "  • $var → $target... "

    # حذف المتغير إن كان موجودًا (لتفادي التكرار)
    npx vercel env rm "$var" "$target" --yes --token "$VERCEL_TOKEN" 2>/dev/null || true

    # رفع القيمة الجديدة
    if echo "$value" | npx vercel env add "$var" "$target" --token "$VERCEL_TOKEN" 2>/dev/null | grep -q "Added" 2>/dev/null; then
      echo -e "${GREEN}✓${NC}"
      ((success_count++))
    else
      # محاولة ثانية لاستخراج النتيجة
      result=$(echo "$value" | npx vercel env add "$var" "$target" --token "$VERCEL_TOKEN" 2>&1 | tail -1)
      if [[ "$result" == *"Added"* ]] || [[ "$result" == *"Saved"* ]]; then
        echo -e "${GREEN}✓${NC}"
        ((success_count++))
      else
        echo -e "${RED}✗ ${result}${NC}"
        ((fail_count++))
      fi
    fi
  done
done

# ------------------------------------------------------------
# 5) ملخص
# ------------------------------------------------------------
echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD} ✅ اكتملت المزامنة                            ${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}نجح:${NC} $success_count متغير"
echo -e "  ${RED}فشل:${NC} $fail_count متغير"
echo ""
echo -e "${BOLD}📋 الخطوات التالية:${NC}"
echo "  1. شاهد المتغيرات في Vercel → Project → Settings → Environment Variables"
echo "  2. أعد النشر لتطبيق المتغيرات الجديدة:"
echo -e "     ${CYAN}bash scripts/deploy-vercel.sh${NC}"
echo ""
