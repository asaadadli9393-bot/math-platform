#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""sample_pua_ctx.py — عيّنات سياقية لأعلى محارف PUA في كتل m لبناء خريطة تحويل"""
import json, os, re
from collections import defaultdict

TARGETS = {0xF034, 0xF8F0, 0xE020, 0xF049, 0xF0BE, 0xF265, 0xF07E, 0xF8F1, 0xF8EE, 0xF8F9, 0xF8FB, 0xF8F4, 0xF0A1, 0xF8F3, 0xF8EB}
ctx = defaultdict(list)
for f in sorted(os.listdir('public/formatted')):
    if not f.endswith('.json') or f == 'index.json': continue
    try: d = json.load(open('public/formatted/' + f))
    except: continue
    for b in d.get('blocks', []):
        if b.get('t') != 'm': continue
        x = b.get('x', '')
        for ch in set(x):
            cp = ord(ch)
            if cp in TARGETS and len(ctx[cp]) < 4:
                ctx[cp].append((f.replace('chains_library_','').replace('_pdf.json',''), x[:100]))

for cp, samples in sorted(ctx.items()):
    print(f'=== U+{cp:04X} ({len(samples)} عينات)')
    for doc, s in samples:
        print('   ', doc[:32], '::', repr(s))
