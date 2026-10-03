#!/bin/bash
# QA 5: redesigned reader — devoir + series, desktop + mobile screenshots
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3109 node .next/standalone/server.js > /tmp/qa-smartread5.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3109/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3109 2>/dev/null
sleep 3
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('أرشيف الأوراق الحقيقية')); b?.click(); return 'tab'; })()" 2>/dev/null
sleep 1.5
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 4
agent-browser eval "JSON.stringify({ modalOpen: !!document.querySelector('[role=dialog]'), len: (document.querySelector('[role=dialog]')?.innerText||'').length })" 2>/dev/null
agent-browser screenshot /tmp/qa-reader-v2-devoir.png 2>/dev/null
# close + open a series (chains view)
agent-browser eval "(() => { const x=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.getAttribute('aria-label')==='إغلاق'); x?.click(); return 'c'; })()" 2>/dev/null
sleep 1
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.trim().startsWith('السلاسل')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 4
agent-browser screenshot /tmp/qa-reader-v2-chain.png 2>/dev/null
# scroll down inside modal for more content
agent-browser eval "(() => { const el=document.querySelector('[role=dialog] .overflow-y-auto'); if(el){el.scrollTop=900; return 'scrolled';} return 'no'; })()" 2>/dev/null
sleep 1
agent-browser screenshot /tmp/qa-reader-v2-chain-scrolled.png 2>/dev/null
# mobile check
agent-browser set viewport 390 844 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ overflow: document.documentElement.scrollWidth > 395 })" 2>/dev/null
agent-browser screenshot /tmp/qa-reader-v2-mobile.png 2>/dev/null
agent-browser console 2>/dev/null | grep -ci error || true
kill $SRV 2>/dev/null
echo DONE
