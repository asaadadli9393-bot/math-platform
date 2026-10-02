#!/usr/bin/env python3
"""Scan all platform PDFs and score text-extraction quality."""
import json, os, re, sys
import pdfplumber

ROOT = '/home/z/my-project/public'

def norm_score(text: str):
    if not text:
        return 0.0, {'chars': 0, 'cid': 0, 'arabic': 0, 'presforms': 0}
    chars = len(text)
    cid = len(re.findall(r'\(cid:\d+\)', text))
    presforms = len(re.findall(r'[\uFB50-\uFDFF\uFE70-\uFEFF]', text))
    arabic = len(re.findall(r'[\u0600-\u06FF]', text))
    return arabic / max(chars, 1), {'chars': chars, 'cid': cid, 'arabic': arabic, 'presforms': presforms}

def main():
    results = []
    for dirpath, _, files in os.walk(ROOT):
        for fn in files:
            if not fn.lower().endswith('.pdf'):
                continue
            path = os.path.join(dirpath, fn)
            rel = os.path.relpath(path, ROOT)
            try:
                with pdfplumber.open(path) as pdf:
                    npages = len(pdf.pages)
                    sample = ''
                    for pg in pdf.pages[:3]:
                        sample += (pg.extract_text() or '') + '\n'
            except Exception as e:
                results.append({'file': rel, 'error': str(e)[:80]})
                continue
            ratio, stats = norm_score(sample)
            cid_ratio = stats['cid'] / max(stats['chars'], 1)
            # verdict
            if stats['chars'] < 120:
                verdict = 'empty'          # scanned / image-only
            elif cid_ratio > 0.12:
                verdict = 'cid-garbage'    # no ToUnicode
            elif stats['presforms'] > stats['arabic']:
                verdict = 'visual-order'   # reversed presentation forms
            elif ratio > 0.18:
                verdict = 'clean'          # logical-order extractable
            else:
                verdict = 'sparse'
            results.append({'file': rel, 'pages': npages, 'verdict': verdict, **stats})

    with open('/home/z/my-project/scripts/pdf-quality.json', 'w') as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    # summary
    from collections import Counter
    c = Counter(r.get('verdict', 'error') for r in results)
    print(json.dumps(c, indent=1))
    for v in ['clean', 'sparse', 'visual-order', 'cid-garbage', 'empty', 'error']:
        files = [r['file'] for r in results if r.get('verdict') == v]
        print(f"\n--- {v} ({len(files)}) ---")
        for x in files[:12]:
            print('  ', x)

if __name__ == '__main__':
    main()
