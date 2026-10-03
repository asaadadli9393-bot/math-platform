/**
 * اختبار مدونة كامل: كشف جداول التغيرات عبر كل الوثائق المستخرجة
 * يحاكي منطق القارئ الذكي (تنظيف الأسطر + كشف VT داخل الأقسام)
 * التشغيل: bun scripts/vt_corpus_test.ts
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { findVtGroups, vtBodyFromRows, vtHtml } from '../src/lib/vt';
import { cleanDocText, isMathLine } from '../src/lib/reader-math';

const DIR = join(import.meta.dir, '..', 'public', 'formatted');
const EX_RE = /^(التمرين|تمرين|السؤال|سؤال|الجزء|أولا|أولاً|ثانيا|ثانياً|ثالثا|ثالثاً|رابعا|I\)|II\)|III\)|IV\)|V\))/;

interface Block { t: string; x: string }

/** نفس groupSections في doc-reader */
function sectionBlocks(blocks: Block[]): Block[][] {
  const sections: Block[][] = [];
  let cur: Block[] = [];
  for (const b of blocks) {
    if (b.t === 'pg') continue;
    if (b.t === 'h' || !cur) {
      cur = [b];
      sections.push(cur);
      continue;
    }
    cur.push(b);
  }
  return sections;
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== 'index.json');
let docs = 0, docsWithVt = 0, totalGroups = 0, mathLines = 0, totalLines = 0;
const samples: { f: string; rows: string[][] }[] = [];
const oddGroups: { f: string; rows: string[][] }[] = [];

for (const f of files) {
  const d = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  const blocks: Block[] = d.blocks || [];
  if (!blocks.length) continue;
  docs++;
  let found = 0;
  for (const sec of sectionBlocks(blocks)) {
    const lines: string[] = [];
    for (const b of sec) {
      for (const raw of cleanDocText(b.x).split('\n')) {
        const t = raw.trim();
        if (t) lines.push(t);
      }
    }
    totalLines += lines.length;
    mathLines += lines.filter(isMathLine).length;
    const groups = findVtGroups(lines);
    for (const g of groups) {
      found++;
      const rows = g.rows.map((r) => [r.label, ...r.cells]);
      if (samples.length < 40) samples.push({ f, rows });
      // مجموعات غريبة: صف x بقيم كثيرة أو تسميات طويلة
      const odd = g.rows.some((r) => r.cells.length > 9 || r.label.length > 10);
      if (odd && oddGroups.length < 15) oddGroups.push({ f, rows });
    }
  }
  if (found) docsWithVt++;
  totalGroups += found;
}

console.log(`docs=${docs}  docs-with-VT=${docsWithVt}  total-groups=${totalGroups}`);
console.log(`lines=${totalLines}  math-lines=${mathLines} (${((mathLines / totalLines) * 100).toFixed(1)}%)`);
console.log('\n===== عينات جداول مكتشفة =====');
for (const s of samples.slice(0, 60)) {
  console.log(s.f.replace('_pdf.json', ''));
  for (const r of s.rows) console.log('   ', r.join(' | '));
}
console.log('\n===== مجموعات مشبوهة (تسمية طويلة/خلايا كثيرة) =====');
for (const s of oddGroups) {
  console.log(s.f.replace('_pdf.json', ''));
  for (const r of s.rows) console.log('   ', r.join(' | '));
}
// فحص HTML لجدولين نموذجيين
const demo1 = [
  { label: 'x', cells: ['0', '1', 'e2', '+∞'] },
  { label: 'lnx', cells: ['−', '0', '+', '+'] },
  { label: '2−lnx', cells: ['+', '+', '0', '−'] },
  { label: 'f′(x)', cells: ['−', '0', '+', '0', '−'] },
  { label: 'f(x)', cells: ['+∞', '↘', '0', '↗', '4', '↘', '0'] },
];
const demo2 = [
  { label: 'x', cells: ['−∞', '2', '+∞'] },
  { label: 'f′(x)', cells: ['−', '∥', '−'] },
  { label: 'f(x)', cells: ['−3', '↘', '−∞', '+∞', '↘', '−3'] },
];
for (const [name, rows] of [['ln2027', demo1], ['fonction-stack', demo2]] as const) {
  const html = vtHtml(vtBodyFromRows(rows));
  console.log(`html[${name}]: len=${html.length} stack=${(html.match(/vt-stackcell/g) || []).length} rows=${(html.match(/<tr/g) || []).length}`);
}
