#!/bin/bash
# سكريبت تشغيل خادم Next.js مع إعادة تشغيل تلقائية
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting server..."
  npx next start -p 3000 > /tmp/next.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited ($EXIT_CODE), restarting in 2s..."
  sleep 2
done
