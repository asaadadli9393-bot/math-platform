#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
delete_3as_memos2.py — المرحلة الثانية: حذف المذكرات البيداغوجية المتبقية (badge وثيقة لكن مضمونها مذكرة)
- lib-3as-exp-log-1/2/3/4 : مذكرات بيداغوجية (مذكرة رقم 01/02/04) بجودة OCR سيئة
- lib-3as-space-1/2       : وثيقتان ممسوحتان غير مقروئتين مصنّفتان مذكرة وملخص
- lib2-3as-func-deriv-10  : يُبقى (سلسلة القبة — تمارين) مع تصحيح وصفه وشاراته إلى سلسلة تمارين
"""
import re, os, json

ROOT = '/home/z/my-project'
LIB = os.path.join(ROOT, 'src/data/library-chains.ts')
IDX = os.path.join(ROOT, 'public/formatted/index.json')

DELETE = [
    'lib-3as-exp-log-1', 'lib-3as-exp-log-2', 'lib-3as-exp-log-3', 'lib-3as-exp-log-4',
    'lib-3as-space-1', 'lib-3as-space-2',
]

src = open(LIB, encoding='utf-8').read()
blocks = re.split(r'\n  \{\n', src)
kept, removed = [], []
for b in blocks:
    m = re.search(r"id: '([^']+)'", b)
    bid = m.group(1) if m else None
    if bid in DELETE:
        mf = re.search(r"file: '([^']+)'", b).group(1)
        removed.append((bid, mf))
    else:
        kept.append(b)

# إعادة تركيب الملف
head = blocks[0]
body = ''
for b in kept[1:-1]:
    body += '\n  {\n' + b
last = kept[-1]
em = re.search(r'\n  \},?\s*\n?];\s*$', last)
trailing = ''
if em:
    trailing = em.group(0); last = last[:em.start()]
body += '\n  {\n' + last + trailing
open(LIB, 'w', encoding='utf-8').write(head + body)
print(f'library-chains.ts: أُزيلت {len(removed)} مدخلة')

idx = json.load(open(IDX, encoding='utf-8'))
for bid, mf in removed:
    pdf = os.path.join(ROOT, 'public', mf.lstrip('/'))
    if os.path.exists(pdf):
        os.remove(pdf); print('حُذف PDF:', mf)
    jname = idx.get(mf, {}).get('file') or mf.lstrip('/').replace('/', '_').replace('.pdf', '_pdf') + '.json'
    jpath = os.path.join(ROOT, 'public/formatted', jname)
    if os.path.exists(jpath):
        os.remove(jpath); print('حُذف JSON:', jname)
    idx.pop(mf, None)
json.dump(idx, open(IDX, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('index.json →', len(idx), 'مدخلة')

# تصحيح تصنيف Top Maths القبة: من مذكرة إلى سلسلة تمارين
s = open(LIB, encoding='utf-8').read()
s2 = s.replace(
    "id: 'lib2-3as-func-deriv-10',\n    title: 'Top Maths القبة — العدد 3',\n    description: 'مذكرة وملخص في محور المنصة — وثيقة PDF أصلية",
    "id: 'lib2-3as-func-deriv-10',\n    title: 'Top Maths القبة — العدد 3',\n    description: 'سلسلة تمارين في محور الاشتقاقية (السنة الثالثة ثانوي) — وثيقة PDF أصلية"
).replace(
    "badge: 'وثيقة',\n    group: 'library',\n    source: 'من مكتبة الأستاذ عدلي اسعد',\n  },\n  {\n    id: 'lib2-3as-func-deriv-11'",
    "badge: 'سلسلة تمارين',\n    group: 'library',\n    source: 'من مكتبة الأستاذ عدلي اسعد',\n  },\n  {\n    id: 'lib2-3as-func-deriv-11'"
)
open(LIB, 'w', encoding='utf-8').write(s2)
print('تصحيح تصنيف Top Maths:', 'تم' if s2 != s else 'لم يتغير — تحقق يدوياً')
