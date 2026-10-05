# -*- coding: utf-8 -*-
"""
مقياس جودة دقيق لوثائق القراءة الذكية.
يرصد:
  - علامات الترقيم العربي المركّبة غير الطبيعية (أثر الخطوط المشفرة)
  - أشكال العرض المتبقية
  - عدد الكلمات العربية الحقيقية (حرفان متجاوران+)
ثم يصنّف كل وثيقة: good / mid / bad حسب نسبة الفساد.
"""
import json, os, re

BASE = '/home/z/my-project/public/formatted'

# علامات لا تظهر أبداً في نص عربي سليم مكتوب آلياً
GARBAGE = re.compile(
    '[\u0610-\u061A\u06D6-\u06ED\u06DC\u06DF-\u06E8\u06EA-\u06ED\u06FF'
    '\uFB50-\uFDFF\uFE70-\uFEFF\uFFF9-\uFFFD\uE000-\uF8FF]'
)
AR_WORD = re.compile(r'[\u0621-\u064A\u0671-\u06D3]{2,}')

idx = json.load(open(os.path.join(BASE, 'index.json'), encoding='utf-8'))
rows = []
for pdf_path, meta in idx.items():
    if not meta.get('ok'):
        continue
    f = os.path.join(BASE, meta['file'])
    if not os.path.exists(f):
        rows.append((pdf_path, 100.0, 0, 'MISSING'))
        continue
    d = json.load(open(f, encoding='utf-8'))
    txt = ' '.join(b.get('x', '') for b in d.get('blocks', []) if b.get('t') != 'pg')
    total = max(len(txt), 1)
    gar = len(GARBAGE.findall(txt))
    words = len(AR_WORD.findall(txt))
    ratio = 100.0 * gar / total
    rows.append((pdf_path, ratio, words, ''))

rows.sort(key=lambda r: -r[1])
bad = [r for r in rows if r[1] >= 4.0 or r[2] < 25]
mid = [r for r in rows if (1.0 <= r[1] < 4.0) and r[2] >= 25]
good = [r for r in rows if r[1] < 1.0 and r[2] >= 25]
gray = [r for r in rows if r[1] < 4.0 and r[2] < 25]

print(f'total: {len(rows)}')
print(f'good (فساد<1% و>=25 كلمة): {len(good)}')
print(f'mid  (فساد 1-4%): {len(mid)}')
print(f'gray (قليلة الكلمات): {len(gray)}')
print(f'bad  (فساد>=4% أو كلمات<25): {len(bad)}')
print()
print('=== الأسوأ 20 ===')
for p, r, w, note in rows[:20]:
    print(f'{r:6.1f}%  words={w:4d}  {p}  {note}')
print()
print('=== عينة من mid (لفحص بصري) ===')
for p, r, w, note in mid[:8]:
    print(f'{r:6.1f}%  words={w:4d}  {p}')
print()
print('=== gray ===')
for p, r, w, note in gray[:10]:
    print(f'{r:6.1f}%  words={w:4d}  {p}')

json.dump(
    {'bad': [p for p, _, _, _ in bad], 'mid': [p for p, _, _, _ in mid], 'gray': [p for p, _, _, _ in gray]},
    open('/home/z/my-project/scripts/quality_verdict.json', 'w', encoding='utf-8'),
    ensure_ascii=False, indent=1,
)
