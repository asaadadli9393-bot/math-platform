#!/usr/bin/env bash
# ============================================================
#  scripts/set-prisma-provider.sh
#  يكتشف مزوّد Prisma تلقائياً من DATABASE_URL
#  - file:./...        → SQLite (تطوير محلي)
#  - postgresql://... → PostgreSQL (الإنتاج على Vercel/Neon/Supabase)
# ============================================================
set -e

cd "$(dirname "$0")/.."

if [[ -z "$DATABASE_URL" ]]; then
  echo "⚠️  DATABASE_URL غير مُعرّف. استخدم SQLite الافتراضي."
  PROVIDER="sqlite"
elif [[ "$DATABASE_URL" == postgresql://* ]] || [[ "$DATABASE_URL" == postgres://* ]]; then
  echo "✅ PostgreSQL مُكتشف في DATABASE_URL."
  PROVIDER="postgresql"
else
  echo "✅ SQLite مُكتشف في DATABASE_URL."
  PROVIDER="sqlite"
fi

# استبدال المزوّد في schema.prisma
SCHEMA="prisma/schema.prisma"
if grep -q 'provider = "sqlite"' "$SCHEMA"; then
  if [[ "$PROVIDER" == "postgresql" ]]; then
    sed -i 's|provider = "sqlite"|provider = "postgresql"|' "$SCHEMA"
    echo "🔄 تم تبديل المزوّد من SQLite إلى PostgreSQL."
  fi
elif grep -q 'provider = "postgresql"' "$SCHEMA"; then
  if [[ "$PROVIDER" == "sqlite" ]]; then
    sed -i 's|provider = "postgresql"|provider = "sqlite"|' "$SCHEMA"
    echo "🔄 تم تبديل المزوّد من PostgreSQL إلى SQLite."
  fi
fi

# توليد Prisma Client
echo "🔨 توليد Prisma Client..."
npx prisma generate

echo "✅ Prisma جاهز بمزوّد: $PROVIDER"
