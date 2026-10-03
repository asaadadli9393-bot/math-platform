'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, Download, FileText, ListTree, Loader2, Sparkles, X } from 'lucide-react';
import { findVtGroups, vtBodyFromRows, vtHtml } from '@/lib/vt';
import { AutoText, MathLineGroup, cleanDocText, isMathLine } from '@/lib/reader-math';
import {
  fetchFormattedDoc,
  formattedEntry,
  useFormattedIndex,
  type FormattedDoc,
  type FormattedEntry,
} from '@/data/formatted-docs';

/* ============================================================
   القارئ الذكي — يعيد تقديم أي وثيقة PDF بأسلوب المنصة المميز:
   وثيقة متدفقة أنيقة: أقسام وبطاقات تمارين بيضاء، عناوين زمردية،
   معادلات رشيقة مدمجة في السياق — بلا صناديق ثقيلة أو ضجيج بصري.
   ============================================================ */

type Block = FormattedDoc['blocks'][number];

interface Section {
  title: string | null;
  exercise: boolean;
  items: Block[];
}

const EX_RE = /^(التمرين|تمرين|السؤال|سؤال|الجزء|أولا|أولاً|ثانيا|ثانياً|ثالثا|ثالثاً|رابعا|I\)|II\)|III\)|IV\)|V\))/;

function groupSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  let cur: Section | null = null;
  for (const b of blocks) {
    if (b.t === 'pg') continue;
    if (b.t === 'h' || !cur) {
      cur = {
        title: b.t === 'h' ? b.x : null,
        exercise: b.t === 'h' && EX_RE.test(b.x.trim()),
        items: [],
      };
      sections.push(cur);
      continue;
    }
    cur.items.push(b);
  }
  return sections.filter((s) => s.title || s.items.length);
}

/** جدول تغيرات مُعاد بناؤه بأسلوب المنصة الاحترافي */
function VariationTableBox({ body }: { body: string }) {
  const html = useMemo(() => vtHtml(body), [body]);
  return <div className="my-2" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * يعرض بنود القسم كتدفّق أسطر ذكي:
 * - جداول التغيرات المكتشفة ← جدول المنصة الاحترافي
 * - الأسطر الرياضية المتتالية ← مجموعة KaTeX في صندوق رشيق
 * - الأسطر المختلطة ← تقسيم تلقائي عربي/رياضيات
 * - البنود ← قائمة بنقاط زمردية
 */
function renderItems(items: Block[]) {
  // تدفّق الأسطر بعد التنظيف
  const lines: { t: Block['t']; text: string; block: number }[] = [];
  items.forEach((b, bi) => {
    cleanDocText(b.x)
      .split('\n')
      .forEach((raw) => {
        const text = raw.trim();
        if (text) lines.push({ t: b.t, text, block: bi });
      });
  });

  // كشف جداول التغيرات ضمن تدفّق الأسطر
  const vtGroups = findVtGroups(lines.map((l) => l.text));
  const vtAtStart = new Map<number, (typeof vtGroups)[number]>();
  const vtLines = new Set<number>();
  for (const g of vtGroups) {
    vtAtStart.set(g.start, g);
    for (let i = g.start; i <= g.end; i++) vtLines.add(i);
  }

  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let mathRun: string[] = [];

  const flushList = (key: string) => {
    if (!list.length) return;
    out.push(
      <ul key={key} className="space-y-2 py-0.5">
        {list.map((t, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <AutoText text={t} className="text-[15px] leading-8 text-stone-700" />
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  const flushMath = (key: string) => {
    if (!mathRun.length) return;
    out.push(<MathLineGroup key={key} lines={mathRun} />);
    mathRun = [];
  };

  lines.forEach((ln, i) => {
    // سطر ضمن جدول تغيرات مكتشف
    if (vtLines.has(i)) {
      flushMath(`m${i}`);
      flushList(`l${i}`);
      const g = vtAtStart.get(i);
      if (g) out.push(<VariationTableBox key={`vt${i}`} body={vtBodyFromRows(g.rows)} />);
      return;
    }
    if (ln.t === 'li') {
      flushMath(`m${i}`);
      list.push(ln.text);
      return;
    }
    // سطر رياضي (كتلة رياضيات أو سطر نصي ذو طابع رياضي)
    if (ln.t === 'm' || isMathLine(ln.text)) {
      flushList(`l${i}`);
      mathRun.push(ln.text);
      return;
    }
    flushMath(`m${i}`);
    flushList(`l${i}`);
    out.push(
      <AutoText key={i} text={ln.text} className="block text-[15px] leading-8 text-stone-700" />,
    );
  });
  flushMath('m-end');
  flushList('l-end');
  return out;
}

function SectionView({ s }: { s: Section }) {
  return (
    <section
      className={
        s.exercise
          ? 'rounded-2xl border border-stone-200 bg-white p-5 shadow-sm'
          : 'rounded-2xl px-1 py-1'
      }
    >
      {s.title && (
        <h4
          className={
            s.exercise
              ? 'mb-3 flex items-center gap-2 border-b border-emerald-100 pb-2.5 text-[15.5px] font-black text-emerald-800'
              : 'mb-2 mt-1 rounded-xl border-r-4 border-emerald-600 bg-emerald-50/80 px-4 py-2.5 text-[15px] font-black leading-7 text-emerald-900'
          }
        >
          {s.exercise && <span className="h-2.5 w-2.5 rotate-45 rounded-[3px] bg-emerald-600" />}
          {s.title}
        </h4>
      )}
      <div className="space-y-2.5">{renderItems(s.items)}</div>
    </section>
  );
}

export function DocReaderModal({
  src,
  title,
  subtitle,
  entry,
  onClose,
}: {
  src: string;
  title: string;
  subtitle?: string;
  entry: FormattedEntry;
  onClose: () => void;
}) {
  const [doc, setDoc] = useState<FormattedDoc | null>(null);
  const [failed, setFailed] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchFormattedDoc(entry).then((d) => {
      if (!alive) return;
      if (d) setDoc(d);
      else setFailed(true);
    });
    return () => {
      alive = false;
    };
  }, [entry]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const sections = useMemo(() => (doc ? groupSections(doc.blocks) : []), [doc]);
  const headings = sections.filter((s) => s.title).slice(0, 10).map((s) => s.title as string);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-stone-950/60 backdrop-blur-sm" role="dialog" aria-modal>
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden sm:my-4 sm:rounded-3xl sm:shadow-2xl">
        {/* رأس القارئ */}
        <div className="relative bg-gradient-to-l from-emerald-800 via-emerald-700 to-teal-700 px-5 pb-4 pt-3.5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-black ring-1 ring-white/20">
                <Sparkles className="h-3 w-3" />
                قراءة ذكية بأسلوب المنصة
              </p>
              <h3 className="mt-0.5 truncate text-[16.5px] font-black leading-snug">{title}</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25 active:scale-95"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
          {headings.length > 1 && (
            <>
              <button
                onClick={() => setTocOpen((v) => !v)}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-black text-emerald-50 ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <ListTree className="h-3.5 w-3.5" />
                {tocOpen ? 'إخفاء المحتويات' : `محتويات الوثيقة (${headings.length})`}
              </button>
              {tocOpen && (
                <ul className="mt-2 grid gap-1 rounded-xl bg-white/10 p-3 text-[12px] font-bold text-emerald-50 ring-1 ring-white/15 sm:grid-cols-2">
                  {headings.map((h, i) => (
                    <li key={i} className="truncate">
                      • {h}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* جسم الوثيقة */}
        <div className="flex-1 overflow-y-auto bg-stone-100/60 px-3 py-4 sm:px-6 sm:py-6">
          {failed ? (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-stone-200 bg-white p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-stone-300" />
              <p className="mt-3 text-sm font-black text-stone-700">تعذّر استخراج محتوى هذه الوثيقة آلياً.</p>
              <p className="mt-1 text-xs font-bold text-stone-500">يمكنك فتح الملف الأصلي PDF مباشرة.</p>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-black text-white hover:bg-emerald-800"
              >
                <Download className="h-4 w-4" />
                فتح الملف الأصلي
              </a>
            </div>
          ) : !doc ? (
            <div className="mx-auto mt-8 max-w-2xl space-y-3">
              <div className="flex items-center justify-center gap-2 text-stone-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p className="text-xs font-black">جارٍ تحويل الوثيقة إلى أسلوب المنصة…</p>
              </div>
              {[90, 70, 80, 55, 75, 40].map((w, i) => (
                <div key={i} className="h-9 animate-pulse rounded-xl bg-white/70" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <article className="mx-auto max-w-2xl space-y-3 pb-6">
              {sections.map((s, i) => (
                <SectionView key={i} s={s} />
              ))}
              <p className="pt-4 text-center text-[11.5px] font-bold text-stone-400">
                — استُخرج محتوى الوثيقة آلياً وأُعيد تنسيقه بأسلوب المنصة —
                <br />
                للاطلاع على الأشكال والتمثيلات البيانية، افتح الملف الأصلي.
              </p>
            </article>
          )}
        </div>

        {/* ذيل القارئ */}
        <div className="flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-5 py-3">
          <p className="hidden truncate text-[11px] font-bold text-stone-400 sm:block" dir="ltr">
            {src}
          </p>
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-stone-300 px-3.5 py-2 text-xs font-black text-stone-600 transition hover:bg-stone-100"
            >
              إغلاق
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-l from-emerald-700 to-teal-700 px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:from-emerald-800 hover:to-teal-800"
            >
              <Download className="h-3.5 w-3.5" />
              الملف الأصلي PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** زر «قراءة ذكية» — يظهر فقط إذا توفّر استخراج لهذه الوثيقة */
export function SmartReadButton({
  src,
  title,
  subtitle,
  className = '',
}: {
  src: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const index = useFormattedIndex();
  const entry = formattedEntry(index, src);
  const [open, setOpen] = useState(false);
  if (!entry) return null;
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-l from-violet-700 to-purple-800 px-3 py-2 text-xs font-extrabold text-white shadow-sm transition hover:from-violet-800 hover:to-purple-900 active:scale-[0.98] ${className}`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        قراءة ذكية
      </button>
      {open && (
        <DocReaderModal src={src} title={title} subtitle={subtitle} entry={entry} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
