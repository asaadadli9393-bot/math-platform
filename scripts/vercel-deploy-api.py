#!/usr/bin/env python3
"""
scripts/vercel-deploy-api.py
منصة الرياضيات | الأستاذ عدلي أسعد

ينشر المشروع على Vercel عبر REST API (لا يحتاج Vercel CLI).
يقوم بـ:
1) تبديل مزوّد Prisma إلى postgresql
2) توليد Prisma Client
3) إنشاء tar.gz من المشروع
4) رععه إلى Vercel وتفعيل النشر
"""
import os
import sys
import json
import time
import subprocess
import urllib.request
import urllib.parse
import urllib.error
import tempfile
import tarfile

REPO_ROOT = "/home/z/my-project"

def load_env(path):
    env = {}
    if not os.path.exists(path):
        return env
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

def vercel_api(method, path, token, body=None, files=None, content_type="application/json"):
    url = f"https://api.vercel.com{path}"
    headers = {"Authorization": f"Bearer {token}"}
    data = None
    if body is not None:
        if content_type == "application/json":
            headers["Content-Type"] = "application/json"
            data = json.dumps(body).encode("utf-8")
        else:
            data = body
            headers["Content-Type"] = content_type
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, {"error": "non-JSON response"}
    except Exception as e:
        return 0, {"error": str(e)}

def run(cmd, cwd=REPO_ROOT, env=None, check=True):
    """تشغيل أمر مع طباعة المخرجات."""
    print(f"  $ {cmd}")
    full_env = os.environ.copy()
    if env:
        full_env.update(env)
    result = subprocess.run(
        cmd, shell=True, cwd=cwd, env=full_env,
        capture_output=True, text=True
    )
    if result.stdout:
        print(result.stdout[-500:] if len(result.stdout) > 500 else result.stdout)
    if result.returncode != 0 and check:
        print(f"❌ فشل الأمر (exit {result.returncode})")
        if result.stderr:
            print(result.stderr[-500:])
        sys.exit(1)
    return result

def main():
    env = load_env(os.path.join(REPO_ROOT, ".env.production"))
    VERCEL_TOKEN = env.get("VERCEL_TOKEN", "")
    PROJECT_ID = env.get("VERCEL_PROJECT_ID", "")
    ORG_ID = env.get("VERCEL_ORG_ID", "")

    if not all([VERCEL_TOKEN, PROJECT_ID, ORG_ID]):
        print("❌ متغيرات VERCEL_* غير مُعرّفة في .env.production")
        sys.exit(1)

    print("🚀 بدء النشر على Vercel...")
    print()

    # 1) تبديل مزوّد Prisma إلى postgresql
    print("1) تبديل مزوّد Prisma إلى postgresql...")
    schema_path = os.path.join(REPO_ROOT, "prisma/schema.prisma")
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = f.read()
    if 'provider = "sqlite"' in schema:
        schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"')
        with open(schema_path, "w", encoding="utf-8") as f:
            f.write(schema)
        print("   ✓ تم التبديل إلى postgresql")
    else:
        print("   ✓ المزوّد هو postgresql بالفعل")

    # 2) توليد Prisma Client
    print("\n2) توليد Prisma Client...")
    run("npx prisma generate", env={"DATABASE_URL": env["DATABASE_URL"]})

    # 3) بناء Next.js (اختياري - Vercel يبني أيضًا)
    print("\n3) بناء Next.js محليًا للتحقق...")
    build_env = {
        "DATABASE_URL": env["DATABASE_URL"],
        "ADMIN_KEY": env.get("ADMIN_KEY", ""),
        "ADMIN_EMAIL": env.get("ADMIN_EMAIL", ""),
        "NEXTAUTH_SECRET": env.get("NEXTAUTH_SECRET", ""),
        "SMTP_HOST": env.get("SMTP_HOST", ""),
        "SMTP_PORT": env.get("SMTP_PORT", ""),
        "SMTP_USER": env.get("SMTP_USER", ""),
        "NEXT_TELEMETRY_DISABLED": "1",
    }
    build_result = run("npx next build", env=build_env, check=False)
    if build_result.returncode != 0:
        print("⚠️  فشل البناء محليًا — سنتابع النشر على Vercel على أي حال (Vercel سيبني بنفسه)")

    # 4) إنشاء حزمة tar.gz من المشروع
    print("\n4) إنشاء حزمة رفع...")
    ignore = [
        "node_modules",
        ".next",
        ".git",
        "dev.log",
        "server.log",
        "db/custom.db",
        "db/custom.db.backup",
        ".env",
        ".env.production",
        ".env.local",
        "scripts/skills",
        "skills",
    ]

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".tar.gz")
    tmp.close()

    with tarfile.open(tmp.name, "w:gz") as tar:
        for root, dirs, files in os.walk(REPO_ROOT):
            # فلترة المجلدات المتجاهلة
            dirs[:] = [d for d in dirs if d not in ignore]
            for file in files:
                if file in ignore:
                    continue
                full_path = os.path.join(root, file)
                arcname = os.path.relpath(full_path, REPO_ROOT)
                try:
                    tar.add(full_path, arcname=arcname, recursive=False)
                except (OSError, PermissionError):
                    pass

    size = os.path.getsize(tmp.name)
    print(f"   ✓ حزمة جاهزة: {size / 1024:.1f} KB ({tmp.name})")

    # 5) رفع الحزمة والحصول على file URLs
    print("\n5) رفع الملفات إلى Vercel...")
    with open(tmp.name, "rb") as f:
        file_data = f.read()

    path = f"/v2/files?teamId={ORG_ID}"
    status, response = vercel_api(
        "POST", path, VERCEL_TOKEN,
        body=file_data, content_type="application/x-gtar"
    )

    if status != 200:
        print(f"❌ فشل رفع الملف (HTTP {status})")
        print(json.dumps(response, indent=2)[:1000])
        sys.exit(1)

    # 6) إنشاء deployment
    print("\n6) إنشاء deployment على Vercel...")
    sha = subprocess.check_output(
        "git rev-parse HEAD", shell=True, cwd=REPO_ROOT, text=True
    ).strip()

    deploy_body = {
        "name": "math-platform",
        "file": response.get("fileId") or response.get("uid"),
        "projectSettings": {
            "framework": "nextjs",
            "buildCommand": "npx prisma generate || true && next build",
            "installCommand": "npm install",
            "outputDirectory": ".next",
        },
        "target": "production",
        "gitMetadata": {
            "ref": "main",
            "sha": sha,
            "commitMessage": "🚀 deploy via API",
        },
    }

    path = f"/v13/deployments?teamId={ORG_ID}&forceFresh=1"
    status, response = vercel_api("POST", path, VERCEL_TOKEN, body=deploy_body)

    if status not in (200, 201):
        print(f"❌ فشل إنشاء النشر (HTTP {status})")
        print(json.dumps(response, indent=2)[:1500])
        sys.exit(1)

    deployment_id = response.get("id", "")
    deployment_url = response.get("url", "")
    print(f"   ✓ Deployment ID: {deployment_id}")
    print(f"   ✓ URL (provisional): https://{deployment_url}")

    # 7) انتظار اكتمال البناء
    print("\n7) انتظار اكتمال البناء على Vercel...")
    print("   (قد يستغرق 2-4 دقائق)", flush=True)

    while True:
        path = f"/v13/deployments/{deployment_id}?teamId={ORG_ID}"
        status, response = vercel_api("GET", path, VERCEL_TOKEN)
        if status != 200:
            print(f"⚠️  فشل جلب حالة النشر (HTTP {status})")
            time.sleep(10)
            continue

        ready_state = response.get("readyState", "")
        status_field = response.get("status", "")
        alias = response.get("alias", [])

        if ready_state == "READY":
            print(f"   ✓ ✅ جاهز!")
            print(f"   ✓ Alias: {alias}")
            break
        elif ready_state == "ERROR":
            print(f"   ❌ فشل البناء")
            print(json.dumps(response, indent=2)[:1500])
            sys.exit(1)
        else:
            elapsed = int(time.time() - start) if 'start' in dir() else 0
            print(f"   ⏳ الحالة: {ready_state} ({status_field}) — {elapsed}s", flush=True)
            time.sleep(15)

    # 8) إعادة ضبط Prisma لـ SQLite محلي
    print("\n8) إعادة ضبط Prisma لـ SQLite محلي...")
    run("bash scripts/set-prisma-provider.sh", check=False)

    print()
    print("═══════════════════════════════════════════════════")
    print(" ✅ اكتمل النشر على Vercel")
    print("═══════════════════════════════════════════════════")
    print()
    if alias:
        print(f"🌐 رابط الإنتاج: https://{alias[0]}")
    else:
        print(f"🌐 رابط مؤقت: https://{deployment_url}")

    # طباعة كل المعلومات
    print()
    print("📋 معلومات المشروع:")
    print(f"   • Project ID: {PROJECT_ID}")
    print(f"   • Org ID:     {ORG_ID}")
    print(f"   • Deployment ID: {deployment_id}")

    # تنظيف
    os.unlink(tmp.name)

if __name__ == "__main__":
    main()
