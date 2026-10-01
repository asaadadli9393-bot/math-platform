#!/bin/bash
# QA شامل للموسوعة المعرفية: خادم محلي + فحص متصفح في أمر واحد
# الاستخدام: bash /home/z/my-project/scripts/qa_encyclopedia.sh

cd /home/z/my-project

# 1) تنظيف المنفذ وتشغيل الخادم
pkill -f "standalone/server.js" 2>/dev/null
pkill -f "server.js" 2>/dev/null
pkill -f "next-server" 2>/dev/null
sleep 2
PORT=3000 setsid nohup node .next/standalone/server.js > /tmp/qa-server.log 2>&1 &
sleep 3
code="000"
for i in $(seq 1 25); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "1_LOCAL_HTTP=$code"
if [ "$code" != "200" ]; then echo "SERVER_FAILED"; tail -5 /tmp/qa-server.log; exit 1; fi

# 2) فتح الصفحة والذهاب للمكتبة
agent-browser set viewport 1366 900 >/dev/null 2>&1
agent-browser open http://localhost:3000 >/dev/null 2>&1
sleep 2
agent-browser eval "(function(){ const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='المكتبة'); return b? (b.click(),'NAV_CLICKED') : 'NAV_NOT_FOUND'; })()"
sleep 1
echo -n "2_LIB_VIEW: "
agent-browser eval "document.querySelector('h1')?.innerText || 'NO_H1'"

# 3) قسم الموسوعة ظاهر؟
echo -n "3_ENCY_SECTION: "
agent-browser eval "document.body.innerText.includes('الموسوعة المعرفية') ? 'OK' : 'MISSING'"
echo -n "3B_CARD_BADGES: "
agent-browser eval "document.body.innerText.includes('موسوعة كاملة') ? 'OK' : 'MISSING'"

# 4) تبديل لسنة البكالوريا وتوسيع فصل الأعداد المركبة
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); if(!h2) return 'NO_SECTION'; const sec=h2.closest('section'); const tab=[...sec.querySelectorAll('button')].find(b=>b.textContent.includes('بكالوريا')); return tab? (tab.click(),'TAB_OK') : 'NO_TAB'; })()" >/dev/null 2>&1
sleep 0.5
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); const card=[...sec.querySelectorAll('button')].find(b=>b.textContent.includes('الأعداد المركبة')); return card? (card.click(),'CARD_OK') : 'NO_CARD'; })()" >/dev/null 2>&1
sleep 1.5

echo -n "4_COMPLEX_EXPANDED: "
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); return sec.innerText.includes('الجوهر') && sec.innerText.includes('أخطاء شائعة') ? 'OK' : 'MISSING'; })()"

echo -n "5_SOURCE_CHIPS: "
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); return (sec.innerText.includes('مستخلص من مصادر عالمية') && sec.innerText.includes('MathWorld')) ? 'OK' : 'MISSING'; })()"

echo -n "6_KATEX_COUNT_IN_ENCY: "
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); return sec.querySelectorAll('.katex').length; })()"

echo -n "7_RENDER_ERRORS_IN_MATH: "
agent-browser eval "(function(){ return document.body.innerText.includes('خطأ في صياغة LaTeX') ? 'LATEX_ERROR_FOUND' : 'CLEAN'; })()"

# 5) فصل بجدول (المشتقات الكامل) في بكالوريا
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); const card=[...sec.querySelectorAll('button')].find(b=>b.textContent.includes('الاشتقاقية والاستمرارية')); return card? (card.click(),'CARD_OK') : 'NO_CARD'; })()" >/dev/null 2>&1
sleep 1.2
echo -n "8_DERIV_TABLE: "
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); return sec.querySelectorAll('table').length; })()"

# 6) سنة أولى: الدوال المرجعية (جدول مقارنة)
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); const tab=[...sec.querySelectorAll('button')].find(b=>b.textContent.trim()==='أولى ثانوي'); return tab? (tab.click(),'TAB_OK') : 'NO_TAB'; })()" >/dev/null 2>&1
sleep 0.5
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); const card=[...sec.querySelectorAll('button')].find(b=>b.textContent.includes('الدوال المرجعية')); return card? (card.click(),'CARD_OK') : 'NO_CARD'; })()" >/dev/null 2>&1
sleep 1.2
echo -n "9_1AS_REF_TABLE: "
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); const sec=h2.closest('section'); return sec.querySelectorAll('table').length; })()"

echo -n "10_DESKTOP_OVERFLOW_PX: "
agent-browser eval "document.documentElement.scrollWidth - window.innerWidth"

# 7) لقطات
agent-browser eval "(function(){ const h2=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('الموسوعة المعرفية')); h2.scrollIntoView(); return 'SCROLLED'; })()" >/dev/null 2>&1
sleep 0.5
agent-browser screenshot /home/z/my-project/qa/ency-desktop.png >/dev/null 2>&1

# 8) الهاتف: فحص التجاوز
agent-browser set device "iPhone 14" >/dev/null 2>&1
sleep 1
echo -n "11_MOBILE_OVERFLOW_PX: "
agent-browser eval "document.documentElement.scrollWidth - window.innerWidth"
agent-browser screenshot /home/z/my-project/qa/ency-mobile.png >/dev/null 2>&1
agent-browser set viewport 1366 900 >/dev/null 2>&1

# 9) أخطاء الصفحة
echo "12_PAGE_ERRORS:"
agent-browser errors 2>&1 | head -5

echo "13_CONSOLE_TAIL:"
agent-browser console 2>&1 | grep -iE "error|warn" | head -5 || echo "CLEAN"

echo "QA_DONE"
