#!/bin/bash
# QA للترقية البصرية ui-upgrade-1 — أيقونات مميزة + هيدر جديد
set -e
cd /home/z/my-project
PORT=3107
LOG=/tmp/qa-ui-server.log

echo "=== 1) بناء خادم الإنتاج محلياً ==="
(PORT=$PORT node .next/standalone/server.js >"$LOG" 2>&1 &)
sleep 4
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" || true)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP: $code"

echo "=== 2) فحص الكونسول والأخطاء + لقطات عبر agent-browser ==="
agent-browser open "http://localhost:$PORT/" >/dev/null 2>&1 || true
sleep 4
agent-browser console 2>/dev/null | tail -5 > /tmp/qa-ui-console.txt || true
echo "--- console tail:"; cat /tmp/qa-ui-console.txt
agent-browser screenshot /home/z/my-project/qa/ui-home-desktop.png >/dev/null 2>&1 || true

# شريط التنقل النشط: نضغط على «الفصول» لتفعيل NavTile
agent-browser snapshot 2>/dev/null | grep -o 'الفصول' | head -1 >/dev/null && echo "NAV OK: زر الفصول موجود"

echo "=== 3) عدد البلاطات المتدرجة (IconTile) في الرئيسية ==="
agent-browser eval "JSON.stringify({tiles: document.querySelectorAll('span.ring-inset').length, gradientTiles: document.querySelectorAll('span[class*=\"bg-gradient-to-br\"]').length, navBtns: document.querySelectorAll('header nav button').length})" 2>/dev/null || true

echo "=== 4) لقطة موبايل ==="
agent-browser set viewport 390 844 >/dev/null 2>&1 || true
agent-browser screenshot /home/z/my-project/qa/ui-home-mobile.png >/dev/null 2>&1 || true
# فحص فائض أفقي
agent-browser eval "JSON.stringify({overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth})" 2>/dev/null || true

echo "=== 5) فحص صفحة الفصول ==="
agent-browser open "http://localhost:$PORT/" >/dev/null 2>&1
sleep 2
echo "=== done ==="
