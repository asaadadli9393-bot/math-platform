#!/usr/bin/env python3
"""
scripts/vercel-check-domain.py
منصة الرياضيات | الأستاذ عدلي أسعد

يتحقق من حالة نطاق مخصص على Vercel ويختبر DNS محليًا.
"""
import os
import sys
import json
import socket
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
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, {"error": "non-JSON"}
    except Exception as e:
        return 0, {"error": str(e)}

def dig_lookup(domain, record_type="A"):
    """يفحص سجل DNS محليًا."""
    try:
        result = subprocess.run(
            ["dig", "+short", record_type, domain],
            capture_output=True, text=True, timeout=10
        )
        return [line.strip() for line in result.stdout.split("\n") if line.strip()]
    except Exception:
        return []

def main():
    env = load_env(os.path.join(REPO_ROOT, ".env.production"))
    VERCEL_TOKEN = env.get("VERCEL_TOKEN", "")
    PROJECT_ID = env.get("VERCEL_PROJECT_ID", "")
    ORG_ID = env.get("VERCEL_ORG_ID", "")

    if not all([VERCEL_TOKEN, PROJECT_ID, ORG_ID]):
        print("❌ متغيرات VERCEL_* غير مُعرّفة")
        sys.exit(1)

    print("╔══════════════════════════════════════════════════════╗")
    print("║  🔍 فحص حالة النطاق المخصص على Vercel                ║")
    print("╚══════════════════════════════════════════════════════╝")
    print()

    # 1) جلب كل النطاقات على المشروع
    print("1) النطاقات المُسجّلة على Vercel:")
    path = f"/v9/projects/{PROJECT_ID}/domains?teamId={ORG_ID}&limit=20"
    status, response = vercel_api("GET", path, VERCEL_TOKEN)
    if status != 200:
        print(f"❌ فشل جلب النطاقات (HTTP {status})")
        sys.exit(1)

    domains = response.get("domains", [])
    if not domains:
        print("   لا توجد نطاقات مخصصة مضافة.")
        sys.exit(0)

    for d in domains:
        name = d.get("name", "")
        verified = d.get("verified", False)
        ssl = d.get("enabled", False)
        redirect = d.get("redirect", None) or "—"
        print(f"   • {name}")
        print(f"     ✓ مُتحقّق منه: {verified}")
        print(f"     🔒 SSL مُفعّل: {ssl}")
        print(f"     → إعادة توجيه إلى: {redirect}")
        print()

    # 2) فحص DNS محليًا للنطاقات
    print("\n2) فحص DNS محليًا:")
    custom_domains = [d for d in domains if "vercel.app" not in d.get("name", "")]
    for d in custom_domains:
        name = d.get("name", "")
        print(f"\n   🌐 {name}:")

        if name.startswith("www."):
            # نطاق فرعي — نبحث عن CNAME
            cnames = dig_lookup(name, "CNAME")
            print(f"      • CNAME records: {cnames if cnames else 'لا يوجد بعد'}")
            if cnames:
                if any("vercel-dns.com" in c for c in cnames):
                    print(f"      ✓ ✅ CNAME صحيح! يشير إلى Vercel")
                else:
                    print(f"      ⚠️  CNAME غير صحيح — يجب أن يشير إلى cname.vercel-dns.com")
        else:
            # نطاق رئيسي — نبحث عن A record
            a_records = dig_lookup(name, "A")
            print(f"      • A records: {a_records if a_records else 'لا يوجد بعد'}")
            if a_records:
                if "76.76.21.21" in a_records:
                    print(f"      ✓ ✅ A record صحيح! (76.76.21.21)")
                else:
                    print(f"      ⚠️  A record غير صحيح — يجب أن يكون 76.76.21.21")

        # اختبار HTTP
        try:
            req = urllib.request.Request(
                f"https://{name}", method="HEAD",
                headers={"User-Agent": "domain-check/1.0"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                status_code = resp.status
                server = resp.headers.get("server", "?")
                print(f"      🌐 HTTP {status_code} (server: {server})")
                if "vercel" in server.lower():
                    print(f"      ✓ ✅ النطاق يخدم من Vercel!")
        except urllib.error.HTTPError as e:
            print(f"      🌐 HTTP {e.code}")
        except Exception as e:
            print(f"      ❌ فشل الاتصال بـ https://{name}")
            print(f"         ({type(e).__name__}: {e})")

    # 3) ملخص حالة كل نطاق
    print()
    print("═══════════════════════════════════════════════════")
    print(" 📋 ملخص الحالة:")
    print("═══════════════════════════════════════════════════")
    for d in custom_domains:
        name = d.get("name", "")
        verified = d.get("verified", False)
        ssl = d.get("enabled", False)
        icon = "✅" if (verified and ssl) else "⏳"
        print(f"   {icon} {name}: verified={verified}, ssl={ssl}")

    print()
    print("💡 للتحقق لاحقًا:")
    print("   python3 scripts/vercel-check-domain.py")
    print()
    print("🛠️  روابط مفيدة:")
    print(f"   • Vercel Domains: https://vercel.com/teams/{ORG_ID}/projects/{PROJECT_ID}/settings/domains")
    print(f"   • Vercel Dashboard: https://vercel.com/{ORG_ID}/math-platform")
    print()

if __name__ == "__main__":
    main()
