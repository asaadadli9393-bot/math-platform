#!/usr/bin/env python3
"""
scripts/vercel-deploy-github.py
منصة الرياضيات | الأستاذ عدلي أسعد

ينشر المشروع على Vercel عبر REST API باستخدام Git source من GitHub.
Vercel سيسحب الكود من GitHub تلقائيًا ويبنيه.
"""
import os
import sys
import json
import time
import subprocess
import urllib.request
import urllib.error

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

def vercel_api(method, path, token, body=None):
    url = f"https://api.vercel.com{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, {"error": "non-JSON"}
    except Exception as e:
        return 0, {"error": str(e)}

def main():
    env = load_env(os.path.join(REPO_ROOT, ".env.production"))
    VERCEL_TOKEN = env.get("VERCEL_TOKEN", "")
    PROJECT_ID = env.get("VERCEL_PROJECT_ID", "")
    ORG_ID = env.get("VERCEL_ORG_ID", "")

    if not all([VERCEL_TOKEN, PROJECT_ID, ORG_ID]):
        print("❌ متغيرات VERCEL_* غير مُعرّفة")
        sys.exit(1)

    # الحصول على معلومات المشروع من Vercel
    print("1) جلب معلومات المشروع من Vercel...")
    path = f"/v9/projects/{PROJECT_ID}?teamId={ORG_ID}"
    status, project = vercel_api("GET", path, VERCEL_TOKEN)
    if status != 200:
        print(f"❌ فشل جلب المشروع (HTTP {status})")
        print(json.dumps(project, indent=2)[:500])
        sys.exit(1)

    project_name = project.get("name", "math-platform")
    link = project.get("link", {})
    repo = link.get("repo", "")
    org = link.get("org", "")
    repo_id = link.get("repoId", 0)
    print(f"   ✓ Project: {project_name}")
    print(f"   ✓ Repo:    {org}/{repo} (ID: {repo_id})")

    # الحصول على آخر SHA من main
    print("\n2) جلب آخر commit SHA من main...")
    sha = subprocess.check_output(
        "git rev-parse main", shell=True, cwd=REPO_ROOT, text=True
    ).strip()
    print(f"   ✓ SHA: {sha[:12]}...")

    # إنشاء deployment من Git source
    print("\n3) إنشاء deployment على Vercel (من Git source)...")
    deploy_body = {
        "name": project_name,
        "gitSource": {
            "type": "github",
            "org": org,
            "repo": repo,
            "ref": "main",
            "sha": sha,
        },
        "target": "production",
        "projectSettings": {
            "framework": "nextjs",
        },
    }

    path = f"/v13/deployments?teamId={ORG_ID}&forceFresh=1&withCache=1"
    status, response = vercel_api("POST", path, VERCEL_TOKEN, body=deploy_body)

    if status not in (200, 201):
        print(f"❌ فشل إنشاء النشر (HTTP {status})")
        print(json.dumps(response, indent=2)[:2000])
        sys.exit(1)

    deployment_id = response.get("id", "")
    deployment_url = response.get("url", "")
    ready_state = response.get("readyState", "")
    print(f"   ✓ Deployment ID: {deployment_id}")
    print(f"   ✓ URL: https://{deployment_url}")
    print(f"   ✓ Ready state: {ready_state}")

    # انتظار اكتمال البناء
    print("\n4) انتظار اكتمال البناء على Vercel...")
    print("   (يستغرق عادة 2-4 دقائق)", flush=True)

    start = time.time()
    last_status = None
    while True:
        path = f"/v13/deployments/{deployment_id}?teamId={ORG_ID}"
        status, response = vercel_api("GET", path, VERCEL_TOKEN)
        if status != 200:
            print(f"⚠️  فشل جلب حالة النشر (HTTP {status})")
            time.sleep(15)
            continue

        ready_state = response.get("readyState", "")
        build_status = response.get("status", "")
        alias = response.get("alias", [])
        ready = response.get("ready", 0)

        elapsed = int(time.time() - start)
        current = f"{ready_state}/{build_status}"
        if current != last_status:
            print(f"   [{elapsed:>3}s] الحالة: {current}", flush=True)
            last_status = current

        if ready_state == "READY":
            print(f"\n   ✅ ✅ البناء اكتمل!")
            print(f"   ⏱️  الوقت الكلي: {elapsed}s")
            if alias:
                print(f"   🌐 Alias: https://{alias[0]}")
            break
        elif ready_state == "ERROR":
            print(f"\n   ❌ فشل البناء")
            error = response.get("error", {})
            if error:
                print(json.dumps(error, indent=2)[:1500])
            sys.exit(1)
        else:
            time.sleep(10)

    print()
    print("═══════════════════════════════════════════════════")
    print(" ✅ اكتمل النشر على Vercel بنجاح")
    print("═══════════════════════════════════════════════════")
    print()
    print(f"   • Project ID: {PROJECT_ID}")
    print(f"   • Org ID:     {ORG_ID}")
    print(f"   • Deployment ID: {deployment_id}")
    if alias:
        print(f"   • Production URL: https://{alias[0]}")
    else:
        print(f"   • Production URL: https://{deployment_url}")

    # جلب كل الـ aliases
    print("\n5) جلب كل الروابط (aliases)...")
    path = f"/v2/deployments/{deployment_id}/aliases?teamId={ORG_ID}&limit=20"
    status, response = vercel_api("GET", path, VERCEL_TOKEN)
    if status == 200:
        aliases = response.get("aliases", [])
        for a in aliases:
            print(f"   • https://{a.get('alias', '')} ({a.get('status', '')})")

if __name__ == "__main__":
    main()
