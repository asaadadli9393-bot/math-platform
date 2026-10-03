#!/usr/bin/env python3
"""
Extract content from every platform PDF and normalize it into the
platform's signature structured format (blocks JSON + index manifest).

Output:
  public/formatted/index.json     — manifest { pdfPath: {file, pages, words, verdict, headings} }
  public/formatted/<safe>.json    — { id, src, pages, blocks: [{t, x}] }
Block kinds: h=heading, p=paragraph, m=math, li=list-item, pg=page-break marker
"""
import json
import os
import re
import unicodedata
from collections import Counter

from bidi.algorithm import get_display

import pdfplumber

ROOT = '/home/z/my-project/public'
OUT = os.path.join(ROOT, 'formatted')
os.makedirs(OUT, exist_ok=True)

AR = '\u0600-\u06FF'
RE_AR = re.compile(f'[{AR}\uFB50-\uFDFF\uFE70-\uFEFF\u0750-\u077F]')
RE_PRES = re.compile(r'[\uFB50-\uFDFF\uFE70-\uFEFF]')
RE_SYM = re.compile(r'[\U0001F000-\U0001FAFF\u2600-\u27BF\u2B00-\u2BFF\uffff\uf0b7\uf06c\uf0d7\uf0a7]')
RE_DUP = re.compile(r'(.)\1+')
RE_LTR = re.compile(r'[A-Za-z0-9]')
RE_MATHSY = re.compile(r'[=+\-*/^(){}\[\]|<>∫∑√≤≥≠∈∀∞π±×÷]')

HEADING_START = (
    'التمرين', 'السؤال', 'الجزء', 'التطبيق', 'المثال', 'الخاصية', 'التعريف',
    'الملاحظة', 'خلاصة', 'أعتمد', 'اعتمد', 'الوضعية', 'النشطة', 'النشاط',
    'الخصائص', 'العنوان', 'الدالة', 'النتيجة', 'القاعدة', 'البرهان', 'الحل',
    'تذكير', 'تنبيه', 'تمرين', 'سؤال', 'معادلة', 'الفقرة', 'I', 'II', 'III', 'IV',
)
LIST_START = ('-', '•', '*', '–', '—', '·')


def safe_name(path: str) -> str:
    return re.sub(r'[^A-Za-z0-9-]+', '_', path.lower()).strip('_') + '.json'


def fix_visual_line(line: str) -> str:
    """Convert visual-order Arabic (presentation forms) to logical order
    via the bidi involution: visual text treated as logical LTR, then NFKC."""
    if not RE_AR.search(line):
        return line  # pure LTR math/latin: keep as extracted
    try:
        logical = get_display(line, base_dir='L')
    except Exception:
        logical = line
    logical = unicodedata.normalize('NFKC', logical)
    # lam-alef ligature decompose artifacts from quirky fonts
    for a, b in (('األأ', 'الأ'), ('اإلإ', 'الإ'), ('اآلآ', 'الآ'),
                 ('األ', 'الأ'), ('اإل', 'الإ'), ('اآل', 'الآ')):
        logical = logical.replace(a, b)
    # leading orphan punctuation (bidi artifact) -> move to end
    m = re.match(r'^([:\u060C\u061B.,;\-]+)\s*(.+)$', logical)
    if m and RE_AR.search(m.group(2)):
        logical = m.group(2).rstrip() + ' ' + m.group(1)
    return logical


def collapse_doubles(line: str) -> str:
    """Collapse systematic char doubling (double-layered PDF text)."""
    dups = len(RE_DUP.findall(line))
    if dups < 2:
        return line
    letters = len(RE_AR.findall(line))
    if letters and dups / max(letters, 1) > 0.25:
        line = RE_DUP.sub(r'\1', line)
    return line


def clean_line(line: str) -> str:
    line = line.replace('\ufffd', '').replace('\x00', '')
    line = re.sub(r'(cid:\d+)', '', line)
    line = RE_SYM.sub(' ', line)
    line = re.sub(r'[ \t]+', ' ', line).strip()
    # drop junk: only punctuation/brackets, no letters or digits
    if line and not RE_AR.search(line) and not RE_LTR.search(line):
        return ''
    return line


def classify(line: str, ar: float, ltr_math: float) -> str:
    if ltr_math > 0.55 and ar == 0:
        return 'm'
    if line.startswith(LIST_START):
        return 'li'
    if re.match(r'^\d+[.)\]]\s', line) or re.match(r'^[٠-٩]+[.)\]]\s', line):
        return 'li'
    low = line.strip()
    if len(low) <= 70 and any(low.startswith(h) or low.startswith('ال' + h) for h in HEADING_START):
        return 'h'
    if len(low) <= 40 and low.endswith(':') and ar > 0:
        return 'h'
    return 'p'


def post_process(blocks):
    """Merge line fragments into flowing blocks; drop junk."""
    out = []
    for b in blocks:
        x = b['x'].strip()
        if not x:
            continue
        # digit<->arabic spacing cleanup
        x = re.sub(r'(\d)([\u0600-\u06FF])', r'\1 \2', x)
        x = re.sub(r'([\u0600-\u06FF])(\d)', r'\1 \2', x)
        # junk: no letters/digits at all, or tiny math fragments like "()", "p"
        core = re.sub(r'[\s()\[\]{}:.,،؛\-–—|]+', '', x)
        if len(core) < 2:
            continue
        if b['t'] == 'm' and not re.search(r'[A-Za-z0-9\u0600-\u06FF]{2,}', x):
            continue
        prev = out[-1] if out else None
        if prev and prev['t'] == b['t'] and b['t'] in ('p', 'm'):
            # merge continuation lines of same paragraph/formula
            joiner = '' if x.startswith(('.', '،', ':')) else ' '
            prev['x'] = prev['x'].rstrip() + joiner + x
        else:
            out.append({'t': b['t'], 'x': x})
    return out


def extract_pdf(rel: str):
    path = os.path.join(ROOT, rel)
    try:
        with pdfplumber.open(path) as pdf:
            n = len(pdf.pages)
            pages_lines = []
            for pg in pdf.pages:
                txt = pg.extract_text(dedupe_chars=True) or ''
                lines = [clean_line(l) for l in txt.split('\n')]
                lines = [l for l in lines if l]
                pages_lines.append(lines)
    except Exception as e:
        return None, {'error': str(e)[:100]}

    if not pages_lines or sum(len(p) for p in pages_lines) < 3:
        return None, {'verdict': 'empty'}

    # normalize BEFORE header detection
    pages_lines = [[collapse_doubles(fix_visual_line(l)) if RE_AR.search(l) else l for l in lines]
                   for lines in pages_lines]

    # header/footer detection: repeated first/last lines across pages
    edges = Counter()
    for lines in pages_lines:
        for l in (lines[:2] + lines[-2:] if len(lines) > 4 else lines):
            key = re.sub(r'\d+', '#', l)[:40]
            if len(key) > 8:
                edges[key] += 1
    repeated = {k for k, v in edges.items() if v >= max(3, len(pages_lines) * 0.5)}

    blocks = []
    words = 0
    headings = []
    ar_total = 0
    char_total = 0
    for pi, lines in enumerate(pages_lines, 1):
        blocks.append({'t': 'pg', 'x': str(pi)})
        for line in lines:
            if re.sub(r'\d+', '#', line)[:40] in repeated and len(line) < 90:
                continue
            if re.fullmatch(r'[\d\s]+', line):
                continue  # page numbers
            ar = len(RE_AR.findall(line))
            ltr = len(RE_LTR.findall(line))
            mys = len(RE_MATHSY.findall(line))
            total = max(len(line), 1)
            ltr_math = (ltr + mys) / total
            ar2 = len(RE_AR.findall(line))
            ar_total += ar2
            char_total += len(line)
            words += len(line.split())
            kind = classify(line, ar2 / total, ltr_math)
            if kind == 'h' and len(headings) < 12:
                headings.append(line[:60])
            blocks.append({'t': kind, 'x': line})

    verdict = 'ok'
    # quality gate: cipher-garbage fonts (no real Arabic content)
    if char_total < 120 or ar_total / max(char_total, 1) < 0.08:
        return None, {'verdict': 'garbage'}
    blocks = post_process(blocks)
    # page markers add noise in short docs
    if n <= 3:
        blocks = [b for b in blocks if b['t'] != 'pg']
    return {'id': safe_name(rel), 'src': rel, 'pages': n, 'blocks': blocks}, {
        'verdict': verdict, 'pages': n, 'words': words, 'headings': headings,
    }


def main():
    index = {}
    stats = Counter()
    for dirpath, _, files in os.walk(ROOT):
        if '/formatted' in dirpath:
            continue
        for fn in sorted(files):
            if not fn.lower().endswith('.pdf'):
                continue
            rel = os.path.relpath(os.path.join(dirpath, fn), ROOT)
            data, meta = extract_pdf(rel)
            if data is None:
                index['/' + rel] = {'ok': False, **meta}
                stats[meta.get('verdict', 'error')] += 1
                continue
            fname = safe_name(rel)
            with open(os.path.join(OUT, fname), 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
            entry = {'ok': True, 'file': fname, 'pages': meta['pages'],
                     'words': meta['words'], 'headings': meta['headings'][:8]}
            index['/' + rel] = entry
            stats['extracted'] += 1
    with open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',', ':'))
    print('stats:', dict(stats))
    print('index size:', os.path.getsize(os.path.join(OUT, 'index.json')) // 1024, 'KB')


if __name__ == '__main__':
    main()
