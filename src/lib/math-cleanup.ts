/**
 * تحويل النص الرياضي المستخرج من PDF (يونيكود) إلى LaTeX يفهمه KaTeX
 * يُستعمل في القارئ الذكي وMathText لعرض الرياضيات بشكل حقيقي
 */

const GREEK_MAP: Record<string, string> = {
  'α': '\\alpha ', 'β': '\\beta ', 'γ': '\\gamma ', 'δ': '\\delta ', 'ε': '\\varepsilon ',
  'ζ': '\\zeta ', 'η': '\\eta ', 'θ': '\\theta ', 'ι': '\\iota ', 'κ': '\\kappa ',
  'λ': '\\lambda ', 'μ': '\\mu ', 'ν': '\\nu ', 'ξ': '\\xi ', 'π': '\\pi ', 'ρ': '\\rho ',
  'σ': '\\sigma ', 'τ': '\\tau ', 'υ': '\\upsilon ', 'φ': '\\phi ', 'ϕ': '\\varphi ',
  'χ': '\\chi ', 'ψ': '\\psi ', 'ω': '\\omega ', 'ϖ': '\\varpi ',
  'Γ': '\\Gamma ', 'Δ': '\\Delta ', 'Θ': '\\Theta ', 'Λ': '\\Lambda ', 'Ξ': '\\Xi ',
  'Π': '\\Pi ', 'Σ': '\\Sigma ', 'Φ': '\\Phi ', 'Ψ': '\\Psi ', 'Ω': '\\Omega ',
};

const SYMBOL_MAP: Record<string, string> = {
  '∞': '\\infty ', '∈': '\\in ', '∉': '\\notin ', '∋': '\\ni ',
  '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '≈': '\\approx ', '≡': '\\equiv ', '≅': '\\cong ',
  '→': '\\to ', '←': '\\leftarrow ', '↔': '\\leftrightarrow ',
  '↑': '\\uparrow ', '↓': '\\downarrow ', '⇒': '\\implies ', '⇔': '\\iff ',
  '∪': '\\cup ', '∩': '\\cap ', '⊂': '\\subset ', '⊃': '\\supset ',
  '⊆': '\\subseteq ', '⊇': '\\supseteq ',
  '∅': '\\emptyset ', '∇': '\\nabla ', '∂': '\\partial ', '∝': '\\propto ',
  '±': '\\pm ', '∓': '\\mp ', '×': '\\times ', '÷': '\\div ', '⋅': '\\cdot ', '·': '\\cdot ',
  '∑': '\\sum ', '∏': '\\prod ', '∫': '\\int ', '∬': '\\iint ',
  'ℑ': '\\Im ', 'ℜ': '\\Re ', '⊗': '\\otimes ', '⊕': '\\oplus ',
  '∀': '\\forall ', '∃': '\\exists ',
  '′': "'", '″': "''",
  '…': '\\ldots ', '⋯': '\\cdots ',
  '−': '-', '⁄': '/', 'ƒ': 'f', '•': '\\cdot ', '‖': '\\|', '⊥': '\\perp ',
  '∥': '\\|', '⎯': '-', '‹': '<', '›': '>',
  '%': '\\%', '&': '\\&', '#': '\\#',
};

/** الرموز الزخرفية/الشوائب التي لا معنى لها في سطر رياضي (حروفاً كانت أم رموزاً) */
const STRIP_RE = /[«»"†‡]/g;

/** أسماء الدوال الملتصقة نتيجة فقدان المسافات في الاستخراج: 2lnx → 2 ln x */
const FN_SPLIT_A = /([0-9a-zA-Z])(lim|arctan|arcsin|arccos|exp|ln|sin|cos|tan|log)/g;
const FN_SPLIT_B = /(lim|arctan|arcsin|arccos|exp|ln|sin|cos|tan|log)(?=[a-zA-Z0-9])/g;

/** هل يحوي السطر حروفاً عربية؟ */
const AR_RE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * تحويل سطر رياضي إلى LaTeX.
 */
export function toTex(s: string): string {
  let out = s.replace(STRIP_RE, ' ');

  // √ يحتاج معالجة خاصة قبل الجدول العام
  out = out.replace(/√\s*\(([^()]+)\)/g, '\\sqrt{$1}');
  out = out.replace(/√\s*\[([^\[\]]+)\]/g, '\\sqrt{$1}');
  out = out.replace(/√\s*([a-zA-Z0-9]+)/g, '\\sqrt{$1}');
  out = out.replace(/√/g, '\\sqrt ');

  // فصل أسماء الدوال الملتصقة
  out = out.replace(FN_SPLIT_A, '$1 $2');
  out = out.replace(FN_SPLIT_B, '$1 ');

  // الدرجة بعد رقم مباشرة
  out = out.replace(/(\d)\s*°/g, '$1^{\\circ}');

  // الدالة الأسية الملتصقة: 2ex − 1 → 2e^{x} − 1 (حين لا تكون exp أو جزءاً من كلمة)
  out = out.replace(/(?<![a-zA-Z])ex(?=([^\^a-zA-Z0-9]|$))/g, 'e^{x}');

  let res = '';
  for (const ch of out) {
    if (GREEK_MAP[ch] !== undefined) res += GREEK_MAP[ch];
    else if (SYMBOL_MAP[ch] !== undefined) res += SYMBOL_MAP[ch];
    else res += ch;
  }
  return res.replace(/ {2,}/g, ' ').trim();
}

export type MathPart =
  | { kind: 'tex'; tex: string }
  | { kind: 'ar'; text: string };

/** تقسيم سطر مختلط (رياضيات + عربية) إلى مقاطع */
export function splitMixedLine(s: string): MathPart[] {
  const parts: MathPart[] = [];
  const re = /([\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) parts.push({ kind: 'tex', tex: toTex(s.slice(last, m.index)) });
    parts.push({ kind: 'ar', text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push({ kind: 'tex', tex: toTex(s.slice(last)) });
  return parts.filter((p) => p.kind === 'ar' || p.tex.length > 0);
}

export function hasArabic(s: string): boolean {
  return AR_RE.test(s);
}

/* ============================================================
   displaySafe — عرض نصي آمن لما فشل تصييره بـ KaTeX:
   تحويل الأسس والاندساسات المرفوعة في البيانات ^{2} / _{n}
   إلى محارف يونيكود ² ⁿ ₀ ⁿ حتى لا تظهر الأقواس خاماً
   ============================================================ */

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
  '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '−': '⁻',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
  t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
};

const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇',
  '8': '₈', '9': '₉', '+': '₊', '-': '₋', '−': '₋',
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ',
  o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
};

export function displaySafe(s: string): string {
  return s
    .replace(/\^\{([^{}]+)\}/g, (m, g: string) => {
      const chars = [...g];
      return chars.every((c) => SUP[c] !== undefined) ? chars.map((c) => SUP[c]).join('') : m;
    })
    .replace(/_\{([^{}]+)\}/g, (m, g: string) => {
      const chars = [...g];
      return chars.every((c) => SUB[c] !== undefined) ? chars.map((c) => SUB[c]).join('') : m;
    });
}

/* ============================================================
   كشف المقاطع الرياضية داخل النثر (كتل p/li بلا محددات $)
   ============================================================ */

/** علاقات وعمليات رياضية دالة: لا يُعتبر النص رياضية بدونها */
export const MATH_OP_RE = /[=<>\u2264\u2265\u2260\u00b1\u00d7\u00f7\u2192\u2190\u2191\u2193\u2208\u2209\u221e\u221a]/;

/** حروف مسموح لها أن تكون ضمن مقطع رياضي مرشّح */
const MATHY_CHAR_RE = /[0-9A-Za-z\u0370-\u03FF."'\u2032\u2019\-\u2212+*=<>\u2264\u2265\u2260\u00d7\u00f7\u00b1\u2192\u2190\u2191\u2193\u2208\u2209\u221e\u221a\u00b0(){}\[\]\/:;%^\u2026\s]/;

/** كلمات ربط نثرية (فرنسية/إنجليزية) تدل أن المقطع جملة لا معادلة */
const PROSE_WORD_RE = /\b(un|une|le|la|les|de|des|du|et|est|dans|pour|que|qui|avec|donc|sur|par|soit|calculer|montrer|d[ée]terminer|r[ée]soudre|v[ée]rifier|exprimer|[ée]tablir|the|and|where|then)\b/i;

/** هل المقطع جملة نثرية فرنسية/إنجليزية لا معادلة؟ */
export function wordyProse(s: string): boolean {
  return PROSE_WORD_RE.test(s);
}

export type ProsePart = { kind: 'math' | 'text'; s: string };

/**
 * تقسيم نص نثري إلى مقاطع رياضية (تحوي علاقات رياضية) ومقاطع نصية،
 * حتى تُعرض الرياضيات بـ KaTeX ويبقى النص كما هو دون انعكاس bidi.
 */
export function splitProseMath(text: string): ProsePart[] {
  if (!MATH_OP_RE.test(text) || !/[0-9A-Za-z]/.test(text)) {
    return [{ kind: 'text', s: text }];
  }
  const out: ProsePart[] = [];
  let buf = '';
  let mathBuf = '';
  const flushText = () => {
    if (buf) {
      out.push({ kind: 'text', s: buf });
      buf = '';
    }
  };
  const flushMath = () => {
    if (!mathBuf) return;
    const trimmed = mathBuf.trim();
    if (trimmed && MATH_OP_RE.test(trimmed) && /[0-9A-Za-z]/.test(trimmed) && !PROSE_WORD_RE.test(trimmed)) {
      out.push({ kind: 'math', s: mathBuf });
    } else {
      buf += mathBuf;
    }
    mathBuf = '';
  };
  for (const ch of text) {
    if (MATHY_CHAR_RE.test(ch)) {
      mathBuf += ch;
    } else {
      flushMath();
      buf += ch;
    }
  }
  flushMath();
  flushText();
  return out;
}
