#!/bin/bash
# Deep QA: exams view smart-read buttons + open reader modal
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3106 node .next/standalone/server.js > /tmp/qa-smartread2.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3106/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3106 2>/dev/null
sleep 3
# navigate to exams via JS click (Arabic selectors unreliable)
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); if(b){b.click(); return 'clicked';} return 'notfound'; })()" 2>/dev/null
sleep 2
agent-browser eval "JSON.stringify({
  smartReadBtns: [...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية')).length,
  paperCards: document.body.innerText.includes('فتح الورقة')
})" 2>/dev/null
echo "--- click first smart-read button ---"
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); if(b){b.click(); return 'opened';} return 'nobutton'; })()" 2>/dev/null
sleep 3
agent-browser eval "JSON.stringify({
  modalOpen: !!document.querySelector('[role=dialog]'),
  readerBadge: document.body.innerText.includes('القارئ الذكي'),
  pageChips: document.body.innerText.includes('الصفحة'),
  hasContent: (document.querySelector('[role=dialog]')?.innerText || '').length,
  originalBtn: document.body.innerText.includes('الملف الأصلي')
})" 2>/dev/null
agent-browser screenshot /tmp/qa-reader-modal.png 2>/dev/null
echo "--- close modal (Escape) ---"
agent-browser eval "(() => { document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'})); const x=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.getAttribute('aria-label')==='إغلاق'); if(x){x.click(); return 'closed';} return 'noclose'; })()" 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ modalClosed: !document.querySelector('[role=dialog]') })" 2>/dev/null
echo "--- console errors ---"
agent-browser console 2>/dev/null | grep -i "error" | head -5
kill $SRV 2>/dev/null
echo DONE
