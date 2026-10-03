#!/bin/bash
# QA: كتل الرياضيات KaTeX في القارئ الذكي — عدّ .katex + لقطات + أخطاء
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3110 node .next/standalone/server.js > /tmp/qa-math.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3110/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3110 2>/dev/null
sleep 3
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('أرشيف الأوراق الحقيقية')); b?.click(); return 'tab'; })()" 2>/dev/null
sleep 1.5
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 4
agent-browser eval "JSON.stringify({ modalOpen: !!document.querySelector('[role=dialog]'), katex: document.querySelectorAll('[role=dialog] .katex').length, mathml: document.querySelectorAll('[role=dialog] .katex-mathml').length, textLen: (document.querySelector('[role=dialog]')?.innerText||'').length })" 2>/dev/null
agent-browser screenshot /tmp/qa-math-devoir.png 2>/dev/null
# مرر داخل الوثيقة لرؤية المزيد من كتل الرياضيات
agent-browser eval "(() => { const el=document.querySelector('[role=dialog] .overflow-y-auto'); if(el){el.scrollTop=1400; return 'scrolled';} return 'no'; })()" 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ katex: document.querySelectorAll('[role=dialog] .katex').length })" 2>/dev/null
agent-browser screenshot /tmp/qa-math-devoir2.png 2>/dev/null
# سلسلة (مكتبة السلاسل — كتل رياضية كثيفة)
agent-browser eval "(() => { const x=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.getAttribute('aria-label')==='إغلاق'); x?.click(); return 'c'; })()" 2>/dev/null
sleep 1
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.trim().startsWith('السلاسل')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 4
agent-browser eval "JSON.stringify({ katex: document.querySelectorAll('[role=dialog] .katex').length, textLen: (document.querySelector('[role=dialog]')?.innerText||'').length })" 2>/dev/null
agent-browser screenshot /tmp/qa-math-chain.png 2>/dev/null
# موبايل
agent-browser set viewport 390 844 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ overflow: document.documentElement.scrollWidth > 395 })" 2>/dev/null
agent-browser screenshot /tmp/qa-math-mobile.png 2>/dev/null
echo "console-errors:"
agent-browser console 2>/dev/null | grep -ci error || true
kill $SRV 2>/dev/null
echo DONE
