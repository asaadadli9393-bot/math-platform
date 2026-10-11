#!/usr/bin/env python3
"""Cut out Bay-Kun character frames from backgrounds -> transparent PNGs."""
import sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

DIR = Path('/home/z/my-project/assets/anime')
OUT = DIR / 'cut'
OUT.mkdir(exist_ok=True)

session = new_session('u2net')

frames = ['f_talk', 'f_closed', 'f_point', 'f_thumbs']
for name in frames:
    src = DIR / f'{name}.png'
    img = Image.open(src).convert('RGBA')
    cut = remove(img, session=session)
    # crop to content bbox with small margin
    bbox = cut.getbbox()
    if bbox:
        m = 12
        l = max(0, bbox[0] - m); t = max(0, bbox[1] - m)
        r = min(img.width, bbox[2] + m); b = min(img.height, bbox[3] + m)
        cut = cut.crop((l, t, r, b))
    cut.save(OUT / f'{name}_cut.png')
    print(f'{name}: {img.size} -> cut {cut.size} bbox={bbox}')

print('all cutouts done')
