#!/usr/bin/env python3
"""
scripts/vercel-add-domain.py
منصة الرياضيات | الأستاذ عدلي أسعد

يضيف نطاقًا مخصصًا إلى المشروع على Vercel ويُرجع تعليمات DNS.
"""
import os
import sys
import json
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

def main():
    env = load_env(os.path.join(REPO_ROOT, ".env.production"))
    VERCEL_TOKEN = env.get("VERCEL_TOKEN", "")
    PROJECT_ID = env.get("VERCEL_PROJECT_ID", "")
    ORG_ID = env.get("VERCEL_ORG_ID", "")

    # الحصول على النطاق من argument
    if len(sys.argv) < 2:
        print("الاستخدام: python3 vercel-add-domain.py <domain>")
        print("مثال:    python3 vercel-add-domain.py math-adli.com")
        sys.exit(1)
    domain = sys.argv[1].lower().strip()

    if not all([VERCEL_TOKEN, PROJECT_ID, ORG_ID]):
        print("❌ متغيرات VERCEL_* غير مُعرّفة في .env.production")
        sys.exit(1)

    print(f"🌐 ربط النطاق: {domain}")
    print(f"   Project: {PROJECT_ID}")
    print(f"   Org:     {ORG_ID}")
    print()

    # 1) التحقق إن كان النطاق مضافًا بالفعل
    print("1) التحقق من النطاقات الموجودة...")
    path = f"/v9/projects/{PROJECT_ID}/domains?teamId={ORG_ID}&limit=50"
    status, response = vercel_api("GET", path, VERCEL_TOKEN)
    if status != 200:
        print(f"❌ فشل جلب النطاقات (HTTP {status})")
        print(json.dumps(response, indent=2)[:500])
        sys.exit(1)

    existing_domains = response.get("domains", [])
    already_added = False
    existing_info = None
    for d in existing_domains:
        if d.get("name") == domain:
            already_added = True
            existing_info = d
            break

    if already_added:
        print(f"   ✓ النطاق مضاف بالفعل على Vercel")
    else:
        print(f"   • النطاق غير مضاف — سنضيفه الآن...")
        print()
        print("2) إضافة النطاق إلى المشروع...")
        body = {"name": domain}
        path = f"/v10/projects/{PROJECT_ID}/domains?teamId={ORG_ID}"
        status, response = vercel_api("POST", path, VERCEL_TOKEN, body=body)
        if status not in (200, 201):
            print(f"❌ فشل إضافة النطاق (HTTP {status})")
            print(json.dumps(response, indent=2)[:1000])
            sys.exit(1)
        existing_info = response
        print(f"   ✓ تمت إضافة النطاق")

    # 2) عرض الحالة والتكوين المطلوب
    print()
    print("═══════════════════════════════════════════════════")
    print(f" 📋 حالة النطاق: {domain}")
    print("═══════════════════════════════════════════════════")
    print()
    print(f"  • الاسم:          {existing_info.get('name', '')}")
    print(f"  • الحالة:         {existing_info.get('status', '—')}")
    print(f"  • مُتحقّق منه:    {existing_info.get('verified', False)}")
    print(f"  • إعادة التوجيه:  {existing_info.get('redirect', None) or 'لا'}")
    print(f"  • SSL:            {existing_info.get('enabled', False)}")
    print()

    # عرض سجلات DNS المطلوبة
    verification = existing_info.get("verification", {})
    if verification:
        print("🔍 سجلات DNS المطلوبة للتحقق من الملكية:")
        for record_type, values in verification.items():
            if isinstance(values, list):
                for v in values:
                    print(f"   • النوع: {record_type}")
                    print(f"     القيمة: {v}")
                    print(f"     (أضف هذا السجل في DNS provider)")
                    print()
            else:
                print(f"   • النوع: {record_type}")
                print(f"     القيمة: {values}")
                print()

    # تعليمات A و CNAME
    print("═══════════════════════════════════════════════════")
    print(" 🌐 سجلات DNS المطلوبة للتفعيل:")
    print("═══════════════════════════════════════════════════")
    print()
    print("اختر إحدى الطريقتين:")
    print()
    print("🟢 الطريقة 1 (مُوصى بها): سجل A")
    print("   ┌─────────────────────────────────────────────┐")
    print("   │  النوع:  A                                   │")
    print("   │  الاسم: @  (أو نطاقك العاري)                 │")
    print("   │  القيمة: 76.76.21.21                         │")
    print("   └─────────────────────────────────────────────┘")
    print()
    print("🔵 الطريقة 2: سجل CNAME")
    print("   ┌─────────────────────────────────────────────┐")
    print("   │  النوع:  CNAME                               │")
    print("   │  الاسم: @  (أو www)                          │")
    print("   │  القيمة: cname.vercel-dns.com                │")
    print("   └─────────────────────────────────────────────┘")
    print()

    # سجل www
    print("🌐 لإضافة www.math-adli.com أيضًا (نطاق فرعي):")
    print("   ┌─────────────────────────────────────────────┐")
    print("   │  النوع:  CNAME                               │")
    print("   │  الاسم: www                                   │")
    print("   │  القيمة: cname.vercel-dns.com                │")
    print("   └─────────────────────────────────────────────┘")
    print()

    # تعليمات Verification
    if verification:
        print("⚠️  لتأكيد الملكية، أضف هذا السجل الإضافي:")
        for record_type, values in verification.items():
            if isinstance(values, list):
                for v in values:
                    parts = v.split("\t") if "\t" in v else v.split(" ")
                    if len(parts) >= 4:
                        print(f"   ┌─────────────────────────────────────────────┐")
                        print(f"   │  النوع:  {parts[3]:<35}│")
                        print(f"   │  الاسم:  {parts[0]:<35}│")
                        print(f"   │  القيمة: {parts[4] if len(parts)>4 else v:<33}│")
                        print(f"   └─────────────────────────────────────────────┘")
            print()

    print("═══════════════════════════════════════════════════")
    print(" 📋 الخطوات التالية:")
    print("═══════════════════════════════════════════════════")
    print()
    print("  1. اذهب إلى مزوّد DNS لنطاقك (Cloudflare/Namecheap/GoDaddy)")
    print("  2. أضف سجل A بقيمة 76.76.21.21 لنطاق math-adli.com")
    print("  3. (اختياري) أضف سجل CNAME لـ www指向 cname.vercel-dns.com")
    print("  4. انتظر 5-30 دقيقة لانتشار DNS")
    print("  5. شغّل للتحقق:")
    print(f"     python3 scripts/vercel-add-domain.py {domain}")
    print()

if __name__ == "__main__":
    main()
