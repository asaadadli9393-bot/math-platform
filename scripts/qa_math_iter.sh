#!/bin/bash
# مرور على وثائق أرشيف الأوراق الحقيقية وعدّ جداول التغيرات والمعادلات
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3112 node .next/standalone/server.js > /tmp/qa-mathread3.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3112/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3112 2>/dev/null
sleep 3
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('أرشيف الأوراق الحقيقية')); b?.click(); return 'tab'; })()" 2>/dev/null
sleep 2

MAXVT=0; MAXI=-1
for idx in 0 1 2 3 4 5 6 7 8 9 10 11; do
  agent-browser eval "(() => { const x=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.getAttribute('aria-label')==='إغلاق'); x?.click(); return 'c'; })()" 2>/dev/null >/dev/null
  sleep 0.8
  RES=$(agent-browser eval "(() => {
    const btns=[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية'));
    const b=btns[$idx];
    if(!b) return 'END';
    const card=b.closest('div[class*=rounded]')||b.closest('article')||b.closest('li');
    const title=(card?(card.querySelector('h4,h3,p')?.textContent||''):'').slice(0,45);
    b.click(); return 'OK:'+title;
  })()" 2>/dev/null)
  if echo "$RES" | grep -q END; then echo "doc[$idx] END"; break; fi
  sleep 3.5
  STATS=$(agent-browser eval "JSON.stringify({
    katex: document.querySelectorAll('[role=dialog] .katex').length,
    vt: document.querySelectorAll('[role=dialog] .vt-table').length,
    len: (document.querySelector('[role=dialog]')?.innerText||'').length
  })" 2>/dev/null)
  echo "doc[$idx] $RES :: $STATS"
  VT=$(echo "$STATS" | sed -E 's/.*"vt":([0-9]+).*/\1/')
  if [ -n "$VT" ] && [ "$VT" -gt "$MAXVT" ] 2>/dev/null; then MAXVT=$VT; MAXI=$idx; fi
done
echo "BEST: doc[$MAXI] vt=$MAXVT"
kill $SRV 2>/dev/null
echo DONE
