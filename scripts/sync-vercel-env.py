#!/usr/bin/env python3
"""
scripts/sync-vercel-env.py (enhanced)
منصة الرياضيات | الأستاذ عدلي أسعد

يرفع متغيرات البيئة من .env.production إلى Vercel عبر REST API.
"""
import os
import sys
import json
import urllib.request
import urllib.parse
import urllib.error

ENV_FILE = "/home/z/my-project/.env.production"
REPO_ROOT = "/home/z/my-project"

def load_env(path):
    env = {}
    if not os.path.exists(path):
        print(f"❌ ملف {path} غير موجود")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key:
                env[key] = value
    return env

def vercel_api(method, path, token, body=None):
    url = f"https://api.vercel.com{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, {"error": "non-JSON"}
    except Exception as e:
        return 0, {"error": str(e)}

def main():
    env = load_env(ENV_FILE)

    VERCEL_TOKEN = env.get("VERCEL_TOKEN", "")
    PROJECT_ID = env.get("VERCEL_PROJECT_ID", "")
    ORG_ID = env.get("VERCEL_ORG_ID", "")

    if not VERCEL_TOKEN or not PROJECT_ID or not ORG_ID:
        print("❌ VERCEL_TOKEN أو VERCEL_PROJECT_ID أو VERCEL_ORG_ID غير مُعرّفة")
        sys.exit(1)

    print(f"🔗 Project: {PROJECT_ID}")
    print(f"🔗 Org:     {ORG_ID}")
    print(f"🔐 Token:   {VERCEL_TOKEN[:14]}...")
    print()

    # المتغيرات المراد رفعها (مع رفع LLM_* الجديدة)
    ENV_VARS = [
        "DATABASE_URL",
        "ADMIN_KEY",
        "ADMIN_EMAIL",
        "NEXTAUTH_SECRET",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        # LLM (المساعد الذكي + TTS + فحص المحتوى)
        "LLM_PROVIDER",
        "LLM_API_KEY",
        "LLM_MODEL",
        "LLM_BASE_URL",
    ]

    success = 0
    failed = 0
    skipped = 0

    for name in ENV_VARS:
        value = env.get(name, "")
        if not value:
            print(f"  ⚠️  {name}: فارغ، تخطّي")
            skipped += 1
            continue

        masked = value[:30] + "..." if len(value) > 30 else value
        if name == "DATABASE_URL":
            masked = value.split("//")[0] + "//" + value.split("//")[1].split("@")[0].split(":")[0] + ":****@" + value.split("@")[1][:30] + "..."
        elif name == "Z_AI_TOKEN":
            masked = value[:20] + "..."
        print(f"  • {name} ({masked}): ", end="", flush=True)

        # حذف المتغير إن كان موجودًا
        path = f"/v9/projects/{PROJECT_ID}/env/{name}?teamId={ORG_ID}"
        try:
            vercel_api("DELETE", path, VERCEL_TOKEN)
        except Exception:
            pass

        # رفع المتغير الجديد
        body = {
            "key": name,
            "value": value,
            "type": "encrypted",
            "target": ["production"],
        }
        path = f"/v10/projects/{PROJECT_ID}/env?teamId={ORG_ID}"
        status, response = vercel_api("POST", path, VERCEL_TOKEN, body=body)

        if status in (200, 201):
            print("✓ رُفع")
            success += 1
        else:
            error_msg = response.get("error", {}).get("message", str(response)) if isinstance(response, dict) else str(response)
            if "already exists" in str(error_msg).lower() or status == 409:
                path = f"/v1/projects/{PROJECT_ID}/env/{name}?teamId={ORG_ID}"
                patch_body = {"value": value}
                status2, response2 = vercel_api("PATCH", path, VERCEL_TOKEN, body=patch_body)
                if status2 in (200, 201):
                    print("✓ حُدّث")
                    success += 1
                else:
                    print(f"✗ فشل التحديث: {error_msg}")
                    failed += 1
            else:
                print(f"✗ {error_msg}")
                failed += 1

    print()
    print(f"═══════════════════════════════════════════════════")
    print(f" ✅ اكتملت مزامنة متغيرات Vercel")
    print(f"═══════════════════════════════════════════════════")
    print()
    print(f"  ✓ نجح: {success}")
    print(f"  ⚠️  تخطّي: {skipped}")
    print(f"  ✗ فشل: {failed}")
    print()

    # طباعة المتغيرات الحالية على Vercel
    print("📋 المتغيرات الحالية على Vercel:")
    path = f"/v9/projects/{PROJECT_ID}/env?teamId={ORG_ID}&limit=50"
    status, response = vercel_api("GET", path, VERCEL_TOKEN)
    if status == 200:
        envs = response.get("envs", [])
        for e in envs:
            key = e.get("key", "?")
            env_type = e.get("type", "?")
            print(f"  • {key} ({env_type})")

if __name__ == "__main__":
    main()
