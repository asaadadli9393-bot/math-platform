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
   - سطر وسيط (اختياري): إشارة المشتق
   - السطر الأخير: قيم الدالة والأسهم ↗ / ↘
   - ‖ = قضيب مزدوج (قيمة مستثناة)
   ============================================================ */

function katexCell(tex: string): string {
  try {
    return katex.renderToString(tex, {
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
  | { k: 'tex'; v: string };

function classify(raw: string): CellKind {
  const c = raw.trim();
  if (!c) return { k: 'empty' };
  if (c === '‖' || c === '||' || c === '\\Vert' || c === '\\|') return { k: 'bar' };
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
  }
}

/**
 * يحوّل جسم جدول vt إلى HTML كامل بأسلوب المنصة.
 * صفوف: الأول = نقاط x، الوسيط (إن وجد) = إشارة المشتق، الأخير = القيم.
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
  const signRow = rows.length >= 3 ? rows[1] : null;
  const n = pointsRow.cells.length;
  const total = 2 * n - 1; // عدد أعمدة الشبكة بعد التسمية

  // مواضع الأعمدة (0-based داخل الشبكة)
  const grid: CellKind[][] = Array.from({ length: rows.length }, () =>
    Array.from({ length: total }, () => ({ k: 'empty' }) as CellKind),
  );

  // صف النقاط: كل نقطة في عمود زوجي
  pointsRow.cells.forEach((c, i) => {
    if (i < n) grid[0][2 * i] = classify(c);
  });

  // صف الإشارات: إن كان عدد الخلايا 2N-1 يوزّع مباشرة، وإلا يبدأ من العمود 1
  if (signRow) {
    const cells = signRow.cells;
    if (cells.length === total) {
      cells.forEach((c, i) => (grid[1][i] = classify(c)));
    } else {
      cells.forEach((c, i) => {
        if (1 + i < total) grid[1][1 + i] = classify(c);
      });
    }
  }

  // صف القيم: إن كان عدد الخلايا 2N-1 يوزّع مباشرة، وإلا يبدأ من العمود 0 مع تعبئة
  const vIdx = rows.length - 1;
  if (valuesRow !== pointsRow && valuesRow !== signRow) {
    const cells = valuesRow.cells;
    if (cells.length === total) {
      cells.forEach((c, i) => (grid[vIdx][i] = classify(c)));
    } else {
      cells.forEach((c, i) => {
        if (i < total) grid[vIdx][i] = classify(c);
      });
    }
  }

  // أعمدة القضيب المزدوج: كل خلية bar في أي صف
  const barCols = new Set<number>();
  grid.forEach((row) => row.forEach((c, i) => c.k === 'bar' && barCols.add(i)));

  const rowClass = (r: number) => (r === 0 ? 'vt-x' : r === vIdx ? 'vt-val' : 'vt-sign');

  const trs = grid
    .map((row, r) => {
      const labelCell =
        r === 0
          ? `<td class="vt-label">${katexCell(rows[r].label || 'x')}</td>`
          : `<td class="vt-label">${katexCell(rows[r].label || '')}</td>`;
      const cells = row
        .map((c, i) => {
          // عمود القضيب المزدوج: كل خلاياه تحمل الحدود المزدوجة حتى يمر الخط عبر الصفوف
          const cls = barCols.has(i) ? 'vt-barcol' : '';
          return cellHtml(c, cls);
        })
        .join('');
      return `<tr class="${rowClass(r)}">${labelCell}${cells}</tr>`;
    })
    .join('');

  return `<div class="vt-box" dir="ltr"><div class="vt-scroll"><table class="vt-table"><tbody>${trs}</tbody></table></div></div>`;
}
