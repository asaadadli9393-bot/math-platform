#!/bin/bash
# ============================================================
# dev.sh — إقلاع منصة تدرّج في وضع الإنتاج (نسخة 2.0 دائمة)
# يشغّله النظام تلقائياً عند كل إقلاع (start.sh)
#
# الفلسفة: المعاينة يجب أن تعمل دائماً — بناء إنتاجي سريع ومستقر
# بدل وضع التطوير البطيء، مع سلسلة أمان لا تترك المعاينة ميتة أبداً:
#   1) بناء إنتاجي محفوظ إن وُجد → تشغيل فوري
#   2) إن لم يوجد → بناء ثم تشغيل
#   3) إن فشل البناء → تشغيل وضع التطوير كحل أخير
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$SCRIPT_DIR"
SERVER_LOG="$LOG_DIR/preview-server.log"
BOOT_LOG="$LOG_DIR/preview-boot.log"
PORT=3000

log() { echo "[TADARUJ-BOOT $(date '+%H:%M:%S')] $*" | tee -a "$BOOT_LOG"; }

wait_for_service() {
	local host="$1" port="$2" name="$3" max_attempts="${4:-60}" attempt=1
	while [ "$attempt" -le "$max_attempts" ]; do
		if curl -s --connect-timeout 2 --max-time 5 "http://$host:$port" >/dev/null 2>&1; then
			log "$name جاهز على $host:$port"
			return 0
		fi
		sleep 1
		attempt=$((attempt + 1))
	done
	log "خطأ: $name لم يجهز خلال ${max_attempts} ثانية"
	return 1
}

cd "$PROJECT_DIR"

: > "$BOOT_LOG"
log "=== إقلاع منصة تدرّج ==="

# ---------- 1) الاعتماديات (لا يوقف الإقلاع عند الفشل) ----------
if command -v bun >/dev/null 2>&1; then
	if [ ! -d node_modules ] || [ ! -x node_modules/.bin/next ]; then
		log "تثبيت الاعتماديات..."
		bun install >>"$BOOT_LOG" 2>&1 || log "تحذير: bun install فشل — نتابع (قد تعمل الشجرة الموجودة)"
	else
		log "الاعتماديات موجودة — تخطي التثبيت"
	fi
else
	log "تحذير: bun غير مثبت!"
fi

# ---------- 2) قاعدة البيانات (اختيارية تماماً — لا توقف الإقلاع) ----------
bun run db:push >>"$BOOT_LOG" 2>&1 || log "تحذير: db:push تخطي (غير حرج — المنصة تعمل بlocalStorage)"

# ---------- 3) ضمان بناء إنتاجي ----------
START_MODE="none"
if [ -f .next/standalone/server.js ] && [ -f .next/BUILD_ID ]; then
	log "بناء إنتاجي محفوظ موجود — تشغيل فوري بلا إعادة بناء"
	START_MODE="standalone"
else
	log "لا يوجد بناء إنتاجي — بدء البناء (يستغرق دقيقة إلى ثلاث)..."
	if command -v bun >/dev/null 2>&1 && bun run build >>"$BOOT_LOG" 2>&1; then
		log "البناء الإنتاجي اكتمل بنجاح"
		START_MODE="standalone"
	else
		log "تحذير: فشل البناء الإنتاجي — سنحاول وضع التطوير كحل أخير"
		START_MODE="dev-fallback"
	fi
fi

# ---------- 4) تنظيف أي خادم قديم على المنفذ ----------
pkill -f "next dev" 2>/dev/null && sleep 1 || true
pkill -f "next-server" 2>/dev/null && sleep 1 || true
fuser -k "$PORT/tcp" 2>/dev/null && sleep 1 || true

# ---------- 5) التشغيل ----------
if [ "$START_MODE" = "standalone" ]; then
	log "تشغيل الخادم الإنتاجي (standalone)..."
	setsid nohup env NODE_ENV=production PORT=$PORT HOSTNAME=0.0.0.0 \
		node .next/standalone/server.js >"$SERVER_LOG" 2>&1 &
	SERVER_PID=$!
	disown "$SERVER_PID" 2>/dev/null || true
	log "PID الخادم: $SERVER_PID — السجل: $SERVER_LOG"

	if wait_for_service localhost $PORT "الخادم الإنتاجي" 90; then
		log "✅ المعاينة جاهزة (إنتاج) — HTTP: $(curl -s -o /dev/null -w '%{http_code}' localhost:$PORT/)"
		log "=== الإقلاع اكتمل بنجاح ==="
		exit 0
	fi
	log "تحذير: الخادم الإنتاجي لم يستجب — التحويل لوضع التطوير..."
	kill "$SERVER_PID" 2>/dev/null || true
	START_MODE="dev-fallback"
fi

if [ "$START_MODE" = "dev-fallback" ]; then
	log "تشغيل وضع التطوير كحل أخير (أبطأ لكنه يعمل)..."
	setsid nohup npx next dev -p $PORT >"$SERVER_LOG" 2>&1 &
	disown 2>/dev/null || true
	if wait_for_service localhost $PORT "خادم التطوير" 120; then
		log "✅ المعاينة جاهزة (تطوير — حل مؤقت)"
		log "=== الإقلاع اكتمل ==="
		exit 0
	fi
	log "❌ فشل كل سبل التشغيل — راجع $SERVER_LOG و $BOOT_LOG"
	exit 1
fi
