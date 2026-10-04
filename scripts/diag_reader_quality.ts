/**
 * diag_reader_quality.ts — تشخيص عميق لجودة الصيغ في القارئ الذكي
 * يحاكي أنبوب doc-reader حرفياً: cleanDocText → أسطر → isMathLine/segmentLine
 * → toTex → texPrep → katex — ويبلّغ عن كل ما يظل غير مفهوم.
 *
 * تشغيل: bun scripts/diag_reader_quality.ts [prefix ...]
 */
import katex from 'katex';
import * as fs from 'fs';
import * as path from 'path';
import { cleanDocText, isMathLine, isMathish, segmentLine, AR_RE, isCipherLine } from '../src/lib/reader-math';
import { toTex, wordyProse, displaySafe } from '../src/lib/math-cleanup';
import { texPrep } from '../src/lib/vt';

const FORMATTED = path.join(__dirname, '..', 'public', 'formatted');

// كتم تحذيرات KaTeX الضجيجية أثناء التشخيص
const origWarn = console.warn, origError = console.error, origLog = console.log;
console.warn = () => {}; console.error = () => {};

function render(tex: string, display: boolean): { ok: boolean; err?: string } {
  if (wordyProse(tex)) return { ok: false, err: 'wordy' };
  try {
    const html = katex.renderToString(texPrep(toTex(tex)), {
      displayMode: display, throwOnError: false, strict: false, output: 'htmlAndMathml',
    });
    if (html.includes('katex-error') || html.includes('color:red') || html.includes('#cc0000'))
      return { ok: false, err: 'katex-error-span' };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, err: String(e).slice(0, 120) };
  }
}

/** أنماط الشوائب التي تجعل السطر غير مفهوم */
const NOISE = [
  /\(\)\(\)/,            // أقواس فارغة متضاعفة
  /\(\)\s*\(\)/,
  /[\uE000-\uF8FF]/,     // Symbol-PUA متبقٍ
  /\w+!\d+/,             // beamer
  /[\uFFFD]/,            // replacement char
  /\b(خ|ن|م|ه)(\1){3,}\b/,
];

function noiseOf(s: string): string | null {
  for (const n of NOISE) if (n.test(s)) return String(n);
  return null;
}

const prefixes = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['chains_library_lib-3as', 'chains_library_lib2-3as', 'devoirs_3as_d-3as-0', 'chains_suite2027', 'chains_limit_pdf'];

const files = fs.readdirSync(FORMATTED).filter((f) => f.endsWith('.json') && f !== 'index.json' && prefixes.some((p) => f.startsWith(p.replace(/\//g, '_'))));

let totMath = 0, okMath = 0, totProse = 0, garbledProse = 0, failedMath = 0, noiseLines = 0, cipherMath = 0;
const failSamples: { doc: string; line: string; err: string }[] = [];
const garbledSamples: { doc: string; line: string }[] = [];
const oddTexSamples: { doc: string; line: string; tex: string }[] = [];

for (const f of files.sort()) {
  const doc = JSON.parse(fs.readFileSync(path.join(FORMATTED, f), 'utf8')) as {
    blocks: { t: string; x: string }[];
  };
  const lines: { t: string; x: string }[] = [];
  for (const b of doc.blocks) {
    if (b.t === 'pg') continue;
    for (const raw of cleanDocText(b.x).split('\n')) {
      const t = raw.trim();
      if (t) lines.push({ t: b.t, x: t });
    }
  }
  for (const ln of lines) {
    const n = noiseOf(ln.x);
    if (n) { noiseLines++; if (garbledSamples.length < 25) garbledSamples.push({ doc: f, line: ln.x.slice(0, 110) }); }
    if (isCipherLine(ln.x)) { cipherMath++; continue; } // في القارئ: شارة أنيقة بدل الرموز
    if (ln.t === 'm' || isMathLine(ln.x)) {
      totMath++;
      const r = render(ln.x, true);
      if (r.ok) okMath++;
      else {
        failedMath++;
        if (failSamples.length < 30) failSamples.push({ doc: f, line: ln.x.slice(0, 110), err: r.err || '?' });
      }
      // صيغة رياضية لكن toTex لم يغيّر شيئاً وهي تحتوي رموزاً يونيكودية — قد تُعرض كما هي
      const tt = toTex(ln.x);
      if (/[\u0370-\u03FF↦→∈∉∞√∑∫≈≠≤≥±×÷]/.test(tt) && tt === ln.x && oddTexSamples.length < 20)
        oddTexSamples.push({ doc: f, line: ln.x.slice(0, 90), tex: tt.slice(0, 90) });
    } else {
      totProse++;
      // سطر نثري: هل يبقى فيه رياضيات مبعثرة بعد التقسيم؟
      const runs = segmentLine(ln.x);
      for (const r of runs) {
        if (r.ar === false && isMathish(r.s)) {
          const rr = render(r.s.trim(), false);
          if (!rr.ok) { garbledProse++; break; }
        }
      }
    }
  }
}

console.log('═══ ملخص التشخيص ═══');
console.warn = origWarn; console.error = origError;
console.log(`وثائق: ${files.length}`);
console.log(`أسطر رياضية: ${totMath} — تُصيَّر بنجاح: ${okMath} (${((okMath / Math.max(1, totMath)) * 100).toFixed(1)}%) — فاشلة: ${failedMath} — مشفّرة (شارة): ${cipherMath}`);
console.log(`أسطر نثرية: ${totProse} — فيها مقاطع رياضية فاشلة: ${garbledProse}`);
console.log(`أسطر فيها شوائب ()()/PUA/beamer: ${noiseLines}`);
console.log('\n═══ عينات أسطر رياضية فاشلة (تعرض حمراء أو نص خام) ═══');
for (const s of failSamples) console.log(`[${s.err}] ${s.doc.slice(0, 42)} :: ${s.line}`);
console.log('\n═══ عينات أسطر شوائب ═══');
for (const s of garbledSamples) console.log(`${s.doc.slice(0, 42)} :: ${s.line}`);
console.log('\n═══ عينات toTex لا يحوّل رموزاً يونيكودية ═══');
for (const s of oddTexSamples) console.log(`${s.doc.slice(0, 42)} :: ${s.line} => ${s.tex}`);
