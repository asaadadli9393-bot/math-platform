#!/bin/bash
# QA: جداول التغيرات vt الجديدة + استكمال بكالوريا 2024 (8 تمارين) + هوية الواجهة
cd /home/z/my-project
mkdir -p qa
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3112 node .next/standalone/server.js > /tmp/qa-vt.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3112/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"

agent-browser open http://localhost:3112 2>/dev/null
sleep 3

echo "=== 1) الرئيسية: هوية الواجهة الجديدة ==="
agent-browser eval "JSON.stringify({
  mathSymbols: ['∑','π','∫','√','∞'].filter(s=>document.body.innerText.includes(s)).length,
  gradientBars: document.querySelectorAll('.via-teal-500').length,
  gradientTiles: document.querySelectorAll('.bg-gradient-to-br').length,
  navIcons: document.querySelectorAll('header svg').length
})" 2>/dev/null

echo "=== 2) السلاسل: بطاقة التصحيح الرسمي 8 تمارين + عداد الحلول ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim().startsWith('السلاسل')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => {
  const t=document.body.innerText;
  const m=t.match(/(\d+) حلاً نموذجياً مفصلاً/);
  const official=[...document.querySelectorAll('article')].find(a=>a.innerText.includes('التصحيح الرسمي الشامل'));
  return JSON.stringify({solutionsCount:m?m[0]:'X', officialCard:!!official, officialCount: official? (official.innerText.match(/(\d+) تمارين محلولة/)||['NO'])[0]:'NO'});
})()" 2>/dev/null

echo "=== 3) معاينة مجانية: حل تجميعية الدوال العددية — جدول vt بقضيب مزدوج ==="
agent-browser eval "(() => {
  const cards=[...document.querySelectorAll('article')].filter(a=>a.innerText.includes('تجميعية الدوال العددية (2008–2026)'));
  if(!cards.length) return 'chain NOT FOUND';
  const btn=cards[0].querySelector('button'); btn.click(); return 'opened';
})()" 2>/dev/null
sleep 1.5
agent-browser eval "(() => {
  const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('الحل النموذجي'));
  if(!btn) return 'reveal NOT FOUND'; btn.click(); return 'revealed';
})()" 2>/dev/null
sleep 2
agent-browser eval "JSON.stringify({
  vtBoxes: document.querySelectorAll('.vt-box').length,
  vtTables: document.querySelectorAll('.vt-table').length,
  bars: document.querySelectorAll('.vt-barcol').length,
  upArrows: document.querySelectorAll('.vt-up').length,
  downArrows: document.querySelectorAll('.vt-down').length,
  posSigns: document.querySelectorAll('.vt-pos').length,
  labels: [...document.querySelectorAll('.vt-label')].map(x=>x.innerText).slice(0,6),
  katexInVt: document.querySelectorAll('.vt-table .katex').length
})" 2>/dev/null
agent-browser screenshot /home/z/my-project/qa/vt-funcderiv.png 2>/dev/null

echo "=== 4) بنك التمارين: جدول vt في حل تمرين (RichText) ==="
agent-browser eval "(() => { const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim().startsWith('بنك التمارين')); b?.click(); return 'nav'; })()" 2>/dev/null
sleep 2
agent-browser eval "(() => {
  const inp=document.querySelector('input[placeholder*=\"ابحث\"]');
  if(!inp) return 'search NOT FOUND';
  const set=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
  set.call(inp,'نصف ناظمية'); inp.dispatchEvent(new Event('input',{bubbles:true})); return 'searched';
})()" 2>/dev/null
sleep 2
agent-browser eval "(() => {
  const btn=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='الحل النموذجي');
  if(!btn) return 'reveal NOT FOUND'; btn.click(); return 'revealed';
})()" 2>/dev/null
sleep 2
agent-browser eval "JSON.stringify({
  bankVt: document.querySelectorAll('.vt-box').length,
  bankTables: document.querySelectorAll('.vt-table').length,
  bankArrows: document.querySelectorAll('.vt-arr').length
})" 2>/dev/null
agent-browser screenshot /home/z/my-project/qa/vt-bank.png 2>/dev/null

echo "=== 5) موبايل 390px: لا تجاوز أفقي ==="
agent-browser set viewport 390 844 2>/dev/null
sleep 1
agent-browser eval "JSON.stringify({ overflow: document.documentElement.scrollWidth > 395 })" 2>/dev/null
agent-browser screenshot /home/z/my-project/qa/vt-mobile.png 2>/dev/null

echo "=== 6) أخطاء الكونسول ==="
agent-browser console 2>/dev/null | grep -ci error || true
kill $SRV 2>/dev/null
echo DONE
