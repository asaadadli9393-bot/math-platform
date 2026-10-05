# -*- coding: utf-8 -*-
"""قفل سلاسل 1AS/2AS: DZEXAMS (20 سلسلة PDF) + سلسلتا interactive."""
import io, re

# ---------- 1) chain-pdfs.ts ----------
P = '/home/z/my-project/src/data/chain-pdfs.ts'
s = io.open(P, encoding='utf-8').read()

marker = 'export const DZEXAMS_CHAINS'
i = s.index(marker)
head, tail = s[:i], s[i:]

n = tail.count('premium: false,')
tail = tail.replace('premium: false,', 'premium: true,')
head = head.replace(
    '/** سلاسل تمارين السنة الأولى والثانية ثانوي — PDF مستضافة على المنصة مع الحلول النموذجية (مجانية) */',
    '/** سلاسل تمارين السنة الأولى والثانية ثانوي — PDF مستضافة مع الحلول النموذجية (محتوى مميز مقفل) */',
)
io.open(P, 'w', encoding='utf-8').write(head + tail)
print(f'chain-pdfs: locked {n} chains')

# ---------- 2) interactive-chains.ts ----------
P2 = '/home/z/my-project/src/data/interactive-chains.ts'
s2 = io.open(P2, encoding='utf-8').read()
locked = 0
for cid in ("'chain-c2-deriv-1'", "'chain-c1-func-1'"):
    j = s2.index(f'id: {cid}')
    k = s2.index('premium: false,', j)
    s2 = s2[:k] + 'premium: true ,'[0:14].replace(' ', '') + s2[k + len('premium: false,'):]
    locked += 1
io.open(P2, 'w', encoding='utf-8').write(s2)
print(f'interactive-chains: locked {locked} chains')
