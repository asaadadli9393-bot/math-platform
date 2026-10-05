#!/usr/bin/env python3
"""التحقق من مرشحي 1AS/2AS عبر oembed — يطبع العنوان الحقيقي والقناة."""
import json, subprocess, sys

CANDIDATES = [
    # الأعداد الحقيقية 1AS
    ("Ekq_2fSas8A", "1as"), ("s3cvYN2uTH4", "1as"),
    # عموميات الدوال 1AS
    ("aXRriMhqAJI", "1as"), ("xycN37RNVjY", "1as"), ("8o1X_nljpas", "1as"), ("obyK1Q5rymw", "1as"),
    # دوال عامة 2AS
    ("bkTd-CF-Es4", "2as"), ("J7OcDXmV830", "2as"),
    # الضرب النقطي 2AS
    ("FYOX6lbQrbY", "2as"), ("vxP2Ym4w3pw", "2as"),
    # معادلة المستقيم 2AS
    ("rYFKFcryEqk", "2as"), ("1GD-vWrvhSU", "2as"),
    # المتتاليات
    ("HsAn6x-Hupg", "3as"), ("YAGvr0KYl_o", "3as"),
    # النهايات 2AS
    ("v8RfRQPAX8E", "2as"), ("w7ChND70l_c", "2as"), ("Wy7pYi0COHY", "2as"), ("QKvHe-hsGnI", "2as"),
]

out = []
for vid, lvl in CANDIDATES:
    url = f"https://www.youtube.com/watch?v={vid}"
    try:
        r = subprocess.run(
            ["curl", "-s", "--max-time", "15",
             f"https://www.youtube.com/oembed?url={url}&format=json"],
            capture_output=True, text=True, timeout=20,
        )
        d = json.loads(r.stdout)
        out.append({"vid": vid, "level": lvl, "ok": True, "title": d.get("title", ""),
                    "channel": d.get("author_name", "")})
        print(f"OK  {vid} [{lvl}] {d.get('author_name','')} :: {d.get('title','')[:70]}")
    except Exception as e:
        out.append({"vid": vid, "level": lvl, "ok": False})
        print(f"BAD {vid} [{lvl}] {e}")

json.dump(out, open("/tmp/vsearch/verified.json", "w"), ensure_ascii=False, indent=1)
print(f"\nvalid: {sum(1 for o in out if o['ok'])} / {len(out)}")
