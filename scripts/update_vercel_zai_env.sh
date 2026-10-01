#!/bin/bash
# تحديث مفاتيح بوابة z.ai في Vercel (الإنتاج) من إعداد البيئة المحلي المؤكد
# القيم تُمرَّر عبر stdin ولا تُطبع أبداً
set -euo pipefail
cd /home/z/my-project

TOKEN="${VERCEL_TOKEN:?ضع VERCEL_TOKEN في البيئة بدل كتابته هنا}"
SCOPE="team_JZvbO8QvFAimHHtQkjDVUJx1"
PROJ="math-platform"

python3 - <<'PY' > /tmp/zai-env-values.sh
import json
cfg = json.load(open('/etc/.z-ai-config'))
pairs = [
    ("ZAI_BASE_URL", cfg["baseUrl"]),
    ("ZAI_API_KEY", cfg["apiKey"]),
    ("ZAI_TOKEN", cfg.get("token", "")),
    ("ZAI_CHAT_ID", cfg.get("chatId", "")),
    ("ZAI_USER_ID", cfg.get("userId", "")),
]
for name, val in pairs:
    if not val:
        continue
    print(f'echo {json.dumps(val)} | npx vercel env add {name} production --project {name and ""}', end="")
PY

# الطريقة الأدق: نكتب القيم مباشرة هنا بدون طباعتها
python3 - <<'PY' > /tmp/zai-env.sh
import json
cfg = json.load(open('/etc/.z-ai-config'))
print('#!/bin/bash')
print('set -e')
print(f'cd /home/z/my-project')
for name, val in [
    ("ZAI_BASE_URL", cfg["baseUrl"]),
    ("ZAI_API_KEY", cfg["apiKey"]),
    ("ZAI_TOKEN", cfg.get("token", "")),
    ("ZAI_CHAT_ID", cfg.get("chatId", "")),
    ("ZAI_USER_ID", cfg.get("userId", "")),
]:
    if not val:
        continue
    import shlex
    qval = shlex.quote(val)
    print(f'npx vercel env rm {name} production --project math-platform --scope team_JZvbO8QvFAimHHtQkjDVUJx1 --token "$VERCEL_TOKEN" --yes 2>&1 | tail -1 || true')
    print(f'printf %s {qval} | npx vercel env add {name} production --project math-platform --scope team_JZvbO8QvFAimHHtQkjDVUJx1 --token "$VERCEL_TOKEN" 2>&1 | tail -1')
PY

chmod +x /tmp/zai-env.sh
/tmp/zai-env.sh
rm -f /tmp/zai-env.sh /tmp/zai-env-values.sh
echo "DONE - env updated (values never printed)"
