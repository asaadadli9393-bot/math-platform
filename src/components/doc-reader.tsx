'use client';

import { useEffect, useState } from 'react';
import { BookOpenText, Download, FileText, ListTree, Loader2, Sparkles, X } from 'lucide-react';
import { MathText } from '@/components/math-renderer';
import {
  fetchFormattedDoc,
  formattedEntry,
  useFormattedIndex,
  type FormattedDoc,
  type FormattedEntry,
} from '@/data/formatted-docs';

/* ============================================================
   القارئ الذكي — يعيد تقديم أي وثيقة PDF بأسلوب المنصة المميز:
   بطاقات أكاديمية زمرديّة/حجرية، عناوين منظمة، رياضيات واضحة
   واتجاه RTL متقن — مع بقاء الملف الأصلي متاحاً للتحميل.
   ============================================================ */

const KIND_LABEL: Record<string, string> = {
  h: 'عنوان',
  p: 'فقرة',
  m: 'معادلة',
  li: 'بند',
};

function Block({ b }: { b: FormattedDoc['blocks'][number] }) {
  if (b.t === 'pg') {
    return (
      <div className="my-5 flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-stone-200" />
        <span className="rounded-full bg-stone-100 px-3 py-1 text-[10.5px] font-black text-stone-500 ring-1 ring-stone-200">
          الصفحة {b.x}
        </span>
        <span className="h-px flex-1 bg-stone-200" />
      </div>
    );
  }
  if (b.t === 'h') {
    return (
      <h4 className="mt-6 rounded-xl border-r-4 border-emerald-600 bg-emerald-50/70 px-4 py-2.5 text-[15px] font-black leading-7 text-emerald-900">
        {b.x}
      </h4>
    );
  }
  if (b.t === 'm') {
    return (
      <div
        dir="ltr"
        className="my-2 overflow-x-auto rounded-xl bg-stone-900 px-4 py-3 font-mono text-[13px] leading-6 text-emerald-100"
      >
        {b.x}
      </div>
    );
  }
  if (b.t === 'li') {
    return (
      <div className="flex items-start gap-2.5 py-0.5">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
        <MathText content={b.x} className="text-[14px] leading-7 text-stone-700" />
      </div>
    );
  }
  return <MathText content={b.x} className="block py-0.5 text-[14.5px] leading-8 text-stone-700" />;
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

  const headings = (doc?.blocks ?? []).filter((b) => b.t === 'h').slice(0, 10);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-stone-950/60 backdrop-blur-sm" role="dialog" aria-modal>
      <div className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden sm:my-4 sm:rounded-3xl sm:shadow-2xl">
        {/* رأس القارئ */}
        <div className="relative bg-gradient-to-l from-emerald-800 via-emerald-700 to-teal-700 px-5 pb-5 pt-4 text-white shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <BookOpenText className="h-5.5 w-5.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10.5px] font-black ring-1 ring-white/20">
                <Sparkles className="h-3 w-3" />
                القارئ الذكي — بأسلوب المنصة
              </p>
              <h3 className="mt-1 truncate text-lg font-black leading-snug">{title}</h3>
              <p className="mt-0.5 text-[11px] font-bold text-emerald-100/85">
                {subtitle ? `${subtitle} • ` : ''}
                {doc ? `${doc.pages} صفحات • ${entry.words ?? 0} كلمة مستخرجة` : 'جارٍ استخراج المحتوى…'}
              </p>
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
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-black text-emerald-50 ring-1 ring-white/20 transition hover:bg-white/20"
              >
                <ListTree className="h-3.5 w-3.5" />
                {tocOpen ? 'إخفاء المحتويات' : 'محتويات الوثيقة'}
              </button>
              {tocOpen && (
                <ul className="mt-2 grid gap-1 rounded-xl bg-white/10 p-3 text-[12px] font-bold text-emerald-50 ring-1 ring-white/15 sm:grid-cols-2">
                  {headings.map((h, i) => (
                    <li key={i} className="truncate">
                      • {h.x}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* جسم الوثيقة */}
        <div className="flex-1 overflow-y-auto bg-stone-50 px-4 py-5 sm:px-8">
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
            <div className="mt-20 flex flex-col items-center gap-3 text-stone-400">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-xs font-black">جارٍ تحويل الوثيقة إلى أسلوب المنصة…</p>
            </div>
          ) : (
            <article className="mx-auto max-w-2xl pb-10">
              {doc.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-center">
                <p className="text-[12px] font-black text-emerald-900">
                  انتهت الوثيقة — استُخرج المحتوى آلياً وأُعيد تنسيقه بأسلوب المنصة
                </p>
                <p className="mt-1 text-[11px] font-bold text-emerald-700">
                  للاطلاع على التمثيلات البيانية والأشكال، افتح الملف الأصلي.
                </p>
              </div>
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
