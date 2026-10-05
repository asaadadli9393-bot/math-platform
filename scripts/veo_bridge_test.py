#!/usr/bin/env python3
"""اختبار جسر Veo الحي — انتظار النشر ثم فحص النماذج وإطلاق مهمة توليد"""
import json, subprocess, sys, time, base64, urllib.request, urllib.error

SITE = "https://math-adli.vercel.app"
SECRET = open("/home/z/my-project/.veo-secret").read().strip()
TOKEN = open("/home/z/my-project/.vercel-token").read().strip()

def vercel_ready():
    url = f"https://api.vercel.com/v6/deployments?projectId=math-platform&target=production&limit=1"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {TOKEN}"})
    try:
        d = json.load(urllib.request.urlopen(req, timeout=20))
        x = d["deployments"][0]
        return x["state"], x["meta"].get("githubCommitMessage", "")
    except Exception as e:
        return f"ERR:{e}", ""

def veo_post(payload, timeout=60):
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{SITE}/api/veo", data=body, method="POST",
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
    except Exception as e:
        return 0, {"error": str(e)}

print("=== 1) انتظار اكتمال النشر ===")
for i in range(40):
    state, msg = vercel_ready()
    print(f"  [{i}] {state} — {msg[:50]}")
    if state == "READY":
        break
    if state not in ("READY", "BUILDING", "QUEUED", "INITIALIZING"):
        print("  حالة غير متوقعة — نخرج"); sys.exit(1)
    time.sleep(15)
if state != "READY":
    print("النشر لم يكتمل"); sys.exit(1)

print("\n=== 2) فحص نماذج Veo المتاحة بالمفتاح ===")
code, j = veo_post({"action": "models"}, timeout=90)
print(f"  HTTP {code}")
if code == 200:
    print("  نماذج Veo:", json.dumps(j.get("veoModels", []), ensure_ascii=False))
else:
    print("  الرد:", json.dumps(j, ensure_ascii=False)[:400])

print("\n=== 3) إطلاق مهمة توليد أنمي تجريبية (نص فقط، 8ث، عمودي) ===")
PROMPT = ("Anime style, a cheerful young Algerian math teacher with glasses stands in a "
          "magical dark-blue classroom at night, enthusiastic smile, he raises his hand and "
          "glowing golden mathematical symbols and formulas orbit around him like fireflies, "
          "chalk board with floating geometry shapes behind, cinematic lighting, smooth high "
          "quality 2D anime animation, vertical composition")
models_to_try = ["veo-3.1-generate-preview", "veo-3.1-fast-generate-preview", "veo-3.1-lite-generate-preview"]
operation, used_model = None, None
for m in models_to_try:
    print(f"  تجربة {m} ...")
    code, j = veo_post({"action": "submit", "prompt": PROMPT, "model": m,
                        "aspectRatio": "9:16", "durationSeconds": 8}, timeout=90)
    print(f"    HTTP {code} — {json.dumps(j, ensure_ascii=False)[:220]}")
    if code == 200 and j.get("name"):
        operation, used_model = j["name"], m
        break
    if code == 429:
        print("    حصة مستنزفة/مزدحمة لهذا النموذج")
if not operation:
    print("\nفشل إطلاق المهمة على كل النماذج — راجع الأخطاء أعلاه")
    sys.exit(2)

print(f"\n=== 4) متابعة المهمة {used_model} ===")
print(f"  operation: {operation}")
video_uri = None
for i in range(50):
    time.sleep(12)
    code, j = veo_post({"action": "poll", "op": operation}, timeout=60)
    done = j.get("done")
    err = (j.get("error") or {}).get("message")
    if err:
        print(f"  [{i}] خطأ من Google: {err}"); sys.exit(3)
    if done:
        resp = j.get("response", {})
        gvr = resp.get("generateVideoResponse") or resp.get("generatedVideos") or resp
        samples = gvr.get("generatedSamples") or gvr.get("videos") or []
        if samples:
            video_uri = samples[0].get("video", {}).get("uri") or samples[0].get("uri")
        print(f"  [{i}] مكتملة ✓")
        break
    print(f"  [{i}] قيد المعالجة...")

if not video_uri:
    print("انتهت المتابعة دون فيديو — الرد الأخير:", json.dumps(j, ensure_ascii=False)[:400])
    sys.exit(4)

print(f"\n=== 5) تنزيل الفيديو ===")
sep = "&" if "?" in video_uri else "?"
dl_url = f"{video_uri}{sep}key={open('/home/z/my-project/.gemini-key').read().strip()}"
out = "/home/z/my-project/download/anime_ai/veo_test_ep0.mp4"
urllib.request.urlretrieve(dl_url, out)
import os
sz = os.path.getsize(out)
print(f"  نُزّل: {out} ({sz/1_048_576:.1f} MB)")
print(f"\nالنموذج الناجح: {used_model}")
print("النتيجة: الجسر يعمل ومولد Veo حي ✅" if sz > 300_000 else "تحذير: حجم ملف صغير مشبوه")
