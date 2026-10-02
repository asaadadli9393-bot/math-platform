#!/usr/bin/env bash
# QA محلي: خادم standalone + فحوص agent-browser لأوراق 1as/2as والمدرس الذكي
set -e
cd /home/z/my-project

echo "=== 1) تشغيل الخادم ==="
pkill -f "standalone/server.js" 2>/dev/null || true
sleep 1
PORT=3111 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/qa-server.log 2>&1 &
SERVER_PID=$!
ok=""
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3111/ || true)
  if [ "$code" = "200" ]; then ok=1; echo "server up (attempt $i)"; break; fi
  sleep 1
done
[ -z "$ok" ] && { echo "SERVER FAILED"; cat /tmp/qa-server.log; exit 1; }

echo "=== 2) فتح الصفحة ==="
agent-browser open http://127.0.0.1:3111 > /dev/null
sleep 3
agent-browser wait --load networkidle > /dev/null 2>&1 || true

click_text () {
  agent-browser eval "(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim().includes('$1'));if(b){b.click();return 'clicked:$1'}return 'NOTFOUND:$1'})()"
  sleep 2
}

echo "=== 3) تبديل المستوى إلى أولى ثم فتح الفروض ==="
click_text "أولى"
click_text "الفروض والاختبارات"
agent-browser eval "(()=>{const t=document.body.innerText;const m=t.match(/(\d+) ورقة تفاعلية بحلول مفصلة \+ (\d+) ورقة أرشيف حقيقية/);return JSON.stringify({title1as:m?m[0]:'NOT_FOUND'})})()"

echo "=== 4) ورقة تدريبية 1as: توسيع وكشف الحل والتلميح ==="
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button')].filter(x=>x.textContent.includes('فرض تدريبي رقم 1 — الفصل الأول'));if(!b.length)return 'paper NOT FOUND';b[0].click();return 'expanded'})()"
sleep 1.5
agent-browser eval "(()=>{const r=[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('الحل النموذجي'));if(!r.length)return 'reveal NOT FOUND';r[0].click();return 'revealed'})()"
sleep 1.5
agent-browser eval "(()=>{const t=document.body.innerText;return JSON.stringify({hasHint:t.includes('تلميح الأستاذ'),hasSolution:t.includes('الحل النموذجي'),hasNote:t.includes('اكتب كل خطوة تحويل'),hasTopics:t.includes('الحساب على الأعداد الحقيقية'),katex:document.querySelectorAll('.katex').length})})()"

echo "=== 5) رقائق الشعب في ورقة 1as ==="
agent-browser eval "(()=>{const t=document.body.innerText;return JSON.stringify({jointScience:t.includes('علمي • أولى')||t.includes('علوم • أولى'),arts:t.includes('آداب • أولى'),points20:t.includes('/20')})})()"

echo "=== 6) اختبار تدريبي شامل 1as (4 تمارين) ==="
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button')].filter(x=>x.textContent.includes('اختبار تدريبي — الفصل الثالث'));if(!b.length)return 'term paper NOT FOUND';b[0].click();return 'expanded'})()"
sleep 1.5
agent-browser eval "(()=>{const a=[...document.querySelectorAll('article')];const card=a.find(x=>x.innerText.includes('اختبار تدريبي — الفصل الثالث'));if(!card)return 'card NOT FOUND';const rows=card.querySelectorAll('article').length;return JSON.stringify({exerciseRows:rows})})()"

echo "=== 7) ثانية ثانوي: 19 ورقة + ورقة تسيير ==="
click_text "ثانية"
click_text "الفروض والاختبارات"
agent-browser eval "(()=>{const t=document.body.innerText;const m=t.match(/(\d+) ورقة تفاعلية بحلول مفصلة \+ (\d+) ورقة أرشيف حقيقية/);const eco=[...document.querySelectorAll('button')].filter(x=>x.textContent.includes('تسيير واقتصاد')).length;return JSON.stringify({title2as:m?m[0]:'NOT_FOUND',economyPapers:eco})})()"

echo "=== 8) بنك التمارين 2as: عدّاد ==="
click_text "بنك التمارين"
agent-browser eval "(()=>{const t=document.body.innerText;const m=t.match(/(\d+)/);return JSON.stringify({hasBankTitle:t.includes('بنك التمارين'),preview:t.slice(0,300)})})()"

echo "=== 9) المدرس الذكي 2as: بادئات وأزرار سريعة ==="
click_text "المدرس الذكي"
agent-browser eval "(()=>{const t=document.body.innerText;const starters=['الاشتقاقية','الجداء السلمي','الكاشي'].filter(k=>t.includes(k));const qa=['لخّص لي الدرس','أعطني تمريناً','اختبرني بأسئلة سريعة','ما الأخطاء الشائعة؟','منهجية حل نمطية'].filter(k=>t.includes(k));return JSON.stringify({starters2as:starters,quickActions:qa})})()"

echo "=== 10) الموسوعة → توسيع بطاقة → تركيز المدرس الذكي ==="
click_text "الموسوعة"
sleep 2
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('موسوعة كاملة'));if(!b)return 'card NOT FOUND';b.click();return 'card expanded'})()"
sleep 1.5
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('اسأل المدرس الذكي عن هذا المحور'));if(!b)return 'focus tutor btn NOT FOUND';b.click();return 'clicked'})()"
sleep 2.5
agent-browser eval "(()=>{const t=document.body.innerText;return JSON.stringify({focusChip:t.includes('التركيز:'),focusedWelcome:t.includes('مدرّسك الذكي في «')})})()"

echo "=== 11) إرسال أمر سريع (بدون مفاتيح AI محلياً — يتوقع رسالة خطأ لطيفة) ==="
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('لخّص لي الدرس'));if(!b)return 'qa btn NOT FOUND';b.click();return 'clicked quick action'})()"
sleep 2
agent-browser eval "(()=>{const t=document.body.innerText;return JSON.stringify({userBubble:t.includes('لخّص لي درس اليوم'),streamingOrError:t.includes('تعذّر')||t.includes('يكتب الآن')||t.length>0})})()"

echo "=== 12) الأخطاء والتجاوز الأفقي ==="
agent-browser eval "JSON.stringify({hOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth})"

echo "=== تنظيف ==="
kill $SERVER_PID 2>/dev/null || true
pkill -f "standalone/server.js" 2>/dev/null || true
echo "QA DONE"
