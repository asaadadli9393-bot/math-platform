#!/usr/bin/env python3
"""اختبار توليد صورة أنمي عبر الجسر (gemini-2.5-flash-image — حصة مجانية)"""
import json, urllib.request, urllib.error, base64, os, sys

SITE = "https://math-adli.vercel.app"
SECRET = open("/home/z/my-project/.veo-secret").read().strip()

def veo_post(payload, timeout=120):
    req = urllib.request.Request(
        f"{SITE}/api/veo", data=json.dumps(payload).encode(), method="POST",
        headers={"Content-Type": "application/json", "x-veo-secret": SECRET},
    )
    try:
        r = urllib.request.urlopen(req, timeout=timeout)
        return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.load(e)
        except Exception:
            return e.code, {"raw": e.read().decode()[:300]}

PROMPT = ("2D anime style illustration, vertical 9:16, a cheerful young Algerian math teacher "
          "with glasses and a friendly smile standing in a magical night classroom, dark blue "
          "sky with stars visible through the window, glowing golden mathematical symbols and "
          "the radical sign sqrt(2) floating around him like fireflies, green chalkboard with "
          "geometric shapes behind him, clean modern anime art style, vibrant colors, "
          "high quality key visual")

print("=== توليد صورة أنمي تجريبية عبر الجسر ===")
code, j = veo_post({"action": "image", "prompt": PROMPT}, timeout=150)
print(f"HTTP {code}")
if code == 200 and j.get("ok"):
    raw = base64.b64decode(j["data"])
    out = "/home/z/my-project/download/anime_ai/gemini_keyframe_test.png"
    with open(out, "wb") as f:
        f.write(raw)
    print(f"✅ صورة أنمي مولّدة: {out} ({len(raw)/1024:.0f} KB, {j.get('mimeType')})")
else:
    print("الرد:", json.dumps(j, ensure_ascii=False)[:400])
    sys.exit(1)
