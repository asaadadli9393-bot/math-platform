#!/bin/bash
# سكريبت تشغيل خادم Next.js (يعيد التشغيل تلقائياً)
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting server..."
  node .next/standalone/server.js > /tmp/next.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 2s..."
  sleep 2
done
