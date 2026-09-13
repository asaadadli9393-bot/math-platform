#!/usr/bin/env bash
# ============================================================
#  scripts/sync-github-secrets.sh
#  منصة الرياضيات | الأستاذ عدلي أسعد
# ============================================================
#  يرفع متغيرات الإنتاج من .env.production إلى GitHub Secrets
#  عبر REST API (لا يحتاج gh CLI).
#
#  الاستخدام:
#    bash scripts/sync-github-secrets.sh              # رفع الكل
#    bash scripts/sync-github-secrets.sh --verify     # طباعة الحالة فقط
#    bash scripts/sync-github-secrets.sh --delete     # حذف كل الأسرار
#
#  المتطلبات:
#    - ملف .env.production يحتوي GITHUB_TOKEN + باقي المتغيرات
#    - GITHUB_TOKEN مع صلاحيات: repo, workflow
#    (أنشئه من: https://github.com/settings/tokens?type=beta)
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
echo -e "${CYAN}║  🔄 مزامنة أسرار GitHub                            ║${NC}"
echo -e "${CYAN}║  منصة الرياضيات | الأستاذ عدلي أسعد                   ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"

# ------------------------------------------------------------
# 0) تحليل الأوامر
# ------------------------------------------------------------
MODE="push"
if [[ "$1" == "--verify" ]]; then MODE="verify"; fi
if [[ "$1" == "--delete" ]]; then MODE="delete"; fi

# ------------------------------------------------------------
# 1) تحميل .env.production
# ------------------------------------------------------------
ENV_FILE=".env.production"
if [[ ! -f "$ENV_FILE" ]]; then
  echo -e "${RED}❌ ملف $ENV_FILE غير موجود.${NC}"
  echo "   أنشئه أولًا: cp .env.production.example $ENV_FILE"
  echo "   ثم عدّل القيم (خصوصًا GITHUB_TOKEN, VERCEL_TOKEN, VERCEL_ORG_ID)"
  exit 1
fi

# قراءة .env.production بأمان
set -a
source "$ENV_FILE" 2>/dev/null || true
set +a

# ------------------------------------------------------------
# 2) التحقق من GITHUB_TOKEN
# ------------------------------------------------------------
if [[ -z "$GITHUB_TOKEN" ]]; then
  echo -e "${RED}❌ GITHUB_TOKEN غير مُعرّف في $ENV_FILE${NC}"
  echo ""
  echo -e "${BOLD}للحصول على التوكن:${NC}"
  echo "  1. اذهب إلى https://github.com/settings/tokens?type=beta"
  echo "  2. اضغط \"Generate new token\""
  echo "  3. اسم: math-platform-secrets-sync"
  echo "  4. Expiration: 90 days (أو أطول)"
  echo "  5. Repository access:"
  echo "     ✓ Only select repositories → اختر asaadadli9393-bot/math-platform"
  echo "  6. Permissions:"
  echo "     ▸ Repository permissions → Actions → Read and write"
  echo "     ▸ Repository permissions → Secrets → Read and write"
  echo "  7. اضغط Generate token وانسخ التوكن"
  echo ""
  echo -e "${BOLD}ثم:${NC}"
  echo "  echo 'GITHUB_TOKEN=\"github_pat_xxx...\"' >> .env.production"
  exit 1
fi

echo -e "${GREEN}✓${NC} GITHUB_TOKEN: ${GITHUB_TOKEN:0:20}..."

# ------------------------------------------------------------
# 3) تحديد المستودع
# ------------------------------------------------------------
REPO="asaadadli9393-bot/math-platform"

# التحقق من الوصول إلى المستودع
echo ""
echo -e "${BOLD}1) التحقق من الوصول إلى $REPO...${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO")

if [[ "$STATUS" != "200" ]]; then
  echo -e "${RED}❌ فشل الوصول إلى المستودع (HTTP $STATUS)${NC}"
  echo "   تأكد من أن GITHUB_TOKEN له صلاحية repo على $REPO"
  exit 1
fi
echo -e "   ${GREEN}✓${NC} الوصول مُؤكّد"

# ------------------------------------------------------------
# 4) الحصول على مفتاح public key لتشفير الأسرار
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}2) جلب مفتاح تشفير المستودع...${NC}"
KEY_RESPONSE=$(curl -s \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/actions/secrets/public-key")

KEY_ID=$(echo "$KEY_RESPONSE" | grep -o '"key_id":"[^"]*"' | head -1 | cut -d'"' -f4)
PUBLIC_KEY=$(echo "$KEY_RESPONSE" | grep -o '"key":"[^"]*"' | head -1 | cut -d'"' -f4)

if [[ -z "$KEY_ID" || -z "$PUBLIC_KEY" ]]; then
  echo -e "${RED}❌ فشل جلب مفتاح التشفير${NC}"
  echo "   استجابة GitHub: $KEY_RESPONSE"
  exit 1
fi
echo -e "   ${GREEN}✓${NC} مفتاح التشفير جاهز (key_id: $KEY_ID)"

# ------------------------------------------------------------
# 5) قائمة الأسرار المراد رفعها
# ------------------------------------------------------------
SECRETS=(
  "VERCEL_TOKEN"
  "VERCEL_ORG_ID"
  "VERCEL_PROJECT_ID"
  "DATABASE_URL"
  "ADMIN_KEY"
  "ADMIN_EMAIL"
  "NEXTAUTH_SECRET"
  "SMTP_HOST"
  "SMTP_PORT"
  "SMTP_USER"
  "SMTP_PASS"
)

# ------------------------------------------------------------
# 6) وضع verify: عرض الحالة الحالية فقط
# ------------------------------------------------------------
if [[ "$MODE" == "verify" ]]; then
  echo ""
  echo -e "${BOLD}3) الحالة الحالية لأسرار GitHub:${NC}"
  echo ""
  for secret in "${SECRETS[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/$REPO/actions/secrets/$secret")
    if [[ "$status" == "200" ]]; then
      echo -e "   ${GREEN}✓${NC} $secret — موجود"
    else
      echo -e "   ${RED}✗${NC} $secret — غير موجود"
    fi
  done
  exit 0
fi

# ------------------------------------------------------------
# 7) وضع delete: حذف كل الأسرار
# ------------------------------------------------------------
if [[ "$MODE" == "delete" ]]; then
  echo ""
  echo -e "${YELLOW}${BOLD}⚠️  وضع الحذف: سيتم حذف كل الأسرار!${NC}"
  read -p "هل أنت متأكد؟ (yes/N): " confirm
  if [[ "$confirm" != "yes" ]]; then
    echo "أُلغي الحذف."
    exit 0
  fi
  echo ""
  for secret in "${SECRETS[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/$REPO/actions/secrets/$secret")
    if [[ "$status" == "204" ]]; then
      echo -e "   ${GREEN}🗑️${NC} $secret — حُذف"
    elif [[ "$status" == "404" ]]; then
      echo -e "   ${YELLOW}–${NC} $secret — لم يكن موجودًا"
    fi
  done
  exit 0
fi

# ------------------------------------------------------------
# 8) وضع push: رفع كل الأسرار
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}3) رفع الأسرار إلى $REPO...${NC}"
echo ""

# التحقق من توفّر libsodium (لتشفير الأسرار)
ENCRYPT_CMD=""

# الطريقة 1: أداة sodium-cli إن كانت مثبتة
if command -v sodium &>/dev/null; then
  ENCRYPT_CMD="sodium"
# الطريقة 2: مكتبة python pynacl
elif python3 -c "import nacl; print(nacl.__version__)" 2>/dev/null; then
  ENCRYPT_CMD="pynacl"
# الطريقة 3: node/libsodium-wrappers
elif node -e "require('libsodium-wrappers')" 2>/dev/null; then
  ENCRYPT_CMD="node"
fi

if [[ -z "$ENCRYPT_CMD" ]]; then
  echo -e "${YELLOW}⚠️  لا توجد مكتبة تشفير Sodium. سنثبّت pynacl مؤقتًا...${NC}"
  pip3 install --quiet pynacl 2>&1 | tail -3
  if python3 -c "import nacl" 2>/dev/null; then
    ENCRYPT_CMD="pynacl"
    echo -e "   ${GREEN}✓${NC} pynacl مثبّت"
  else
    echo -e "${RED}❌ تعذّر تثبيت مكتبة التشفير.${NC}"
    exit 1
  fi
fi

# دالة لتشفير سر باستخدام pynacl
encrypt_secret() {
  local secret_value="$1"
  python3 -c "
import sys
import base64
from nacl import encoding, public

pub_key_str = '''$PUBLIC_KEY'''
pub_key = public.PublicKey(pub_key_str.encode(), encoding.Base64Encoder())
sealed_box = public.SealedBox(pub_key)

encrypted = sealed_box.encrypt(sys.argv[1].encode())
print(base64.b64encode(encrypted).decode())
" "$secret_value"
}

success_count=0
fail_count=0
skip_count=0

for secret in "${SECRETS[@]}"; do
  value=$(eval echo "\$$secret")
  if [[ -z "$value" ]]; then
    echo -e "  ${YELLOW}⚠️  $secret — فارغ، تخطّي${NC}"
    ((skip_count++))
    continue
  fi

  # إخفاء القيمة عند الطباعة
  if [[ ${#value} -gt 30 ]]; then
    masked="${value:0:30}..."
  else
    masked="$value"
  fi
  echo -n "  • $secret ($masked): "

  # تشفير السر
  encrypted=$(encrypt_secret "$value" 2>/dev/null)
  if [[ -z "$encrypted" ]]; then
    echo -e "${RED}فشل التشفير${NC}"
    ((fail_count++))
    continue
  fi

  # رفع السر عبر API
  status=$(curl -s -o /dev/null -w "%{http_code}" -X PUT \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/actions/secrets/$secret" \
    -d "{\"encrypted_value\":\"$encrypted\",\"key_id\":\"$KEY_ID\"}")

  if [[ "$status" == "201" || "$status" == "204" ]]; then
    echo -e "${GREEN}✓ رُفع${NC}"
    ((success_count++))
  else
    echo -e "${RED}✗ HTTP $status${NC}"
    ((fail_count++))
  fi
done

# ------------------------------------------------------------
# 9) ملخّص نهائي
# ------------------------------------------------------------
echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD} ✅ اكتملت مزامنة أسرار GitHub                ${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}نجح:${NC} $success_count سر"
echo -e "  ${YELLOW}تخطّي:${NC} $skip_count سر (فارغ)"
echo -e "  ${RED}فشل:${NC} $fail_count سر"
echo ""

# التحقق النهائي
echo -e "${BOLD}4) تحقق نهائي من الحالة:${NC}"
verified_count=0
for secret in "${SECRETS[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/actions/secrets/$secret")
  if [[ "$status" == "200" ]]; then
    echo -e "   ${GREEN}✓${NC} $secret"
    ((verified_count++))
  fi
done
echo ""
echo -e "  ${CYAN}إجمالي الأسرار المُؤكّدة: $verified_count/${#SECRETS[@]}${NC}"

# ------------------------------------------------------------
# 10) الخطوات التالية
# ------------------------------------------------------------
echo ""
echo -e "${BOLD}📋 الخطوات التالية:${NC}"
echo "  1. اذهب إلى GitHub Actions:"
echo "     https://github.com/$REPO/actions"
echo "  2. ستجد workflow '🚀 Deploy to Vercel' جاهز"
echo "  3. لتشغيله يدويًا: Actions → Select workflow → Run workflow"
echo "  4. لتشغيله تلقائيًا: git push origin main"
echo ""
echo -e "${BOLD}💡 للتحقق من حالة الأسرار لاحقًا:${NC}"
echo "  bash scripts/sync-github-secrets.sh --verify"
echo ""
