# -*- coding: utf-8 -*-
"""تحويل جداول \\begin{array} في exercises-h.ts إلى \\begin{vt} الجديدة"""
import re
import pathlib

P = pathlib.Path('/home/z/my-project/src/data/exercises-h.ts')
s = P.read_text(encoding='utf-8')

# كل كتلة $$\begin{array}...\end{array}$$ (الملف يحوي \\ حرفياً في نصوص TS)
pat = re.compile(r'\$\$\\\\begin\{array\}[\s\S]*?\\\\end\{array\}\$\$')
blocks = pat.findall(s)
print('found', len(blocks), 'array blocks')

VT = [
    # 1) f نصف ناظمية: قضيب عند x=1
    r"$$\\begin{vt}\nx: -\\infty ; -1 ; 1 ; 3 ; +\\infty\nf'(x): ; + ; 0 ; - ; ‖ ; - ; 0 ; + ;\nf(x): -\\infty ; ↗ ; -4 ; ↘ ; ‖ ; ↘ ; 4 ; ↗ ; +\\infty\n\\end{vt}$$",
    # 2) V(x) صندوق: قضبان عند 0 و6
    r"$$\\begin{vt}\nx: 0 ; 2 ; 6\nV'(x): ‖ ; + ; 0 ; - ; ‖\nV(x): 0 ; ↗ ; 128 ; ↘ ; 0\n\\end{vt}$$",
    # 3) ln(x)/x: قضيب عند 0
    r"$$\\begin{vt}\nx: 0 ; \\mathrm{e} ; +\\infty\nf'(x): ‖ ; + ; 0 ; - ;\nf(x): -\\infty ; ↗ ; \\dfrac{1}{\\mathrm{e}} ; ↘ ; 0\n\\end{vt}$$",
    # 4) جدول f' (بيان)
    r"$$\\begin{vt}\nx: -\\infty ; -1 ; 2 ; +\\infty\nf'(x): ; - ; 0 ; + ; 0 ; - ;\n\\end{vt}$$",
    # 5) جدول f'' (بيان)
    r"$$\\begin{vt}\nx: -\\infty ; 0 ; +\\infty\nf''(x): ; - ; 0 ; + ;\n\\end{vt}$$",
    # 6) حل التمرين: f' ثم f
    r"$$\\begin{vt}\nx: -\\infty ; -1 ; 2 ; +\\infty\nf'(x): ; - ; 0 ; + ; 0 ; - ;\nf(x): 0 ; ↘ ; -2 ; ↗ ; 3 ; ↘ ; 1\n\\end{vt}$$",
]

assert len(blocks) == len(VT), f'{len(blocks)} != {len(VT)}'
for old, new in zip(blocks, VT):
    s = s.replace(old, new, 1)

P.write_text(s, encoding='utf-8')
print('done. remaining array blocks:', len(pat.findall(s)))
print('vt blocks now:', s.count('\\\\begin{vt}'))
