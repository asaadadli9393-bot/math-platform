'use client';

import React from 'react';
import katex from 'katex';
import { texPrep } from '@/lib/vt';

/* ============================================================
   عرض الرياضيات داخل القارئ الذكي:
   - تنظيف نص PDF المستخرج (شوائب Beamer، رموز مشوّهة)
   - تقسيم الأسطر المختلطة إلى أجزاء عربية وأجزاء رياضية
   - تصيير الأجزاء الرياضية عبر KaTeX بأسلوب رشيق مدمج
   ============================================================ */

export const AR_RE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/** تنظيف عام لنص مستخرج من PDF قبل العرض أو الكشف */
export function cleanDocText(s: string): string {
  return s
    .replace(/[A-Za-z]+!\d+/g, ' ') // ألوان Beamer المتسربة: mainDark!15، x!0…
    .replace(/[\u0338]=/g, '≠') // ̸= مشوّهة
    .replace(/=[\u0338]/g, '≠')
    .replace(/[\u0338]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ ?\n ?/g, '\n');
}

/** هل النص ذو طابع رياضي (بلا عربية) ويستحق تصييراً بـ KaTeX؟ */
export function isMathish(s: string): boolean {
  const t = s.trim();
  if (!t || AR_RE.test(t)) return false;
  if (t.length > 120) return false;
  if (/[=≈≠≤≥±×÷→↔∞√∈∉∩∪⊂∫∑π′°²³∥·−]/.test(t)) return true;
  if (/\d/.test(t) && /[a-zA-Z]/.test(t)) return true; // e2، x2، f(a)
  if (/[a-zA-Z]\s*[()]/.test(t)) return true; // f(x)
  if (/[+\-−*/^]/.test(t) && /\d/.test(t)) return true; // 2+3
  return false;
}

/** سطر كامل رياضي؟ */
export function isMathLine(text: string): boolean {
  return isMathish(text);
}

/** تقسيم سطر مختلط إلى أجزاء: عربية (ar=true) / محايدة (null) / لاتينية-رياضية (false) */
export function segmentLine(s: string): { ar: boolean | null; s: string }[] {
  const runs: { ar: boolean | null; s: string }[] = [];
  const isArChar = (ch: string) => AR_RE.test(ch) || '،؛؟۔ ـ'.includes(ch);
  const isNeutral = (ch: string) => /[\s\d.,:;()\-–—%/°'"«»\[\]]/.test(ch);
  let cur = '';
  let curAr: boolean | null = null;
  for (const ch of s) {
    let ar: boolean | null;
    if (isArChar(ch)) ar = true;
    else if (isNeutral(ch)) ar = curAr;
    else ar = false;
    if (curAr === null) curAr = ar;
    if (ar !== curAr) {
      runs.push({ ar: curAr, s: cur });
      cur = ch;
      curAr = ar;
    } else {
      cur += ch;
    }
  }
  if (cur) runs.push({ ar: curAr, s: cur });
  return runs;
}

/** HTML جاهز لسطر رياضي واحد عبر KaTeX */
function katexHtml(tex: string, display: boolean): string {
  try {
    return katex.renderToString(texPrep(tex), {
      displayMode: display,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
  } catch {
    return '';
  }
}

/** سطر رياضي واحد (KaTeX display مُوسَّط) */
export function MathLine({ tex }: { tex: string }) {
  const html = React.useMemo(() => katexHtml(tex, true), [tex]);
  return (
    <div className="my-1 text-center leading-normal" dir="ltr">
      <span dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/**
 * مجموعة أسطر رياضية متتالية — تُعرض داخل صندوق رشيق فاتح
 * بحدود زمردية خفيفة، كل سطر مُوسَّط وقابل للتمرير أفقياً عند الضيق.
 */
export function MathLineGroup({ lines }: { lines: string[] }) {
  const solo = lines.length === 1 && lines[0].length <= 44;
  return (
    <div
      dir="ltr"
      className={`overflow-x-auto rounded-xl border border-emerald-100/90 bg-gradient-to-b from-emerald-50/80 to-white px-4 py-1.5 shadow-[0_1px_3px_rgba(6,78,59,0.05)] ${
        solo ? 'mx-auto w-fit max-w-full' : ''
      }`}
    >
      {lines.map((ln, i) => (
        <MathLine key={i} tex={ln} />
      ))}
    </div>
  );
}

/**
 * سطر مختلط (عربية + رياضيات): يُقسَّم تلقائياً و تُصيَّر الأجزاء
 * الرياضية بـ KaTeXinline والأجزاء العربية بنص المنصة.
 */
export function AutoText({ text, className = '' }: { text: string; className?: string }) {
  const runs = React.useMemo(() => segmentLine(text), [text]);
  return (
    <span className={className} dir="rtl">
      {runs.map((r, i) => {
        if (r.ar === false && isMathish(r.s)) {
          const html = katexHtml(r.s.trim(), false);
          if (html) {
            return (
              <span
                key={i}
                dir="ltr"
                className="mx-0.5 inline-block align-middle"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }
        }
        return <React.Fragment key={i}>{r.s}</React.Fragment>;
      })}
    </span>
  );
}
