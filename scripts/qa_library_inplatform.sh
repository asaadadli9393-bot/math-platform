#!/bin/bash
# QA local for encyclopedia-only library view (no external links)
cd /home/z/my-project
pkill -f "next-server" 2>/dev/null; pkill -f "standalone/server.js" 2>/dev/null; sleep 1
setsid nohup node .next/standalone/server.js > /tmp/qa-server.log 2>&1 &
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "SERVER: HTTP $code"

agent-browser open http://localhost:3000/ 2>&1 | tail -1
agent-browser wait --load networkidle 2>&1 | tail -1
echo "=== nav tab present?"
agent-browser find text "الموسوعة" click 2>&1 | tail -1
sleep 1
echo "=== H1:"
agent-browser get count "text=الموسوعة المعرفية للرياضيات"
echo "=== no outbound visit buttons (زيارة الموقع / يوتيوب):"
agent-browser get count "text=زيارة الموقع"
agent-browser get count "text=يوتيوب"
echo "=== no دليل المصادر section:"
agent-browser get count "text=دليل المصادر العالمية الكامل"
echo "=== encyclopedia cards present:"
agent-browser get count "text=موسوعة كاملة"
echo "=== expand first card:"
agent-browser snapshot -i -c 2>&1 | grep -oE 'button "[^"]*موسوعة كاملة[^"]*" \[expanded=false, ref=@?e[0-9]+' | head -1
ref=$(agent-browser snapshot -i -c 2>&1 | grep -oE 'ref=e[0-9]+' | head -1 | tr -d 'ref=')
echo "=== click first card ref=$ref"
agent-browser eval "document.querySelectorAll('[aria-expanded=false]')[0]?.click(); 'clicked'"
sleep 1.5
echo "=== expanded content markers:"
agent-browser get count "text=الجوهر"
agent-browser get count "text=المفاهيم الأساسية"
echo "=== outbound <a href=http in page:"
agent-browser eval "Array.from(document.querySelectorAll('a[href]')).filter(a=>a.href.startsWith('http')&&!a.href.includes('localhost')).length"
echo "=== page errors:"
agent-browser errors 2>&1 | tail -1
agent-browser screenshot qa/lib-ency-only-desktop.png 2>&1 | tail -1
agent-browser set device "iPhone 14" 2>&1 | tail -1
agent-browser open http://localhost:3000/ 2>&1 | tail -1
sleep 1
agent-browser find text "الموسوعة" click 2>&1 | tail -1
sleep 1
agent-browser eval "document.documentElement.scrollWidth - document.documentElement.clientWidth"
echo "=== mobile horizontal overflow above (0 = good)"
agent-browser screenshot qa/lib-ency-only-mobile.png 2>&1 | tail -1
agent-browser close 2>&1 | tail -1
