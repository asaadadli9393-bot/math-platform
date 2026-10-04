#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
delete_3as_memos.py — حذف جميع «مذكرات الأستاذ عدلي اسعد» من أيقونة سلاسل الثالثة ثانوي
1) يزيل مدخلات year='3as' + badge='مذكرة وملخص' من src/data/library-chains.ts
2) يحذف ملفات PDF من public/chains/library/
3) يحذف JSON المصيّر من public/formatted/ ويُنظّف index.json
"""
import re, os, json, sys

ROOT = '/home/z/my-project'
LIB = os.path.join(ROOT, 'src/data/library-chains.ts')
IDX = os.path.join(ROOT, 'public/formatted/index.json')

src = open(LIB, encoding='utf-8').read()

# --- 1) استخراج مدخلات 3as ذات badge مذكرة وملخص ---
blocks = re.split(r'\n  \{\n', src)
removed, kept = [], []
for b in blocks[1:]:
    if "year: '3as'" in b and "badge: 'مذكرة وملخص'" in b:
        mid = re.search(r"id: '([^']+)'", b).group(1)
        mfile = re.search(r"file: '([^']+)'", b).group(1)
        removed.append((mid, mfile))
    else:
        kept.append(b)

if not removed:
    print('لا يوجد ما يُحذف — ربما حُذف مسبقاً'); sys.exit(0)

# إعادة تركيب الملف: الرأس + الكتل المبقاة (آخر كتلة تنتهي بـ ];)
head = blocks[0]
# آخر كتلة محفوظة قد تنتهي بـ '\n  },\n];' أو مشابه — ننظف النهاية
tail_block = kept[-1]
end_match = re.search(r'\n  \},?\s*\n?];\s*$', tail_block)
trailing = ''
if end_match:
    trailing = end_match.group(0)
    tail_block = tail_block[:end_match.start()]

body = ''
for b in kept[:-1]:
    body += '\n  {\n' + b
body += '\n  {\n' + tail_block + trailing

# تحديث تعليق العدّ في الرأس
body = body.replace('66 وثيقة منتقاة', f'{len(kept)} وثيقة منتقاة')
new_src = head + body
open(LIB, 'w', encoding='utf-8').write(new_src)
print(f'library-chains.ts: أُزيلت {len(removed)} مدخلة — بقي {len(kept)} كتلة')

# --- 2) حذف PDF + JSON المصيّر ---
idx = json.load(open(IDX, encoding='utf-8'))
before = len(idx)
for mid, mf in removed:
    pdf = os.path.join(ROOT, 'public', mf.lstrip('/'))
    if os.path.exists(pdf):
        os.remove(pdf); print('حُذف PDF:', mf)
    else:
        print('PDF غير موجود (تجاهل):', mf)
    # JSON المصيّر: الاسم من حقل file في index.json (الأدق)، مع بديل اشتقاقي
    jname = idx.get(mf, {}).get('file') or mf.lstrip('/').replace('/', '_').replace('.pdf', '_pdf') + '.json'
    jpath = os.path.join(ROOT, 'public/formatted', jname)
    if os.path.exists(jpath):
        os.remove(jpath); print('حُذف JSON:', jname)
    else:
        print('JSON غير موجود (تجاهل):', jname)
    if mf in idx:
        del idx[mf]

json.dump(idx, open(IDX, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'index.json: {before} → {len(idx)} مدخلة')
print('تم — المذكرات المحذوفة:')
for mid, mf in removed:
    print('  -', mid)
