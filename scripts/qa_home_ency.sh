#!/bin/bash
# QA: home encyclopedia highlight + in-card interactive exercises
cd /home/z/my-project
pkill -f "next-server" 2>/dev/null; pkill -f "standalone/server.js" 2>/dev/null; sleep 1
setsid nohup node .next/standalone/server.js > /tmp/qa-server.log 2>&1 &
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "SERVER: HTTP $code"

agent-browser open http://localhost:3000/ 2>&1 | tail -1
agent-browser wait --load networkidle 2>&1 | tail -1
echo "=== HOME: encyclopedia section markers:"
agent-browser eval "JSON.stringify({heroSection: document.body.textContent.includes('الموسوعة المعرفية: كل محاورك الـ'), freeBadge: document.body.textContent.includes('ميزة مجانية بالكامل'), cta: document.body.textContent.includes('اقرأ موسوعتك الآن'), chipsCards: document.body.textContent.includes('موسوعة كاملة + تمارين تفاعلية')})" 2>&1 | tail -1
echo "=== click CTA -> should navigate to library:"
agent-browser eval "Array.from(document.querySelectorAll('button')).find(b=>b.textContent.includes('اقرأ موسوعتك الآن'))?.click(); 'cta-clicked'" 2>&1 | tail -1
sleep 1.5
agent-browser eval "JSON.stringify({h1: document.querySelector('h1')?.textContent})" 2>&1 | tail -1
echo "=== LIBRARY: expand first card and test exercises:"
agent-browser eval "Array.from(document.querySelectorAll('[aria-expanded=false]'))[0]?.click(); 'expanded'" 2>&1 | tail -1
sleep 1.5
agent-browser eval "JSON.stringify({exSection: document.body.textContent.includes('جرّب فوراً: تمارين تفاعلية'), exCards: document.querySelectorAll('.ring-stone-200, .ring-emerald-300').length, hintBtns: document.body.textContent.includes('تلميح'), solveBtn: document.body.textContent.includes('الحل النموذجي'), markBtn: document.body.textContent.includes('وسم كمنجز')})" 2>&1 | tail -1
echo "=== interact: reveal solution on first exercise:"
agent-browser eval "const btn=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='الحل النموذجي'); btn?.click(); 'revealed'" 2>&1 | tail -1
sleep 0.8
agent-browser eval "JSON.stringify({solutionShown: document.body.textContent.includes('الحل النموذجي') && document.body.textContent.includes('1.'), storedRevealed: JSON.parse(localStorage.getItem('tadaruj-progress-v1')||'{}').revealed?.length||0})" 2>&1 | tail -1
echo "=== mark solved:"
agent-browser eval "const btn=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='وسم كمنجز'); btn?.click(); 'marked'" 2>&1 | tail -1
sleep 0.8
agent-browser eval "JSON.stringify({solvedCount: JSON.parse(localStorage.getItem('tadaruj-progress-v1')||'{}').solved?.length||0, badge: document.body.textContent.includes('أتممته')})" 2>&1 | tail -1
echo "=== hint toggle:"
agent-browser eval "const btn=Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==='تلميح'); btn?.click(); 'hint'" 2>&1 | tail -1
sleep 0.5
echo "=== errors + screenshots:"
agent-browser errors 2>&1 | tail -1
agent-browser screenshot qa/home-ency-highlight.png 2>&1 | tail -1
agent-browser set device "iPhone 14" 2>&1 | tail -1
agent-browser open http://localhost:3000/ 2>&1 | tail -1
sleep 1
agent-browser eval "document.documentElement.scrollWidth - document.documentElement.clientWidth" 2>&1 | tail -1
agent-browser screenshot qa/home-ency-mobile.png 2>&1 | tail -1
agent-browser close 2>&1 | tail -1
