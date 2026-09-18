#!/usr/bin/env python3
"""Fix wrongly-escaped apostrophes inside single-quoted TS strings: \\ \\' -> \\'
(e.g. $M\\'$ breaks the string; we want $M\\'$ i.e. escaped quote)."""
import re
import glob

changed = []
for path in glob.glob('/home/z/my-project/src/data/*.ts'):
    with open(path, encoding='utf-8') as f:
        src = f.read()
    fixed = src.replace("\\\\'", "\\'")
    if fixed != src:
        n = src.count("\\\\'")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(fixed)
        changed.append((path, n))

for p, n in changed:
    print(f"fixed {n} occurrences in {p}")
if not changed:
    print("nothing to fix")
