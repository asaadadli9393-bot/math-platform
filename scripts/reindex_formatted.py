# -*- coding: utf-8 -*-
"""
بوابة الجودة للقراءة الذكية — تحديث public/formatted/index.json:
  - إعادة فحص كل وثيقة ok بمقياس دقيق (علامات الخطوط المشفّرة + كلمات عربية حقيقية)
  - الوثائق الفاسدة (نسبة فساد >= 4% أو كلمات < 25) تُعلَّم ok:false مع سبب
  - الوثائق السليمة تبقى كما هي (الزر يظهر في الواجهة فقط للسليمة)
"""
import json, os, re

BASE = '/home/z/my-project/public/formatted'
IDX = os.path.join(BASE, 'index.json')

GARBAGE = re.compile(
    '[\u0610-\u061A\u06D6-\u06ED\u06DC\u06DF-\u06E8\u06EA-\u06ED\u06FF'
    '\uFB50-\uFDFF\uFE70-\uFEFF\uFFF9-\uFFFD\uE000-\uF8FF]'
)
AR_WORD = re.compile(r'[\u0621-\u064A\u0671-\u06D3]{2,}')

idx = json.load(open(IDX, encoding='utf-8'))
gated, kept = [], 0
for pdf_path, meta in idx.items():
    if not meta.get('ok'):
        continue
    f = os.path.join(BASE, meta['file'])
    if not os.path.exists(f):
        meta['ok'] = False
        meta['verdict'] = 'missing-file'
        gated.append((pdf_path, 'missing'))
        continue
    d = json.load(open(f, encoding='utf-8'))
    txt = ' '.join(b.get('x', '') for b in d.get('blocks', []) if b.get('t') != 'pg')
    ratio = 100.0 * len(GARBAGE.findall(txt)) / max(len(txt), 1)
    words = len(AR_WORD.findall(txt))
    if ratio >= 4.0 or words < 25:
        meta['ok'] = False
        meta['verdict'] = 'poor-quality'
        meta['garbagePct'] = round(ratio, 1)
        meta['arWords'] = words
        gated.append((pdf_path, f'{ratio:.1f}% / {words}w'))
    else:
        kept += 1

with open(IDX, 'w', encoding='utf-8') as fh:
    json.dump(idx, fh, ensure_ascii=False, separators=(',', ':'))

print(f'kept ok: {kept}')
print(f'gated out: {len(gated)}')
for p, why in gated:
    print('  ✗', p, '→', why)
