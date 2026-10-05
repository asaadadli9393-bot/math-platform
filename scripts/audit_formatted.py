# -*- coding: utf-8 -*-
"""تدقيق جودة ملفات القراءة الذكية public/formatted/*.json"""
import json, os, re

BASE = '/home/z/my-project/public/formatted'
idx = json.load(open(os.path.join(BASE, 'index.json'), encoding='utf-8'))
ok = {k: v for k, v in idx.items() if v.get('ok')}

# أحرف "غريبة" = ليست عربية/لاتينية/أرقام/ترقيم شائع/رموز رياضية شائعة
BAD = re.compile(
    r'[^\u0600-\u06FFa-zA-Z0-9\s\.,:;\(\)\[\]\+\-=\*/<>×÷±√∞≤≥≠\u060C\u061B\u061F\'"\u00b0\u00b2\u00b3]'
)

results = []
for k, v in ok.items():
    f = os.path.join(BASE, v['file'])
    if not os.path.exists(f):
        results.append((k, -1, -1, 100.0, 'MISSING FILE'))
        continue
    try:
        d = json.load(open(f, encoding='utf-8'))
    except Exception as e:
        results.append((k, -1, -1, 100.0, 'PARSE ERR'))
        continue
    blocks = d.get('blocks', [])
    txt = ' '.join(b.get('x', '') for b in blocks if b.get('t') != 'pg')
    total = len(txt)
    bad = len(BAD.findall(txt))
    ratio = 100.0 * bad / max(total, 1)
    # كلمات حقيقية
    words = len(re.findall(r'[\u0600-\u06FF]{2,}', txt))
    results.append((k, words, len(blocks), ratio, ''))

results.sort(key=lambda r: -r[3])
n = len(results)
worst = results[:15]
good = [r for r in results if r[3] < 2.0]
mid = [r for r in results if 2.0 <= r[3] < 8.0]
badly = [r for r in results if r[3] >= 8.0]
empty = [r for r in results if r[1] == 0]
missing = [r for r in results if r[4] == 'MISSING FILE']

print('total ok entries:', n)
print('missing files  :', len(missing))
print('empty content  :', len(empty))
print('good (<2%)     :', len(good))
print('mid  (2-8%)    :', len(mid))
print('bad  (>=8%)    :', len(badly))
print()
print('=== WORST 15 ===')
for k, w, b, r, note in worst:
    print(f'{r:6.1f}%  words={w:5d}  {k}  {note}')
