#!/bin/bash
# QA 4: chains view smart-read + mobile overflow + math/heavy doc
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3108 node .next/standalone/server.js > /tmp/qa-smartread4.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3108/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3108 2>/dev/null
sleep 3
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.trim().startsWith('السلاسل')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "JSON.stringify({ chainSmartBtns: [...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية')).length })" 2>/dev/null
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 4
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); return JSON.stringify({ modalOpen: !!d, len: (d?.innerText||'').length, sample: (d?.innerText||'').slice(120, 420) }); })()" 2>/dev/null
agent-browser screenshot /tmp/qa-reader-chain.png 2>/dev/null
# close, then mobile overflow check on exams archive
agent-browser eval "(() => { const x=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.getAttribute('aria-label')==='إغلاق'); x?.click(); return 'closed'; })()" 2>/dev/null
sleep 1
agent-browser set viewport 390 844 2>/dev/null
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('أرشيف الأوراق الحقيقية')); b?.click(); return 'tab'; })()" 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ mobileOverflow: document.documentElement.scrollWidth > 395, smartBtns: [...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية')).length })" 2>/dev/null
agent-browser console 2>/dev/null | grep -ci error || true
kill $SRV 2>/dev/null
echo DONE
