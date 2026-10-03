#!/bin/bash
# QA الرياضيات في القارئ الذكي: KaTeX + جداول التغيرات + الشوائب
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3110 node .next/standalone/server.js > /tmp/qa-mathread.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3110/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"
agent-browser open http://localhost:3110 2>/dev/null
sleep 3

open_doc() {
  # $1 = كلمة في عنوان البطاقة، $2 = اسم اللقطة
  agent-browser eval "(() => {
    const btns=[...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية'));
    let target=btns[0];
    if('$1'){
      for(const b of btns){ const card=b.closest('div[class*=rounded]'); const t=(card?card.textContent:'')+' '+(b.closest('li')?b.closest('li').textContent:'');
        if(t.includes('$1')){ target=b; break; } }
    }
    if(!target) return 'NO-BUTTON';
    target.click(); return 'clicked';
  })()" 2>/dev/null
  sleep 4
  agent-browser eval "JSON.stringify({
    open: !!document.querySelector('[role=dialog]'),
    katex: document.querySelectorAll('[role=dialog] .katex').length,
    vtTables: document.querySelectorAll('[role=dialog] .vt-table').length,
    mathml: document.querySelectorAll('[role=dialog] .katex-mathml').length,
    junkMainDark: (document.querySelector('[role=dialog]')?.innerText||'').includes('mainDark'),
    junkBang: /!\\d/.test((document.querySelector('[role=dialog]')?.innerText||'').replace(/!\\d/g,m=>m).split('قراءة')[0]) ,
    textLen: (document.querySelector('[role=dialog]')?.innerText||'').length
  })" 2>/dev/null
  agent-browser screenshot "$2" 2>/dev/null
}

# التنقل إلى السلاسل
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.trim().startsWith('السلاسل')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
open_doc "الاشتقاق" /tmp/qa-math-derivablite.png

# إغلاق ثم فتح وثيقة الدوال (جداول تغيرات متعددة)
agent-browser eval "(() => { const x=[...document.querySelectorAll('[role=dialog] button')].find(b=>b.getAttribute('aria-label')==='إغلاق'); x?.click(); return 'c'; })()" 2>/dev/null
sleep 1
open_doc "الدوال" /tmp/qa-math-fonction.png

# تمرير داخل الوثيقة لرصد جداول التغيرات
agent-browser eval "(() => { const el=document.querySelector('[role=dialog] .overflow-y-auto'); if(el){el.scrollTop=1400; return 'scrolled';} return 'no'; })()" 2>/dev/null
sleep 1
agent-browser screenshot /tmp/qa-math-fonction-vt.png 2>/dev/null
agent-browser eval "JSON.stringify({ vtTablesNow: document.querySelectorAll('[role=dialog] .vt-table').length })" 2>/dev/null

# التمرير إلى آخر الوثيقة
agent-browser eval "(() => { const el=document.querySelector('[role=dialog] .overflow-y-auto'); if(el){el.scrollTop=el.scrollHeight; return 'bottom';} return 'no'; })()" 2>/dev/null
sleep 1
agent-browser screenshot /tmp/qa-math-fonction-end.png 2>/dev/null

# الجوال
agent-browser set viewport 390 844 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ overflow: document.documentElement.scrollWidth > 395 })" 2>/dev/null
agent-browser screenshot /tmp/qa-math-mobile.png 2>/dev/null

echo "console-errors:"
agent-browser console 2>/dev/null | grep -ci error || true
kill $SRV 2>/dev/null
echo DONE
