#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""inspect_codepoints.py — فحص النقاط البرمجية للأسطر المشوهة لتصميم قواعد تنظيف دقيقة"""
import json, sys, unicodedata

def show(label, s):
    print(f'--- {label}')
    print(repr(s[:100]))
    seen = {}
    for ch in s:
        cp = ord(ch)
        if cp > 126 or cp < 32:
            seen[hex(cp)] = seen.get(hex(cp), 0) + 1
    print('  محارف غير ASCII:', dict(sorted(seen.items(), key=lambda x: -x[1])[:12]))

D = 'public/formatted/chains_library_lib-3as-func-deriv-1_pdf.json'
d = json.load(open(D))
for b in d['blocks']:
    x = b.get('x', '')
    if '\uf8fd' in x or '\uf8fe' in x or '\uf8fc' in x or '\uf8ff' in x or 'íÖ' in x or '@@' in x:
        show(b['t'], x)
        if b['t'] == 'm':
            break

D2 = 'public/formatted/chains_library_lib-3as-func-deriv-2_pdf.json'
d2 = json.load(open(D2))
for b in d2['blocks']:
    x = b.get('x', '')
    if '>→0' in x or '<→' in x:
        show(b['t'], x)
        break

# توزيع المحارف المشبوهة على كامل المدونة (m blocks فقط)
from collections import Counter
import os, re
cnt = Counter()
docs_affected = Counter()
for f in os.listdir('public/formatted'):
    if not f.endswith('.json') or f == 'index.json': continue
    try: dd = json.load(open('public/formatted/' + f))
    except: continue
    for b in dd.get('blocks', []):
        if b.get('t') != 'm': continue
        for ch in b.get('x', ''):
            cp = ord(ch)
            if 0xE000 <= cp <= 0xF8FF or 0xF8FC <= cp <= 0xF8FF:
                cnt[hex(cp)] += 1
                docs_affected[f] += 1
print('=== أعلى محارف PUA متبقية في كتل m:', cnt.most_common(15))
print('=== عدد الوثائق المتأثرة:', len(docs_affected))
print('=== أسوأ 8 وثائق:', docs_affected.most_common(8))
