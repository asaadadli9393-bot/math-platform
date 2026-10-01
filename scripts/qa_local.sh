#!/bin/bash
# اختبار محلي شامل: إقلاع الخادم الإنتاجي + اختبار المدرس الذكي (نص وصورة) + فحص الصفحات
set -e
cd /home/z/my-project

PORT=3111
LOG=/tmp/qa-server.log

# تنظيف منفذ قديم
fuser -k ${PORT}/tcp 2>/dev/null || true
sleep 1

# الإقلاع من بناء standalone
(setsid nohup node .next/standalone/server.js > $LOG 2>&1 &) 
PORT=${PORT} setsid nohup node .next/standalone/server.js > $LOG 2>&1 &
echo $! > /tmp/qa-server.pid
sleep 1

# انتظار الجاهزية (30 ثانية كحد أقصى)
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/" 2>/dev/null | grep -q 200; then
    echo "SERVER UP after ${i}s"
    break
  fi
  sleep 1
done

echo "=== 1) الصفحة الرئيسية ==="
curl -s -o /dev/null -w "home: %{http_code}\n" "http://localhost:${PORT}/"

echo "=== 2) tutor نصي (عبر ZAI أو pollinations) ==="
curl -s --max-time 55 -X POST "http://localhost:${PORT}/api/tutor" \
  -H "Content-Type: application/json" \
  -d '{"year":"y3","history":[{"role":"user","content":"ما مشتقة sin(x)؟ أجب بسطر واحد"}]}' | head -c 400
echo ""

echo "=== 3) tutor بصورة (مسار الرؤية) ==="
python3 - <<'PYEOF' > /tmp/vision-req.json
import base64, json
b64 = base64.b64encode(open('/tmp/test-math.png','rb').read()).decode()
print(json.dumps({
    "year": "y3",
    "history": [{"role": "user", "content": "حل التمرين في الصورة"}],
    "images": [f"data:image/png;base64,{b64}"]
}))
PYEOF
curl -s --max-time 55 -X POST "http://localhost:${PORT}/api/tutor" \
  -H "Content-Type: application/json" \
  --data-binary @/tmp/vision-req.json | head -c 600
echo ""
echo "=== QA DONE ==="
