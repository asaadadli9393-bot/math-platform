#!/bin/bash
# QA: توسعة حلول بكالوريا — تحقق حي من العدادات والتصيير
set -e
PORT=3107
cd /home/z/my-project
echo "=== 1) فحص المحتوى في المصدر ==="
node -e "
const { BAC_SOLUTION_CHAINS } = require('./.next/standalone/node_modules/next/dist/compiled/react');
" 2>/dev/null || true
bun -e "
import { BAC_SOLUTION_CHAINS } from './src/data/bac-solutions';
import { BAC_OFFICIAL_CHAINS } from './src/data/bac-official';
let total = 0;
for (const c of BAC_SOLUTION_CHAINS) {
  console.log(c.id, '->', c.exercises.length, 'exercises');
  total += c.exercises.length;
}
console.log('TOTAL bacsol exercises:', total);
console.log('official exercises:', BAC_OFFICIAL_CHAINS.reduce((s,c)=>s+c.exercises.length,0));
// فحص أن كل تمرين جديد له نص وتلميح وحل
let bad = 0;
for (const c of BAC_SOLUTION_CHAINS) for (const e of c.exercises) {
  if (!e.statement || !e.solution || e.solution.length < 200) bad++;
}
console.log('bad exercises:', bad);
"

echo "=== 2) تشغيل الخادم الإنتاجي محلياً على $PORT ==="
pkill -f "standalone/server.js" 2>/dev/null || true
sleep 1
PORT=$PORT nohup node .next/standalone/server.js > /tmp/qa-bac-server.log 2>&1 &
sleep 4
curl -s -o /dev/null -w "home: %{http_code}\n" "http://localhost:$PORT/"

echo "=== 3) فحص السلاسل في HTML ==="
HOMEPAGE=$(curl -s "http://localhost:$PORT/")
echo "الحلول النموذجية mentions: $(echo "$HOMEPAGE" | grep -o 'الحلول النموذجية' | wc -l)"
echo "104 count: $(echo "$HOMEPAGE" | grep -o '104' | wc -l)"

echo "=== Server log tail ==="
tail -3 /tmp/qa-bac-server.log
