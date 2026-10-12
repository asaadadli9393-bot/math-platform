#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""دمج القصتين الجديدتين في anime-stories.ts + إزالة بطاقة التشويق المحققة"""
import re

P = "/home/z/my-project/src/data/anime-stories.ts"
frag = open("/home/z/my-project/assets/pro_v2/new_stories_fragment.ts", encoding="utf-8").read()
src = open(P, encoding="utf-8").read()

assert 'hilbert-hotel' not in src, "الدمج تم مسبقاً"
# 1) أدرج القصتين قبل إغلاق مصفوفة ANIME_STORIES (آخر  ];  قبل ANIME_TEASERS)
marker = "];\n\nexport const ANIME_TEASERS"
assert marker in src, "لم يُعثر على نهاية ANIME_STORIES"
src = src.replace(marker, frag.rstrip() + "\n];\n\nexport const ANIME_TEASERS", 1)

# 2) أزل بطاقة التشويق limits-castle (وعدُها أصبح حقيقياً)
teaser_pat = re.compile(
    r"\s*\{\s*id: 'limits-castle',.*?\},", re.S)
src, n = teaser_pat.subn("", src)
assert n == 1, f"بطاقة التشويق: عدد الإزالات {n}"

open(P, "w", encoding="utf-8").write(src)
print("patched ✓")
# تحقق سريع
s = open(P, encoding="utf-8").read()
for k in ("hilbert-hotel", "zero-story", "ep-hilbert.mp4", "ep-zero.mp4", "٤:١٧", "٢:٣١"):
    assert k in s, f"مفقود: {k}"
assert "limits-castle" not in s
print("verified ✓ — القصص:", s.count("id: '") - 3, "| teasers:", s.count("topic:"))
