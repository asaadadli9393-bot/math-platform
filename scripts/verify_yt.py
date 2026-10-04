#!/usr/bin/env python3
"""التحقق من فيديوهات يوتيوب المرشحة عبر oembed الرسمي."""
import json, subprocess, sys

CANDIDATES = [
    # المتتاليات
    "YAGvr0KYl_o", "KaRflaTu1Rs", "Knh40twckuQ", "Hcrz7AkIZa4",
    # الدوال العددية والنهايات
    "qF9CKQpvcSw", "oZnlxmqbSIM", "BIV1_Mm-eZI",
    # الاشتقاقية
    "kNRqWehvOtE", "HEgHtpRct-Q", "Yjkg4_3hQmE", "dB40VQYygJE", "sHYcTtqjImU",
    # اللوغاريتمية
    "mSLDJiQbD20", "_n-MY1HL7NY", "ay9ks0Q9kr4",
    # الأسية
    "X-w3SV14dvg", "Y1pujFIJydU",
    # الأعداد المركبة
    "80_t7XeJoD8", "2WTEF-oVUGk",
    # الاحتمالات
    "41OrXw4KCls", "sMldeeYm5po", "GZ0KsopyJ7Y", "lyPvfyIUaj0",
    # الهندسة في الفضاء
    "8QsBOx-BRTM", "GsBu9lGcCdg", "GuIgMYy10x0",
    # التكامل
    "QKrUQ3vGcko", "uFIcpI5XLe8", "UxGi73L2LH8",
]

ok, bad = [], []
for vid in CANDIDATES:
    url = f"https://www.youtube.com/oembed?url=https%3A//www.youtube.com/watch%3Fv%3D{vid}&format=json"
    try:
        r = subprocess.run(["curl", "-s", "-o", "/tmp/oe.json", "-w", "%{http_code}", url],
                           capture_output=True, text=True, timeout=20)
        code = r.stdout.strip()
        if code == "200":
            d = json.load(open("/tmp/oe.json"))
            ok.append({"vid": vid, "title": d.get("title", ""), "channel": d.get("author_name", ""),
                       "embeddable": d.get("html", "") != ""})
            print(f"OK   {vid} | {d.get('author_name','')[:25]:25} | {d.get('title','')[:60]}")
        else:
            bad.append(vid)
            print(f"BAD  {vid} (HTTP {code})")
    except Exception as e:
        bad.append(vid)
        print(f"ERR  {vid}: {e}")

json.dump(ok, open("/home/z/my-project/assets/yt_verified.json", "w"), ensure_ascii=False, indent=1)
print(f"\nverified: {len(ok)}, rejected: {len(bad)} {bad}")
