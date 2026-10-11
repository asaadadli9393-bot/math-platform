#!/bin/bash
# QA for smart reader (القارئ الذكي): serve standalone + agent-browser live checks
cd /home/z/my-project
pkill -f "standalone/server.js" 2>/dev/null; sleep 1
PORT=3105 node .next/standalone/server.js > /tmp/qa-smartread.log 2>&1 &
SRV=$!
for i in $(seq 1 40); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3105/ 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 1
done
echo "HTTP $code"

agent-browser open http://localhost:3105 2>/dev/null
sleep 3
agent-browser eval "JSON.stringify({
  title: document.title,
  navHasMosua: document.body.innerText.includes('الموسوعة'),
  bodyLen: document.body.innerText.length
})" 2>/dev/null
echo "--- checks: formatted assets served ---"
curl -s -o /dev/null -w "index.json: %{http_code} (%{size_download}B)\n" http://localhost:3105/formatted/index.json
curl -s -o /dev/null -w "devoir json: %{http_code}\n" http://localhost:3105/formatted/devoirs_3as_d-3as-001_pdf.json
echo "--- open exams view: look for smart-read buttons ---"
agent-browser snapshot -t 2 2>/dev/null | head -5
agent-browser eval "JSON.stringify({
  smartBtns: document.querySelectorAll('button').length,
  hasSmartText: document.body.innerText.includes('قراءة ذكية')
})" 2>/dev/null
kill $SRV 2>/dev/null
echo DONE
