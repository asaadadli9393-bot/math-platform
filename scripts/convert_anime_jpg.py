# -*- coding: utf-8 -*-
"""تحويل مشاهد الأنمي الجديدة PNG → JPG إلى public/anime/"""
from PIL import Image
import os

SRC = '/home/z/my-project/assets/anime_raw'
DST = '/home/z/my-project/public/anime'
files = ['rs-cover', 'rs-s1', 'rs-s2', 'rs-s3', 'rs-s4', 'qd-cover', 'qd-s1', 'qd-s2', 'qd-s3', 'qd-s4']

for name in files:
    src = os.path.join(SRC, f'{name}.png')
    dst = os.path.join(DST, f'{name}.jpg')
    img = Image.open(src).convert('RGB')
    img.save(dst, 'JPEG', quality=86, optimize=True)
    print(f'{name}.jpg — {os.path.getsize(dst)//1024} KB — {img.size}')
print('DONE')
