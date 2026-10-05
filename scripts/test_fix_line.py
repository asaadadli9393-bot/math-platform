# -*- coding: utf-8 -*-
"""اختبار: هل تصلح fix_visual_line سطور الوثائق السيئة؟"""
import json, re, unicodedata
from bidi.algorithm import get_display

RE_AR = re.compile('[\u0600-\u06FF\uFB50-\uFDFF\uFE70-\uFEFF\u0750-\u077F]')

def fix_visual_line(line):
    if not RE_AR.search(line):
        return line
    try:
        logical = get_display(line, base_dir='L')
    except Exception:
        logical = line
    logical = unicodedata.normalize('NFKC', logical)
    for a, b in (('األأ', 'الأ'), ('اإلإ', 'الإ'), ('اآلآ', 'الآ'),
                 ('األ', 'الأ'), ('اإل', 'الإ'), ('اآل', 'الآ')):
        logical = logical.replace(a, b)
    return logical

d = json.load(open('/home/z/my-project/public/formatted/devoirs_3as_d-3as-032_pdf.json', encoding='utf-8'))
pres = re.compile('[\uFB50-\uFDFF\uFE70-\uFEFF]')
n_pres = sum(len(pres.findall(b['x'])) for b in d['blocks'])
print('presentation-form chars stored in JSON:', n_pres)
print()
for b in d['blocks'][:12]:
    raw = b['x'].replace('\n', ' | ')[:70]
    fixed = fix_visual_line(raw)[:70]
    print('RAW  :', raw)
    print('FIXED:', fixed)
    print()
