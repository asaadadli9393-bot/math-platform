#!/usr/bin/env python3
"""
scripts/check-domain-dns.py
منصة الرياضيات | الأستاذ عدلي أسعد

فحص شامل لحالة نطاق مخصص على Vercel + DNS العالمي.
يطبع تعليمات DNS الواضحة للمستخدم.
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
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode("utf-8"))
        except Exception:
            return e.code, {"error": "non-JSON"}
    except Exception as e:
        return 0, {"error": str(e)}

def dig_lookup(domain, record_type="A", dns_server=""):
    """يفحص سجل DNS محليًا."""
    try:
        cmd = ["dig", "+short"]
        if dns_server:
            cmd.extend([f"@{dns_server}"])
        cmd.extend([record_type, domain])
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        return [line.strip() for line in result.stdout.split("\n") if line.strip()]
    except Exception:
        return []

def main():
    env = load_env(os.path.join(REPO_ROOT, ".env.production"))
    VERCEL_TOKEN = env.get("VERCEL_TOKEN", "")
    PROJECT_ID = env.get("VERCEL_PROJECT_ID", "")
    ORG_ID = env.get("VERCEL_ORG_ID", "")

    print("╔══════════════════════════════════════════════════════╗")
    print("║  🔍 فحص شامل لحالة النطاق + DNS                     ║")
    print("╚══════════════════════════════════════════════════════╝")
    print()

    # 1) جلب كل النطاقات على المشروع
    if VERCEL_TOKEN and PROJECT_ID and ORG_ID:
        print("1) النطاقات على Vercel:")
        path = f"/v9/projects/{PROJECT_ID}/domains?teamId={ORG_ID}&limit=20"
        status, response = vercel_api("GET", path, VERCEL_TOKEN)
        if status == 200:
            domains = response.get("domains", [])
            for d in domains:
                name = d.get("name", "")
                verified = d.get("verified", False)
                ssl = d.get("enabled", False)
                icon = "✅" if (verified and ssl) else "⏳"
                print(f"   {icon} {name}: verified={verified}, ssl={ssl}")
        print()

    # 2) فحص DNS العالمي (3 خوادم DNS مختلفة)
    custom_domains = ["math-adli.com", "www.math-adli.com"]

    print("2) فحص DNS عبر عدة خوادم DNS عامة:")
    print("   (إذا كانت النتائج فارغة، فالأستاذ لم يُضِف سجلات DNS بعد)")
    print()

    dns_servers = [
        ("1.1.1.1", "Cloudflare"),
        ("8.8.8.8", "Google"),
        ("9.9.9.9", "Quad9"),
    ]

    for domain in custom_domains:
        print(f"   🌐 {domain}:")
        is_apex = not domain.startswith("www.")

        for dns_ip, dns_name in dns_servers:
            if is_apex:
                records = dig_lookup(domain, "A", dns_ip)
                if records:
                    print(f"      {dns_name:10s}: A → {records}")
                else:
                    print(f"      {dns_name:10s}: لا توجد سجلات A")
            else:
                records = dig_lookup(domain, "CNAME", dns_ip)
                if records:
                    print(f"      {dns_name:10s}: CNAME → {records}")
                else:
                    print(f"      {dns_name:10s}: لا توجد سجلات CNAME")

        # اختبار HTTP
        try:
            req = urllib.request.Request(
                f"https://{domain}",
                method="HEAD",
                headers={"User-Agent": "domain-check/1.0"},
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                status_code = resp.status
                server = resp.headers.get("server", "?")
                print(f"      🌐 HTTP {status_code} (server: {server})")
                if "vercel" in server.lower():
                    print(f"      ✅ النطاق يخدم من Vercel!")
        except urllib.error.HTTPError as e:
            print(f"      🌐 HTTP {e.code}")
        except Exception as e:
            print(f"      ❌ فشل الاتصال: {type(e).__name__}")
        print()

    # 3) فحص النطاق الافتراضي على Vercel (math-platform-weld.vercel.app)
    print("3) النطاق الافتراضي على Vercel:")
    try:
        req = urllib.request.Request(
            "https://math-platform-weld.vercel.app/",
            method="HEAD",
            headers={"User-Agent": "domain-check/1.0"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"   ✅ math-platform-weld.vercel.app: HTTP {resp.status}")
    except Exception as e:
        print(f"   ❌ {e}")
    print()

    # 4) ملخص + تعليمات
    print("═══════════════════════════════════════════════════")
    print(" 📋 حالة ظهور المنصة:")
    print("═══════════════════════════════════════════════════")
    print()

    # التحقق من DNS math-adli.com
    math_adli_dns = dig_lookup("math-adli.com", "A", "1.1.1.1")
    www_math_adli_dns = dig_lookup("www.math-adli.com", "CNAME", "1.1.1.1")

    if math_adli_dns:
        print(f"   ✅ math-adli.com — DNS مُهيّأ (A: {math_adli_dns})")
    else:
        print(f"   ⏳ math-adli.com — بانتظار سجل DNS A")

    if www_math_adli_dns:
        print(f"   ✅ www.math-adli.com — DNS مُهيّأ (CNAME: {www_math_adli_dns})")
    else:
        print(f"   ⏳ www.math-adli.com — بانتظار سجل DNS CNAME")

    print()
    print("═══════════════════════════════════════════════════")
    print(" 🛠️  سجلات DNS المطلوبة:")
    print("═══════════════════════════════════════════════════")
    print()
    print("اذهب إلى لوحة التحكم حيث اشتريت النطاق (math-adli.com):")
    print("- Namecheap: https://ap.www.namecheap.com/Domains/DomainList")
    print("- Cloudflare: https://dash.cloudflare.com")
    print("- GoDaddy: https://dcc.godaddy.com/manage/")
    print("- Vercel DNS: https://vercel.com/guides/using-vercel-dns")
    print()
    print("ثم أضف هذين السجلين:")
    print()
    print("┌────────────────────────────────────────────────────┐")
    print("│  السجل 1 (نطاق رئيسي):                              │")
    print("│    النوع:   A                                       │")
    print("│    الاسم:   @ (أو اتركه فارغاً / math-adli.com.)   │")
    print("│    القيمة:  76.76.21.21                            │")
    print("│    TTL:     Auto / 3600                             │")
    print("└────────────────────────────────────────────────────┘")
    print()
    print("┌────────────────────────────────────────────────────┐")
    print("│  السجل 2 (نطاق فرعي www):                          │")
    print("│    النوع:   CNAME                                  │")
    print("│    الاسم:   www                                    │")
    print("│    القيمة:  cname.vercel-dns.com.                 │")
    print("│    TTL:     Auto / 3600                             │")
    print("└────────────────────────────────────────────────────┘")
    print()
    print("⏱️  مدة انتشار DNS: 5-30 دقيقة (حتى 48 ساعة في حالات نادرة)")
    print()
    print("═══════════════════════════════════════════════════")
    print(" 🌐 حتى ينتشر DNS، المنصة تعمل على الرابط الافتراضي:")
    print("═══════════════════════════════════════════════════")
    print()
    print("   🔗 https://math-platform-weld.vercel.app")
    print()
    print("💡 لفحص الحالة لاحقًا:")
    print("   python3 scripts/check-domain-dns.py")
    print()

if __name__ == "__main__":
    main()
