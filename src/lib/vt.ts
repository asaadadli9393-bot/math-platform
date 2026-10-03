import katex from 'katex';

/* ============================================================
   جدول التغيرات الاحترافي — Tableau de variations
   يُكتب داخل أي نص بالصيغة:
   $$\begin{vt}
   x: -\infty ; -1 ; 1 ; 3 ; +\infty
   f'(x): + ; 0 ; - ; ‖ ; - ; 0 ; +
   f(x): -\infty ; ↗ ; -4 ; ↘ ; ‖ ; ↘ ; 4 ; ↗ ; +\infty
   \end{vt}$$
   - السطر الأول: قيم x (عدد N من النقاط)
   - أسطر وسيطة (واحد أو أكثر): إشارة المشتق / دوال مساعدة
   - السطر الأخير: قيم الدالة والأسهم ↗ / ↘
   - ‖ أو ∥ = قضيب مزدوج (قيمة مستثناة)

   كما يوفر المحرك كشف جداول التغيرات من نصوص PDF المستخرجة:
   findVtGroups() + vtBodyFromRows()
   ============================================================ */

/**
 * تجهيز نص مستخرج من PDF قبل تمريره إلى KaTeX:
 * - lim/sin/cos/... ← أوامر LaTeX مع تجاهل ما سبقه بشرطة مائلة
 * - lnx ← \ln x
 * - e2 ← e^{2}
 */
export function texPrep(s: string): string {
  return s
    .replace(/(?<!\\)\b(lim|sin|cos|tan|exp|log|arctan|arcsin|arccos)\b/g, '\\$1')
    .replace(/(?<!\\)\b(cos|sin|tan)(?=[a-zA-Z])/g, '\\$1 ')
    .replace(/(?<!\\)\bln(?=[a-zA-Z])/g, '\\ln ')
    .replace(/(?<!\\)\bln\b/g, '\\ln')
    .replace(/(?<!\\)\be(\d+)\b/g, 'e^{$1}');
}

function katexCell(tex: string): string {
  try {
    return katex.renderToString(texPrep(tex), {
      throwOnError: false,
      strict: false,
      output: 'html',
    });
  } catch {
    return tex;
  }
}

/** يستخرج جسم جدول vt إن كانت الصيغة تبدأ بـ \begin{vt} — وإلا null */
export function extractVtBody(tex: string): string | null {
  const t = tex.trim();
  if (!t.startsWith('\\begin{vt}')) return null;
  const end = t.indexOf('\\end{vt}');
  if (end === -1) return null;
  return t.slice('\\begin{vt}'.length, end);
}

type CellKind =
  | { k: 'empty' }
  | { k: 'bar' }
  | { k: 'up' }
  | { k: 'down' }
  | { k: 'pos' }
  | { k: 'neg' }
  | { k: 'zero' }
  | { k: 'tex'; v: string }
  | { k: 'stack'; v: string[] };

function classify(raw: string): CellKind {
  const c = raw.trim();
  if (!c) return { k: 'empty' };
  if (c === '‖' || c === '∥' || c === '||' || c === '\\Vert' || c === '\\|') return { k: 'bar' };
  if (c === '↗' || c === '/' || c === '\\nearrow') return { k: 'up' };
  if (c === '↘' || c === '\\' || c === '\\searrow') return { k: 'down' };
  if (c === '+' || c === '\\plus') return { k: 'pos' };
  if (c === '-' || c === '−' || c === '\\minus') return { k: 'neg' };
  if (c === '0') return { k: 'zero' };
  return { k: 'tex', v: c };
}

function cellHtml(cell: CellKind, extraClass = ''): string {
  switch (cell.k) {
    case 'empty':
      return `<td class="vt-cell ${extraClass}"></td>`;
    case 'bar':
      return `<td class="vt-cell vt-bar ${extraClass}"></td>`;
    case 'up':
      return `<td class="vt-cell vt-arr vt-up ${extraClass}">↗</td>`;
    case 'down':
      return `<td class="vt-cell vt-arr vt-down ${extraClass}">↘</td>`;
    case 'pos':
      return `<td class="vt-cell vt-s vt-pos ${extraClass}">+</td>`;
    case 'neg':
      return `<td class="vt-cell vt-s vt-neg ${extraClass}">−</td>`;
    case 'zero':
      return `<td class="vt-cell vt-s vt-zero ${extraClass}">0</td>`;
    case 'tex':
      return `<td class="vt-cell vt-tex ${extraClass}">${katexCell(cell.v)}</td>`;
    case 'stack':
      return `<td class="vt-cell vt-tex vt-stackcell ${extraClass}">${cell.v
        .map((v) => `<span class="vt-stackval">${katexCell(v)}</span>`)
        .join('')}</td>`;
  }
}

/**
 * يحوّل جسم جدول vt إلى HTML كامل بأسلوب المنصة.
 * الصف الأول = نقاط x، الصفوف الوسيطة = صفوف إشارات (واحد أو أكثر)،
 * الصف الأخير = قيم الدالة والأسهم.
 */
export function vtHtml(body: string): string {
  const rows = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      // سطر بدون ':' نتعامل معه كصف بلا تسمية
      if (idx === -1) return { label: '', cells: line.split(/[;؛]/).map((s) => s.trim()) };
      return {
        label: line.slice(0, idx).trim(),
        cells: line
          .slice(idx + 1)
          .split(/[;؛]/)
          .map((s) => s.trim()),
      };
    });

  if (rows.length === 0) return '';

  const pointsRow = rows[0];
  const valuesRow = rows[rows.length - 1];
  const signRows = rows.length >= 2 ? rows.slice(1, rows.length - 1) : [];
  const n = pointsRow.cells.length;
  const total = 2 * n - 1; // عدد أعمدة الشبكة بعد التسمية
  const vIdx = rows.length - 1;

  // مواضع الأعمدة (0-based داخل الشبكة)
  const grid: CellKind[][] = Array.from({ length: rows.length }, () =>
    Array.from({ length: total }, () => ({ k: 'empty' }) as CellKind),
  );

  // صف النقاط: كل نقطة في عمود زوجي
  pointsRow.cells.forEach((c, i) => {
    if (i < n) grid[0][2 * i] = classify(c);
  });

  // صفوف الإشارات: إن كان عدد الخلايا 2N-1 يوزّع مباشرة، وإلا يبدأ من العمود 1
  signRows.forEach((row, si) => {
    const r = si + 1;
    const cells = row.cells;
    if (cells.length === total) {
      cells.forEach((c, i) => (grid[r][i] = classify(c)));
    } else {
      cells.forEach((c, i) => {
        if (1 + i < total) grid[r][1 + i] = classify(c);
      });
    }
  });

  // أعمدة القضيب المزدوج (من صفوف النقاط والإشارات قبل توزيع القيم)
  const barCols = new Set<number>();
  grid.forEach((row) => row.forEach((c, i) => c.k === 'bar' && barCols.add(i)));

  // صف القيم: توزيع تسلسلي مع «تكديس» −∞/+∞ فوق بعضهما عند عمود القضيب
  const isArrow = (t: string) => /^[↗↘/]$/.test(t.trim());
  if (valuesRow !== pointsRow) {
    const cells = valuesRow.cells;
    const noArrows = !cells.some((c) => isArrow(c));
    const allNum = cells.every((c) => /^[≈+\-−]?\d+(?:[.,]\d+)?$/.test(c.trim()));
    if (allNum && noArrows && cells.length === n) {
      // جدول بيانات/قانون احتمال: كل قيمة تقابل نقطة مباشرة (أعمدة زوجية)
      cells.forEach((c, i) => {
        if (2 * i < total) grid[vIdx][2 * i] = classify(c);
      });
    } else {
      let c = 0;
      for (let i = 0; i < cells.length && c < total; i++) {
        const cur = cells[i];
        const nxt = cells[i + 1];
        // تكديس: عند عمود القضيب وقيمتان متتاليتان ليستا سهمين، والمتبقي من القيم
        // يتجاوز المتبقي من الأعمدة → نضع القيمتين فوق بعضهما في نفس العمود
        const needStack =
          barCols.has(c) &&
          nxt !== undefined &&
          !isArrow(cur) &&
          !isArrow(nxt) &&
          cells.length - i > total - c;
        if (needStack) {
          grid[vIdx][c] = { k: 'stack', v: [cur.trim(), nxt.trim()] };
          i++;
        } else {
          grid[vIdx][c] = classify(cur);
        }
        c++;
      }
    }
  }

  // أعمدة القضيب النهائية (تشمل أي قضيب في صف القيم)
  const barColsFinal = new Set<number>(barCols);
  grid.forEach((row) => row.forEach((c, i) => c.k === 'bar' && barColsFinal.add(i)));

  const rowClass = (r: number) => (r === 0 ? 'vt-x' : r === vIdx ? 'vt-val' : 'vt-sign');

  const trs = grid
    .map((row, r) => {
      const labelCell = `<td class="vt-label">${katexCell(rows[r].label || (r === 0 ? 'x' : ''))}</td>`;
      const cells = row
        .map((c, i) => {
          // عمود القضيب المزدوج: كل خلاياه تحمل الحدود المزدوجة حتى يمر الخط عبر الصفوف
          const cls = barColsFinal.has(i) ? 'vt-barcol' : '';
          return cellHtml(c, cls);
        })
        .join('');
      return `<tr class="${rowClass(r)}">${labelCell}${cells}</tr>`;
    })
    .join('');

  return `<div class="vt-box" dir="ltr"><div class="vt-scroll"><table class="vt-table"><tbody>${trs}</tbody></table></div></div>`;
}

/* ============================================================
   كشف جداول التغيرات من نصوص PDF المستخرجة
   ============================================================ */

export interface VtRow {
  label: string;
  cells: string[];
}

export interface VtGroup {
  rows: VtRow[];
  /** فهرس أول سطر في المصفوفة المصدر */
  start: number;
  /** فهرس آخر سطر */
  end: number;
}

const AR_RE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

const CELL_EXACT = new Set(['+', '−', '-', '0', '∥', '‖', '||', '\\|', '↗', '↘', '∞']);

function isCellTok(t: string): boolean {
  return isValidCell(t);
}

/** خلية جدول صالحة: أرقام، ±∞، إشارات، أسهم، رموز قصيرة (e2، ln3، α…) */
function isValidCell(t: string): boolean {
  if (CELL_EXACT.has(t)) return true;
  if (/^[+\-−≈]?∞$/.test(t)) return true;
  if (/^[≈+\-−]?\d+(?:[.,]\d+)?$/.test(t)) return true;
  // رموز حرفية: حرف مفرد (a، x، α) أو كلمة قصيرة برقم (e2، ln3، ex2)
  if (/^[A-Za-zα-ωΑ-Ω]\d{0,2}$/.test(t)) return true;
  if (/^[A-Za-zα-ωΑ-Ω]{2,4}\d+$/.test(t)) return true;
  return false;
}

/** يحاول تحليل سطر كصف جدول تغيرات: تسمية ثم خلايا — وإلا null */
function parseRowLine(line: string): VtRow | null {
  const s0 = line.trim().replace(/¥/g, '∞');
  if (!s0 || s0.length > 70 || AR_RE.test(s0)) return null;
  // دمج الرموز المنقسمة: «+ ∞» ← «+∞»
  const merged: string[] = [];
  for (const tok of s0.split(/\s+/)) {
    const prev = merged[merged.length - 1];
    if (prev && /^[+\-−]$/.test(prev) && /^∞$/.test(tok)) {
      merged[merged.length - 1] = prev + '∞';
    } else {
      merged.push(tok);
    }
  }
  const toks = merged;
  if (toks.length < 3) return null;
  let i = 0;
  while (i < toks.length && !isCellTok(toks[i])) i++;
  // الحرف المفرد الأول (x، n، g…) تسمية وليس خلية
  if (i === 0 && toks.length && /^[A-Za-zα-ωΑ-Ω]{1,2}[′']?$/.test(toks[0])) {
    i = 1;
    if (i < toks.length && /^x$/.test(toks[i])) i++; // «g x»
  }
  // التسمية: من 1 إلى 3 رموز قبل أول خلية، ثم خليتان على الأقل
  if (i < 1 || i > 3 || i >= toks.length) return null;
  let label = toks.slice(0, i).join(' ');
  const cells = toks.slice(i);
  if (cells.length < 2) return null;
  if (!/^[-−\d]*[A-Za-zα-ωΑ-Ω][\w.'′()\u0600-\u06FF\-−\s]{0,11}$/.test(label)) return null;
  // كل الخلايا يجب أن تكون خلايا جدول صالحة (يستبعد الشظايا الرياضية)
  if (!cells.every(isValidCell)) return null;
  // صف إشارات (غير صف x) بتسمية تحوي x: غالبية الخلايا إشارات
  // (يستبعد الشظايا المشوّهة مثل «x + 1 3»)
  const hasArrows = cells.some((c) => /^[↗↘]$/.test(c));
  const candidate: VtRow = { label, cells };
  if (!isXRow(candidate) && /x/i.test(label) && !hasArrows) {
    const exact = cells.filter((c) => CELL_EXACT.has(c)).length;
    if (exact / cells.length < 0.5) return null;
  }
  // تسمية منقسمة: «g x» ← «g(x)»
  const lm = label.match(/^([-−]?)([A-Za-zα-ωΑ-Ω])\s*[′']?\s*x$/);
  if (lm) label = `${lm[1]}${lm[2]}(x)`;
  return { label, cells };
}

/** صف x: تسميته x ويحتوي نقاطاً (∞ أو عددين فأكثر بلا رموز حرفية) */
function isXRow(r: VtRow): boolean {
  if (r.label.trim() !== 'x') return false;
  const infs = r.cells.filter((c) => c.includes('∞')).length;
  if (infs >= 1) return true;
  const nums = r.cells.filter((c) => /^\d+(?:[.,]\d+)?$/.test(c)).length;
  const letterCells = r.cells.filter((c) => /^[a-zA-Zα-ωΑ-Ω]{1,3}\d{0,2}$/.test(c) && !/^\d+$/.test(c)).length;
  return nums >= 2 && r.cells.length >= 4 && letterCells === 0;
}

/**
 * يكتشف مجموعات جداول التغيرات داخل تدفّق أسطر مستخرجة من PDF.
 * تبدأ المجموعة بصف x ثم صفوف إشارات/قيم متتالية (فجوة ≤ 4 أسطر مسموحة
 * لتجاوز الشوائب)، وتُختم بصف يحتوي أسهم ↗/↘.
 */
export function findVtGroups(lines: string[]): VtGroup[] {
  const parsed = lines
    .map((l, idx) => ({ row: parseRowLine(l), idx }))
    .filter((e): e is { row: VtRow; idx: number } => e.row !== null);

  const consumed = new Set<number>();
  const groups: VtGroup[] = [];

  for (let k = 0; k < parsed.length; k++) {
    const { row, idx } = parsed[k];
    if (!isXRow(row) || consumed.has(idx)) continue;
    const members: { row: VtRow; idx: number }[] = [{ row, idx }];
    let prevIdx = idx;
    for (let j = k + 1; j < parsed.length; j++) {
      const { row: r2, idx: i2 } = parsed[j];
      if (i2 - prevIdx > 4) break; // فجوة أسطر كبيرة → خارج الجدول
      if (isXRow(r2)) break; // جدول جديد
      members.push({ row: r2, idx: i2 });
      prevIdx = i2;
      // صف القيم (أسهم) يُختم الجدول
      if (r2.cells.some((c) => /[↗↘]/.test(c))) break;
    }
    if (members.length >= 2) {
      groups.push({ rows: members.map((m) => m.row), start: idx, end: prevIdx });
      members.forEach((m) => consumed.add(m.idx));
    }
  }
  return groups;
}

/** يبني جسم vt من صفوف مكتشفة ليُمرَّر إلى vtHtml */
export function vtBodyFromRows(rows: VtRow[]): string {
  return rows.map((r) => `${r.label}: ${r.cells.join(' ; ')}`).join('\n');
}
