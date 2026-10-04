#!/usr/bin/env python3
"""معالجة أيقونة باي الذهبي وتوليد جميع المقاسات للمنصة."""
from PIL import Image
import os

BASE = "/home/z/my-project"
RAW = f"{BASE}/assets/pi_gold_raw.png"

img = Image.open(RAW).convert("RGB")
w, h = img.size
print(f"raw: {w}x{h}")

# قص الأطراف الداكنة للوصول إلى المربع المستدير نفسه (حوالي 9% من كل جهة)
crop = (int(w * 0.095), int(h * 0.095), int(w * 0.905), int(h * 0.945))
sq = img.crop(crop)
# ضبط مربع تماماً
side = min(sq.size)
sq = sq.crop(((sq.width - side) // 2, (sq.height - side) // 2,
              (sq.width + side) // 2, (sq.height + side) // 2))
print(f"cropped square: {sq.size[0]}x{sq.size[1]}")

def save(size, path):
    out = sq.resize((size, size), Image.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    out.save(path, quality=95)
    print(f"saved {path} ({size}x{size})")

# أيقونات PWA (تُستعمل في manifest.webmanifest)
save(512, f"{BASE}/public/icon-512.png")
save(192, f"{BASE}/public/icon-192.png")

# أيقونة Next.js App Router → favicon تلقائي + أيقونة تبويب
save(512, f"{BASE}/src/app/icon.png")
# أيقونة Apple touch
save(180, f"{BASE}/src/app/apple-icon.png")

# favicon.ico تقليدي (16/32/48)
ico_path = f"{BASE}/public/favicon.ico"
sq.resize((48, 48), Image.LANCZOS).save(ico_path,
    sizes=[(16, 16), (32, 32), (48, 48)])
print(f"saved {ico_path}")
print("DONE")
