#!/bin/bash
# Deep QA 3: archive tab -> smart-read button -> modal content
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3107 node .next/standalone/server.js > /tmp/qa-smartread3.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3107/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3107 2>/dev/null
sleep 3
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('أرشيف الأوراق الحقيقية')); b?.click(); return 'tab'; })()" 2>/dev/null
sleep 2
agent-browser eval "JSON.stringify({
  smartReadBtns: [...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية')).length,
  archiveCards: document.body.innerText.includes('فتح الورقة')
})" 2>/dev/null
echo "--- open modal ---"
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 4
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); return JSON.stringify({
  modalOpen: !!d,
  readerBadge: d?.innerText.includes('القارئ الذكي'),
  pageChips: d?.innerText.includes('الصفحة'),
  len: (d?.innerText||'').length,
  sample: (d?.innerText||'').slice(0, 300)
}); })()" 2>/dev/null
agent-browser screenshot /tmp/qa-reader-modal3.png 2>/dev/null
echo "--- console errors ---"
agent-browser console 2>/dev/null | grep -ci "error" || true
kill $SRV 2>/dev/null
echo DONE
