#!/bin/bash
# Production live verification of القارئ الذكي
agent-browser open https://math-adli.vercel.app 2>/dev/null
sleep 4
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button,a')]; const b=bs.find(x=>x.textContent.includes('الفروض والاختبارات')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 3
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('أرشيف الأوراق الحقيقية')); b?.click(); return 'tab'; })()" 2>/dev/null
sleep 2
agent-browser eval "JSON.stringify({ prodSmartBtns: [...document.querySelectorAll('button')].filter(b=>b.textContent.includes('قراءة ذكية')).length })" 2>/dev/null
agent-browser eval "(() => { const bs=[...document.querySelectorAll('button')]; const b=bs.find(x=>x.textContent.includes('قراءة ذكية')); b?.click(); return 'opened'; })()" 2>/dev/null
sleep 5
agent-browser eval "(() => { const d=document.querySelector('[role=dialog]'); return JSON.stringify({ modalOpen: !!d, badge: d?.innerText.includes('القارئ الذكي'), len: (d?.innerText||'').length, sample: (d?.innerText||'').slice(0,220) }); })()" 2>/dev/null
agent-browser screenshot /tmp/prod-reader.png 2>/dev/null
agent-browser console 2>/dev/null | grep -ci error || true
echo DONE
