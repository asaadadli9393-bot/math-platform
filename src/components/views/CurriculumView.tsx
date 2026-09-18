'use client';

import { useState } from 'react';
import { CalendarRange, Clock, FileText, GraduationCap, Wrench } from 'lucide-react';
import { ANNUAL_PLANS, LEVELS, streamsOfYear, type StreamId, type YearId } from '@/data/curriculum';
import { SectionTitle } from '@/components/shared';

const KIND_META = {
  assessment: { label: 'تقويم تشخيصي', cls: 'bg-stone-200 text-stone-700' },
  chapter: { label: 'فصل', cls: 'bg-emerald-100 text-emerald-800' },
  remedial: { label: 'معالجة بيداغوجية', cls: 'bg-amber-100 text-amber-800' },
} as const;

function weeksLabel(w: number): string {
  if (w === 0.5) return 'نصف أسبوع';
  if (Number.isInteger(w)) return w === 1 ? 'أسبوع' : `${w} أسابيع`;
  const whole = Math.floor(w);
  return `${whole} أسابيع ونصف`;
}

export default function CurriculumView({
  year,
  onOpenChapter,
}: {
  year: YearId;
  onOpenChapter: (chapterId: string) => void;
}) {
  const yearStreams = streamsOfYear(year);
  const [stream, setStream] = useState<StreamId>(yearStreams[0]?.id ?? 'sciences');
  const rows = ANNUAL_PLANS[stream];
  const info = yearStreams.find((s) => s.id === stream) ?? yearStreams[0];

  // cumulative week ranges (built without mutating variables inside callbacks)
  const rowsWithRange: Array<(typeof rows)[number] & { start: number; end: number }> = [];
  let cursor = 1;
  for (const r of rows) {
    const start = cursor;
    const w = Math.ceil(r.weeks);
    cursor += w;
    rowsWithRange.push({ ...r, start, end: cursor - 1 });
  }

  const totalHours = info.totalHours; // الرقم الرسمي من وثيقة التدرجات
  const totalWeeks = info.totalWeeks;
  const chapterCount = new Set(rows.filter((r) => r.chapterId).map((r) => r.chapterId)).size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="التدرج السنوي 2022-2023"
        title="جداول بناء التعلمات الرسمية"
        sub="الترتيب والأسابيع والحجم الساعي مطابقون لوثيقة «التدرجات السنوية — المادة: رياضيات» الصادرة عن المفتشية العامة للتربية الوطنية ومديرية التعليم الثانوي العام والتكنولوجي، سبتمبر 2022."
      />

      {/* Year selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <span
            key={l.id}
            className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-extrabold transition ${
              l.id === year
                ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                : 'border-stone-200 bg-stone-100 text-stone-400'
            }`}
          >
            {l.name}
          </span>
        ))}
        <span className="hidden items-center text-xs font-bold text-stone-400 sm:inline-flex">
          — بدّل المستوى من الشريط العلوي
        </span>
      </div>

      {/* Stream selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {yearStreams.map((s) => (
          <button
            key={s.id}
            onClick={() => setStream(s.id)}
            className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
              stream === s.id
                ? 'border-emerald-700 bg-emerald-700 text-white shadow-md'
                : 'border-stone-200 bg-white text-stone-700 hover:border-emerald-300 hover:text-emerald-800'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Stream summary */}
      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
            <GraduationCap className="h-4 w-4 text-emerald-600" />
            الشعبة
          </div>
          <div className="mt-1 text-lg font-extrabold text-stone-900">{info.name}</div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
            <Clock className="h-4 w-4 text-emerald-600" />
            الحجم الساعي
          </div>
          <div className="mt-1 text-lg font-extrabold text-stone-900">
            {totalHours} ساعة <span className="text-sm font-bold text-stone-400">({info.weeklyHours}س/أسبوع)</span>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
            <CalendarRange className="h-4 w-4 text-emerald-600" />
            المدة
          </div>
          <div className="mt-1 text-lg font-extrabold text-stone-900">{totalWeeks} أسبوعاً</div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-500">
            <FileText className="h-4 w-4 text-emerald-600" />
            الفصول
          </div>
          <div className="mt-1 text-lg font-extrabold text-stone-900">{chapterCount} فصلاً في التدرج</div>
        </div>
      </div>

      {/* Plan table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-100 bg-stone-50 px-5 py-4">
          <h3 className="text-base font-extrabold text-stone-900">
            التدرج السنوي لبناء التعلمات — {info.name}
          </h3>
          <p className="mt-1 text-xs text-stone-500">اضغط على أي فصل للانتقال إلى ملخصه وتمارينه.</p>
        </div>
        <div className="divide-y divide-stone-100">
          {rowsWithRange.map((r, i) => {
            const meta = KIND_META[r.kind];
            const clickable = !!r.chapterId;
            return (
              <div
                key={i}
                onClick={() => clickable && onOpenChapter(r.chapterId!)}
                className={`flex flex-col gap-2 px-5 py-4 transition sm:flex-row sm:items-center sm:gap-4 ${
                  clickable ? 'cursor-pointer hover:bg-emerald-50/60' : 'bg-stone-50/50'
                }`}
              >
                <div className="flex w-full items-center gap-3 sm:w-40 sm:shrink-0">
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      r.kind === 'chapter' ? 'bg-emerald-700 text-white' : meta.cls
                    }`}
                  >
                    {r.kind === 'chapter' ? r.start : '—'}
                  </span>
                  <div className="text-xs font-bold leading-5 text-stone-500">
                    {r.start === r.end ? `الأسبوع ${r.start}` : `الأسابيع ${r.start}-${r.end}`}
                    <div className="font-semibold text-stone-400">{weeksLabel(r.weeks)}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <span
                    className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.cls} align-middle`}
                  >
                    {meta.label}
                  </span>
                  <span
                    className={`align-middle text-sm font-bold ${
                      clickable ? 'text-stone-900 group-hover:text-emerald-800' : 'text-stone-600'
                    }`}
                  >
                    {r.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-extrabold text-stone-600">
                    {r.hours} ساعة
                  </span>
                  {clickable && (
                    <span className="hidden rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 sm:inline">
                      عرض الفصل ←
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between bg-emerald-950 px-5 py-4 text-white">
            <span className="text-sm font-extrabold">المجموع</span>
            <span className="text-sm font-extrabold">
              {totalWeeks} أسبوعاً • {totalHours} ساعة
            </span>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm leading-7 text-amber-900">
          <strong>ملاحظة منهجية من الوثيقة:</strong> تدرج شعبتي رياضيات وتقني رياضي يتضمن فصل «الأعداد والحساب»
          (القسمة الإقليدية، الأعداد الأولية، أنظمة الترقيم)، بينما يتضمن تدرج علوم تجريبية فصلاً مستقلاً
          لـ«التحولات النقطية» — وقد أخذت المنصة بهذه الفروق في بنك التمارين ووسوم الشعب.
        </p>
      </div>
    </div>
  );
}
