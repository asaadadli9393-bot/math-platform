#!/usr/bin/env python3
"""
Quick Vercel deploy script - re-built from worklog
"""
import os
import sys
import json
import time
import subprocess
import urllib.request
import urllib.error

REPO_ROOT = "/home/z/my-project"

# Config from worklog
VERCEL_TOKEN = ""
PROJECT_ID = "prj_fmumwoENNgTzguMu4xAKkyqJAC3t"
ORG_ID = "team_JZvbO8QvFAimHHtQkjDVUJx1"

def vercel_api(method, path, body=None):
    url = f"https://api.vercel.com{path}"
    headers = {
        "Authorization": f"Bearer {VERCEL_TOKEN}",
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
    print("🚀 النشر على Vercel...")

    # 1) جلب آخر commit SHA من main
    print("\n1) جلب آخر commit SHA...")
    sha = subprocess.check_output(
        "git rev-parse main", shell=True, cwd=REPO_ROOT, text=True
    ).strip()
    print(f"   ✓ SHA: {sha[:12]}...")

    # 2) جلب معلومات المشروع
    print("\n2) جلب معلومات المشروع...")
    path = f"/v9/projects/{PROJECT_ID}?teamId={ORG_ID}"
    status, project = vercel_api("GET", path)
    if status != 200:
        print(f"❌ فشل جلب المشروع (HTTP {status})")
        print(json.dumps(project, indent=2)[:500])
        sys.exit(1)

    project_name = project.get("name", "math-platform")
    link = project.get("link", {})
    repo = link.get("repo", "")
    org = link.get("org", "")
    print(f"   ✓ Project: {project_name}")
    print(f"   ✓ Repo:    {org}/{repo}")

    # 3) إنشاء deployment من Git source
    print("\n3) إنشاء deployment على Vercel...")
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
    status, response = vercel_api("POST", path, body=deploy_body)

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

    # 4) انتظار اكتمال البناء
    print("\n4) انتظار اكتمال البناء على Vercel...")
    print("   (يستغرق عادة 2-4 دقائق)", flush=True)

    start = time.time()
    last_status = None
    while True:
        path = f"/v13/deployments/{deployment_id}?teamId={ORG_ID}"
        status, response = vercel_api("GET", path)
        if status != 200:
            time.sleep(15)
            continue

        ready_state = response.get("readyState", "")
        build_status = response.get("status", "")
        alias = response.get("alias", [])

        elapsed = int(time.time() - start)
        current = f"{ready_state}/{build_status}"
        if current != last_status:
            print(f"   [{elapsed:>3}s] الحالة: {current}", flush=True)
            last_status = current

        if ready_state == "READY":
            print(f"\n   ✅ البناء اكتمل!")
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

if __name__ == "__main__":
    main()
