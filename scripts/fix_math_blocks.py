#!/usr/bin/env python3
"""إصلاح العبارات الرياضية في public/formatted/*.json

المشكلة: خطوط Word الرياضية (SymbolMT وغيرها) تُشفّر رموزها في منطقة الاستخدام الخاص
(PUA U+F000-F8FF) وفي الرموز الحرفية الرياضية (U+1D400-1D7FF)، فيظهر في الكتل m:
  \uf02b بدل + ، \uf02d بدل − ، \uf070 بدل π ، ¥ بدل ∞ ، أرقام مزدوجة --1100 ...

الحل (تحقق تجريبي من سياق كل رمز في البيانات):
  1) جدول تحويل Symbol PUA → يونيكود رياضي حقيقي (لكل الكتل)
  2) الرموز الحرفية الرياضية 𝑥𝜋𝑓 → ASCII (لكل الكتل، عبر NFKC محصور بالنطاق)
  3) ¥ → ∞ ، є → ∈ ، \uf22d → ≠
  4) كتل m فقط: حذف شظايا الأقواس الكبيرة ⎛⎜⎝⎧⎨⎩ ، انهيار النص المضاعف،
     تنظيف أقواس فارغة متتالية ومسافات زائدة
"""
import json
import glob
import re
import unicodedata
import sys

# --- جدول Symbol PUA (متحقق منه من سياق البيانات + جدول Adobe Symbol القياسي) ---
SYM = {
    0xF021: '∀', 0xF022: '∃', 0xF024: '≅', 0xF025: '≈', 0xF026: '≠',
    0xF028: '(', 0xF029: ')', 0xF02B: '+', 0xF02C: ',', 0xF02D: '−', 0xF02E: '.', 0xF02F: '/',
    0xF03A: ':', 0xF03B: ';', 0xF03C: '<', 0xF03D: '=', 0xF03E: '>',
    0xF044: 'Δ', 0xF046: 'Φ', 0xF047: 'Γ', 0xF04C: 'Λ', 0xF050: 'Π', 0xF051: 'Θ',
    0xF053: 'Σ', 0xF057: 'Ω', 0xF058: 'Ξ', 0xF059: 'Ψ',
    0xF05B: '[', 0xF05D: ']',
    0xF061: 'α', 0xF062: 'β', 0xF063: 'χ', 0xF064: 'δ', 0xF065: 'ε', 0xF066: 'φ',
    0xF067: 'γ', 0xF068: 'η', 0xF069: 'ι', 0xF06A: 'ϕ', 0xF06B: 'κ', 0xF06C: 'λ',
    0xF06D: 'μ', 0xF06E: 'ν', 0xF070: 'π', 0xF071: 'θ', 0xF072: 'ρ', 0xF073: 'σ',
    0xF074: 'τ', 0xF075: 'υ', 0xF076: 'ϖ', 0xF077: 'ω', 0xF078: 'ξ', 0xF079: 'ψ', 0xF07A: 'ζ',
    0xF07B: '{', 0xF07D: '}',
    0xF0A2: '′', 0xF0A3: '≤', 0xF0A4: '/', 0xF0A5: '∞', 0xF0A6: 'f',
    0xF0AB: '↔', 0xF0AC: '←', 0xF0AD: '↑', 0xF0AE: '→', 0xF0AF: '↓',
    0xF0B0: '°', 0xF0B1: '±', 0xF0B2: '″', 0xF0B3: '≥', 0xF0B4: '×', 0xF0B5: '∝',
    0xF0B6: '∂', 0xF0B7: '·', 0xF0B8: '÷', 0xF0B9: '≠', 0xF0BA: '≡', 0xF0BB: '≈',
    0xF0BC: '…', 0xF0BD: '|',
    0xF0C1: 'ℑ', 0xF0C2: 'ℜ', 0xF0C4: '⊗', 0xF0C5: '⊕', 0xF0C6: '∅', 0xF0C7: '∩', 0xF0C8: '∇',
    0xF0CE: '∈', 0xF0D5: '∏', 0xF0D6: '√', 0xF0E5: '∑', 0xF0F2: '∫',
}

# شظايا الأقواس الكبيرة (قطع مصفوفات/أنظمة متعددة الأسطر) — ضجيج في التدفق الخطي
BRACKET_PIECES = set(range(0xF0E6, 0xF0F2)) | set(range(0xF0F6, 0xF0FC)) | {0xF0F3, 0xF0F4, 0xF0F5}

SYM_MAP = {chr(k): v for k, v in SYM.items()}
STRIP_MAP = {chr(k): '' for k in BRACKET_PIECES}
EXTRA = {'¥': '∞', 'є': '∈', '\uf22d': '≠'}

FULL_MAP = {**SYM_MAP, **STRIP_MAP, **EXTRA, '∘': '°'}


def raise_powers(s: str) -> str:
    """الأسس المفقودة من استخراج PDF: ‹x2› تعني x² — نرفع الرقمين 2 و3 بعد متغير.
    lookbehind يمنع إصابة أسماء الدوال (sin2x → n2 داخل sin محمي)."""
    if not re.search(r'[a-zA-Z][23](?![\d.])', s):
        return s
    return re.sub(r'(?<![a-zA-Z])([a-zA-Z])([23])(?![\d.])', r'\1^{\2}', s)


def map_math_alphanum(s: str) -> str:
    """𝑥→x ، 𝜋→π ، 𝟐→2 — فقط نطاق الرموز الحرفية الرياضية (لا نلمس ² ³)."""
    out = []
    for ch in s:
        o = ord(ch)
        if 0x1D400 <= o <= 0x1D7FF:
            n = unicodedata.normalize('NFKC', ch)
            out.append(n)
        else:
            out.append(ch)
    return ''.join(out)


def map_symbols(s: str) -> str:
    if not any(c in FULL_MAP or 0x1D400 <= ord(c) <= 0x1D7FF for c in s):
        return s
    s = map_math_alphanum(s)
    return ''.join(FULL_MAP.get(c, c) for c in s)


def collapse_doubled(s: str) -> str:
    """--1100 --99 → -10 -9  (نص ظل مزدوج). يُطبق فقط إذا كانت نسبة التضاعف عالية."""
    if len(s) < 6:
        return s
    pairs = sum(1 for i in range(0, len(s) - 1, 2) if s[i] == s[i + 1])
    total = len(range(0, len(s) - 1, 2))
    if total and pairs / total > 0.5:
        return re.sub(r'(.)\1', r'\1', s)
    return s


def clean_scatter(s: str) -> str:
    """تنظيف حشو التشتت: أقواس فارغة متتالية، مسافات زائدة."""
    s = re.sub(r'(?:\(\s*\)\s*){2,}', '', s)      # () () () → ''
    s = re.sub(r' {2,}', ' ', s)
    return s.strip()


def fix_m(x: str) -> str:
    x = map_symbols(x)
    x = collapse_doubled(x)
    x = clean_scatter(x)
    x = raise_powers(x)
    return x


def fix_general(x: str) -> str:
    return map_symbols(x).strip()


def main():
    files = [f for f in glob.glob('public/formatted/*.json') if 'index' not in f]
    files_changed = 0
    blocks_changed = 0
    chars_fixed = 0
    for f in files:
        with open(f, encoding='utf-8') as fh:
            doc = json.load(fh)
        changed = False
        for b in doc.get('blocks', []):
            old = b['x']
            new = fix_m(old) if b['t'] == 'm' else fix_general(old)
            if new != old:
                chars_fixed += sum(1 for a, c in zip(old, new) if a != c) + abs(len(old) - len(new))
                b['x'] = new
                blocks_changed += 1
                changed = True
        if changed:
            files_changed += 1
            with open(f, 'w', encoding='utf-8') as fh:
                json.dump(doc, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'files: {len(files)} | changed: {files_changed} | blocks fixed: {blocks_changed} | ~chars fixed: {chars_fixed}')

    # تقرير متبقي
    from collections import Counter
    remain = Counter()
    for f in files:
        with open(f, encoding='utf-8') as fh:
            doc = json.load(fh)
        for b in doc['blocks']:
            for ch in b['x']:
                o = ord(ch)
                if (0xE000 <= o <= 0xF8FF) or (0x1D400 <= o <= 0x1D7FF) or ch in '¥§є':
                    remain[ch] += 1
    print('remaining odd chars:', len(remain), '| top:', [(f'U+{ord(c):04X}', n) for c, n in remain.most_common(8)])


if __name__ == '__main__':
    main()
