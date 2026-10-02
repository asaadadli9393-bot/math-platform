#!/bin/bash
# QA: توحيد التنسيق — صفر LaTeX خام في كل مواضع العرض + صياغة الأرشيف
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3111 node .next/standalone/server.js &>/tmp/qa_server.log &
SRV=$!
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3111 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "SERVER: HTTP $code (pid $SRV)"

agent-browser set viewport 1280 900 >/dev/null 2>&1
agent-browser open http://localhost:3111 >/dev/null 2>&1
agent-browser wait --load networkidle >/dev/null 2>&1

echo "=== 1) المدرس الذكي: بادئات المحادثة بلا LaTeX خام ==="
agent-browser eval "(() => { [...document.querySelectorAll('nav button, nav a')].find(b=>b.textContent.includes('الذكي')).click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1.5
agent-browser eval "(() => { const chips=[...document.querySelectorAll('button')].filter(b=>b.querySelector('.katex')); const raw=[...document.querySelectorAll('button')].filter(b=>/\\\\frac|\\\\mathbb|\\\\sqrt|\\\\lim|\\\\int/.test(b.textContent)&&!b.querySelector('.katex')); return JSON.stringify({chipsWithKatex: chips.length, rawLatexChips: raw.length, sample: chips[0]?chips[0].textContent.trim().slice(0,50):null}); })()"

echo "=== 2) رسالة المستخدم تعرض الرياضيات منقولة ==="
agent-browser eval "(() => { const chips=[...document.querySelectorAll('button')].filter(b=>b.querySelector('.katex')); if(!chips.length) return 'no-chip'; chips[1].click(); return 'clicked'; })()" >/dev/null 2>&1
sleep 1
agent-browser eval "(() => { const bubbles=[...document.querySelectorAll('div.rounded-2xl.rounded-bl-md')]; const b=bubbles[bubbles.length-1]; if(!b) return 'no-bubble'; return JSON.stringify({hasKatex: !!b.querySelector('.katex'), rawLeak: /\\\\frac|\\\\mathbb/.test(b.textContent)}); })()"

echo "=== 3) الاختبارات: ترويسة 1as بلا (0 ورقة) وترويسة 3as بعدد صحيح ==="
agent-browser eval "(() => { [...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='أولى')[0].click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1
agent-browser eval "(() => { [...document.querySelectorAll('nav button, nav a')].find(b=>b.textContent.trim()==='الاختبارات').click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1.5
agent-browser eval "(() => { const t=[...document.querySelectorAll('h1,h2,h3,p')].map(e=>e.textContent).find(t=>t.includes('ورقة تفاعلية')); return JSON.stringify({headline: t, zeroMention: t?/\\+\\s*0 /.test(t):null}); })()"
agent-browser eval "(() => { [...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='ثالثة')[0].click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1.5
agent-browser eval "(() => { const t=[...document.querySelectorAll('h1,h2,h3,p')].map(e=>e.textContent).find(t=>t.includes('ورقة تفاعلية')); return JSON.stringify({headline: t}); })()"

echo "=== 4) عنوان ورقة تدريبية بـ LaTeX يعرض KaTeX ==="
agent-browser eval "(() => { [...document.querySelectorAll('nav button, nav a')].find(b=>b.textContent.trim()==='الاختبارات').click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1.5
agent-browser eval "(() => { const titles=[...document.querySelectorAll('h3')].filter(h=>h.querySelector('.katex')); const raw=[...document.querySelectorAll('h3')].filter(h=>/\\\\mathbb|\\\\frac/.test(h.textContent)&&!h.querySelector('.katex')); return JSON.stringify({katexTitles: titles.length, rawTitles: raw.length, sample: titles[0]?titles[0].textContent.trim().slice(0,40):null}); })()"

echo "=== 5) الفصول: تسميات الصيغ بلا LaTeX خام (سنة بمتجهات) ==="
agent-browser eval "(() => { [...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='أولى')[0].click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1
agent-browser eval "(() => { [...document.querySelectorAll('nav button, nav a')].find(b=>b.textContent.trim()==='الفصول').click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1.5
agent-browser eval "(() => { const cards=[...document.querySelectorAll('a,div')].filter(e=>e.textContent.includes('الإزاحة بالمتجه')); if(!cards.length) return JSON.stringify({vecChapter: false}); const raw=[...document.querySelectorAll('p,h3,h1')].filter(e=>/\\\\vec|\\\\Omega|\\\\theta/.test(e.textContent)&&!e.querySelector('.katex')); return JSON.stringify({vecChapter: true, rawVecLeaks: raw.length}); })()"

echo "=== 6) الرئيسية: مقدمة فصل الأعداد المركبة (ثالثة) بلا LaTeX خام ==="
agent-browser eval "(() => { [...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='ثالثة')[0].click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1
agent-browser eval "(() => { const raw=[...document.querySelectorAll('p')].filter(e=>/\\\\mathbb\{C\}|\\\$/.test(e.textContent)&&!e.querySelector('.katex')); return JSON.stringify({rawDollarParas: raw.length}); })()"

echo "=== 7) السلاسل: وصف سلسلة البكالوريا بـ KaTeX (3as) ==="
agent-browser eval "(() => { [...document.querySelectorAll('nav button, nav a')].find(b=>b.textContent.trim()==='السلاسل').click(); return 'ok'; })()" >/dev/null 2>&1
sleep 1.5
agent-browser eval "(() => { const arts=[...document.querySelectorAll('article')]; let opened=0; for(const a of arts){ if(a.textContent.includes('الدوال الأسية')){ a.querySelector('button').click(); opened=1; break; } } return JSON.stringify({opened}); })()" >/dev/null 2>&1
sleep 1
agent-browser eval "(() => { const ps=[...document.querySelectorAll('article p')]; const withKatex=ps.filter(p=>p.querySelector('.katex')); const raw=ps.filter(p=>/\\\\mathbb|\\\\frac/.test(p.textContent)&&!p.querySelector('.katex')); return JSON.stringify({descWithKatex: withKatex.length>0, rawDesc: raw.length}); })()"

echo "=== 8) أخطاء الصفحة ==="
agent-browser errors | head -3
echo "=== DONE ==="
kill $SRV 2>/dev/null
