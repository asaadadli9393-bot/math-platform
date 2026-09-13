#!/usr/bin/env python3
"""
scripts/sync-vercel-env.py
منصة الرياضيات | الأستاذ عدلي أسعد

يرفع متغيرات البيئة من .env.production إلى Vercel عبر REST API.
يتفادى الحاجة إلى Vercel CLI.
"""
import os
import sys
import json
import urllib.request
import urllib.parse
import urllib.error

# ============================================================
# إعدادات
# ============================================================
ENV_FILE = "/home/z/my-project/.env.production"
REPO_ROOT = "/home/z/my-project"

# ============================================================
# قراءة ملف .env.production
# ============================================================
def load_env(path):
    env = {}
    if not os.path.exists(path):
        print(f"❌ ملف {path} غير موجود")
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            # تخطّي التعليقات والأسطر الفارغة
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key:
                env[key] = value
    return env

# ============================================================
# استدعاء Vercel API
# ============================================================
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
        return e.code, json.loads(e.read().decode("utf-8"))
    except Exception as e:
        return 0, {"error": str(e)}

# ============================================================
# الرفع
# ============================================================
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

    # المتغيرات المراد رفعها
    ENV_VARS = [
        ("DATABASE_URL", "encrypted"),
        ("ADMIN_KEY", "encrypted"),
        ("ADMIN_EMAIL", "encrypted"),
        ("NEXTAUTH_SECRET", "encrypted"),
        ("SMTP_HOST", "encrypted"),
        ("SMTP_PORT", "encrypted"),
        ("SMTP_USER", "encrypted"),
        ("SMTP_PASS", "encrypted"),
    ]

    success = 0
    failed = 0
    skipped = 0

    for name, _type in ENV_VARS:
        value = env.get(name, "")
        if not value:
            print(f"  ⚠️  {name}: فارغ، تخطّي")
            skipped += 1
            continue

        # إخفاء القيمة عند الطباعة
        masked = value[:30] + "..." if len(value) > 30 else value
        if name == "DATABASE_URL":
            masked = value.split("//")[0] + "//" + value.split("//")[1].split("@")[0].split(":")[0] + ":****@" + value.split("@")[1][:30] + "..."
        print(f"  • {name} ({masked}): ", end="", flush=True)

        # حذف المتغير إن كان موجودًا (PUT لن يفلت)
        path = f"/v9/projects/{PROJECT_ID}/env/{name}?teamId={ORG_ID}"
        # نحاول الحذف بأمان
        try:
            vercel_api("DELETE", path, VERCEL_TOKEN)
        except Exception:
            pass

        # رفع المتغير الجديد
        body = {
            "key": name,
            "value": value,
            "type": _type,
            "target": ["production"],  # تطبيق على بيئة الإنتاج
        }
        path = f"/v10/projects/{PROJECT_ID}/env?teamId={ORG_ID}"
        status, response = vercel_api("POST", path, VERCEL_TOKEN, body=body)

        if status in (200, 201):
            print("✓ رُفع")
            success += 1
        else:
            error_msg = response.get("error", {}).get("message", str(response)) if isinstance(response, dict) else str(response)
            # إن كان المتغير موجودًا مسبقًا، نحدّثه
            if "already exists" in str(error_msg).lower() or status == 409:
                # محاولة التحديث
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
            target = e.get("target", ["?"])
            env_type = e.get("type", "?")
            print(f"  • {key} ({env_type}, target={target})")

if __name__ == "__main__":
    main()
