'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, BookOpenCheck, ChevronDown, Lightbulb, Sigma } from 'lucide-react';
import { CHAPTERS, type Chapter } from '@/data/chapters';
import { EXERCISES } from '@/data/exercises';
import { chapterTotalHours, chapterWeekRange, STREAMS, type StreamId } from '@/data/curriculum';
import { ChapterIcon, SectionTitle, THEME_STYLES } from '@/components/shared';
import { RichText } from '@/lib/tex';

function ChapterCard({
  chapter,
  index,
  onOpen,
}: {
  chapter: Chapter;
  index: number;
  onOpen: () => void;
}) {
  const th = THEME_STYLES[chapter.theme];
  const count = EXERCISES.filter((e) => e.chapterId === chapter.id).length;
  return (
    <button
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-xl ${th.bg} p-2.5 text-white shadow-md`}>
          <ChapterIcon name={chapter.icon} className="h-5 w-5" />
        </div>
        <span className={`text-xs font-black ${th.text}`}>الفصل {index + 1}</span>
        <span className="mr-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
          {count} تمارين
        </span>
      </div>
      <h3 className="mb-2 text-base font-extrabold leading-7 text-stone-900">{chapter.title}</h3>
      <p className="line-clamp-3 flex-1 text-xs leading-6 text-stone-500">{chapter.intro}</p>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {chapter.streams.map((sid) => {
          const s = STREAMS.find((x) => x.id === sid)!;
          return (
            <span key={sid} className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.color}`}>
              {s.shortName}
            </span>
          );
        })}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700">
        الملخص والتمارين
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
      </span>
    </button>
  );
}

function ChapterDetail({
  chapter,
  index,
  onBack,
  onOpenBank,
}: {
  chapter: Chapter;
  index: number;
  onBack: () => void;
  onOpenBank: (chapterId: string) => void;
}) {
  const th = THEME_STYLES[chapter.theme];
  const [openSections, setOpenSections] = useState<number[]>([0]);
  const ex = EXERCISES.filter((e) => e.chapterId === chapter.id);

  const toggle = (i: number) =>
    setOpenSections((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 transition hover:border-emerald-300 hover:text-emerald-800"
      >
        <ArrowRight className="h-4 w-4" />
        كل الفصول
      </button>

      {/* Header */}
      <div className={`mb-8 overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-bl ${th.soft} to-white p-6 sm:p-8`}>
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl ${th.bg} p-4 text-white shadow-lg`}>
            <ChapterIcon name={chapter.icon} className="h-8 w-8" />
          </div>
          <div>
            <span className={`text-sm font-black ${th.text}`}>الفصل {index + 1}</span>
            <h1 className="text-2xl font-black leading-9 text-stone-900 sm:text-3xl">{chapter.title}</h1>
          </div>
        </div>
        <p className="mt-4 text-sm leading-8 text-stone-600">{chapter.intro}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {chapter.streams.map((sid) => {
            const s = STREAMS.find((x) => x.id === sid)!;
            const range = chapterWeekRange(sid, chapter.id);
            const hours = chapterTotalHours(sid, chapter.id);
            return (
              <span key={sid} className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${s.color}`}>
                {s.shortName}: {range} • {hours} ساعة
              </span>
            );
          })}
        </div>
      </div>

      {/* Key ideas */}
      <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-emerald-900">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          أهم الأفكار المستهدفة
        </h2>
        <ul className="space-y-2.5">
          {chapter.ideas.map((idea, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-7 text-stone-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <RichText text={idea} />
            </li>
          ))}
        </ul>
      </div>

      {/* Formulas */}
      <div className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-stone-900">
          <Sigma className="h-5 w-5 text-emerald-700" />
          الصيغ الجوهرية
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {chapter.formulas.map((f, i) => (
            <div
              key={i}
              className="math-scroll rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
              dir="ltr"
            >
              <RichText text={`$$${f.tex}$$`} />
              <div className="mt-1 text-center text-[11px] font-bold text-stone-500" dir="rtl">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary sections */}
      <div className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-stone-900">
          <BookOpenCheck className="h-5 w-5 text-emerald-700" />
          ملخص الفصل
        </h2>
        <div className="space-y-3">
          {chapter.summary.map((sec, i) => {
            const open = openSections.includes(i);
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-right transition hover:bg-stone-50"
                >
                  <span className="text-sm font-extrabold text-stone-900 sm:text-base">{sec.heading}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <div className="border-t border-stone-100 bg-stone-50/60 px-5 py-4 text-sm leading-8 text-stone-700">
                    <RichText text={sec.body} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-bl from-emerald-800 to-emerald-950 p-6 text-white sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h3 className="text-lg font-extrabold">بنك تمارين هذا الفصل: {ex.length} تمارين بحلول نموذجية</h3>
            <p className="mt-1 text-sm leading-7 text-emerald-100/85">
              مصنفة بالصعوبة من «سهل» إلى «بكالوريا»، مع تلميحات وحلول مفصلة خطوة بخطوة.
            </p>
          </div>
          <button
            onClick={() => onOpenBank(chapter.id)}
            className="shrink-0 rounded-xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-emerald-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-[0.98]"
          >
            افتح البنك مصفّى على الفصل
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChaptersView({
  initialChapterId,
  onOpenBank,
}: {
  initialChapterId?: string;
  onOpenBank: (chapterId: string) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(initialChapterId ?? null);

  const idx = useMemo(() => {
    if (!openId) return 0;
    return CHAPTERS.findIndex((c) => c.id === openId);
  }, [openId]);

  if (openId && idx >= 0) {
    return (
      <ChapterDetail
        chapter={CHAPTERS[idx]}
        index={idx}
        onBack={() => setOpenId(null)}
        onOpenBank={onOpenBank}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="الفصول الدراسية"
        title="ملخصات وصيغ لكل فصل"
        sub="اضغط أي فصل لعرض موقعه في التدرج السنوي لكل شعبة، أهم الأفكار، الصيغ الجوهرية، والملخص الكامل."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c, i) => (
          <ChapterCard key={c.id} chapter={c} index={i} onOpen={() => setOpenId(c.id)} />
        ))}
      </div>
    </div>
  );
}
