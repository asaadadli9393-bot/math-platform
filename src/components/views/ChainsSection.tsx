'use client';

import * as React from 'react';
import {
  ChevronDown,
  Eye,
  ListOrdered,
  Lock,
  Crown,
  Sparkles,
  Target,
} from 'lucide-react';
import { chainsOfYear, chainChapter, CHAINS_COUNT, CHAIN_EXERCISES_COUNT, type Chain } from '@/data/chains';
import { chaptersOfYear } from '@/data/chapters';
import type { YearId } from '@/data/curriculum';
import { RichText } from '@/lib/tex';

/* ============================ بطاقة سلسلة ============================ */

function ChainCard({ chain, isPremium, onSubscribe }: { chain: Chain; isPremium: boolean; onSubscribe?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [revealedIds, setRevealedIds] = React.useState<number[]>([]);

  const locked = chain.premium && !isPremium;
  const chapter = chainChapter(chain);

  const reveal = (i: number) => setRevealedIds((r) => (r.includes(i) ? r : [...r, i]));

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        locked ? 'border-amber-200' : 'border-stone-200'
      }`}
    >
      {/* رأس السلسلة */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-4 text-right transition hover:bg-stone-50 sm:px-5"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${
            chain.premium ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-emerald-600 to-teal-700'
          }`}
        >
          {chain.premium ? <Crown className="h-5 w-5" /> : <ListOrdered className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-stone-900 sm:text-[15px]">{chain.title}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {chapter && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {chapter.shortTitle}
              </span>
            )}
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              {chain.exercises.length} تمارين
            </span>
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              {chain.level}
            </span>
            {locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-300">
                <Lock className="h-3 w-3" />
                مميزة
              </span>
            )}
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 py-4 sm:px-5">
          <p className="mb-4 text-xs leading-6 text-stone-500">{chain.description}</p>

          <div className="space-y-3">
            {chain.exercises.map((ex, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 bg-stone-50/70 px-4 py-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-xs font-black text-white">
                    {i + 1}
                  </span>
                  <div className="mr-auto">
                    {locked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800 ring-1 ring-amber-300">
                        <Lock className="h-3.5 w-3.5" />
                        الحل للمشتركين
                      </span>
                    ) : (
                      <button
                        onClick={revealedIds.includes(i) ? undefined : () => reveal(i)}
                        disabled={revealedIds.includes(i)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                          revealedIds.includes(i)
                            ? 'cursor-default bg-stone-200 text-stone-500'
                            : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 active:scale-[0.98]'
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {revealedIds.includes(i) ? 'الحل ظاهر' : 'الحل النموذجي'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 text-[15px] leading-9 text-stone-800">
                  <RichText text={ex.statement} />
                </div>
                {ex.hint && !locked && (
                  <div className="border-t border-amber-100 bg-amber-50/60 px-4 py-2.5 text-xs leading-7 text-amber-900">
                    <span className="font-black">تلميح: </span>
                    <RichText text={ex.hint} />
                  </div>
                )}
                {revealedIds.includes(i) && (
                  <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-4">
                    <h5 className="mb-2 flex items-center gap-2 text-xs font-black text-emerald-900">
                      <span className="inline-flex h-5 items-center rounded-md bg-emerald-700 px-2 text-[10px] text-white">
                        الحل النموذجي
                      </span>
                      التمرين {i + 1}
                    </h5>
                    <div className="math-scroll min-w-0 text-[15px] leading-9 text-stone-800">
                      <RichText text={ex.solution} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {locked && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Crown className="h-6 w-6 shrink-0 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-amber-900">حلول هذه السلسلة للمشتركين المميزين</p>
                <p className="text-xs leading-6 text-amber-700">
                  اشترك للوصول الفوري إلى الحلول النموذجية المفصلة لكل تمارين السلسلة، مع كل سلاسل الأستاذ وبنك الفروض.
                </p>
              </div>
              <button
                onClick={onSubscribe}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300 active:scale-[0.98]"
              >
                <Crown className="h-4 w-4" />
                اشترك الآن
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ============================ قسم السلاسل (يُضمّن في الدورات) ============================ */

export default function ChainsSection({ year, isPremium, onSubscribe }: { year: YearId; isPremium: boolean; onSubscribe?: () => void }) {
  const yearChains = chainsOfYear(year);
  const yearChapters = chaptersOfYear(year);

  const [chapterFilter, setChapterFilter] = React.useState<string>('all');

  const filtered = React.useMemo(
    () => yearChains.filter((c) => chapterFilter === 'all' || c.chapterId === chapterFilter),
    [yearChains, chapterFilter],
  );

  const premiumCount = yearChains.filter((c) => c.premium).length;

  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" id="chains">
      {/* رأس القسم */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 shadow-lg shadow-emerald-700/25">
          <Sparkles className="h-7 w-7 text-amber-300" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-black text-stone-900">سلاسل الأستاذ عدلي اسعد مع الحلول النموذجية</h2>
          <p className="mt-1.5 text-sm leading-7 text-stone-600">
            سلاسل تمارين متدرجة الإعداد يوقّع عليها الأستاذ عدلي اسعد شخصياً: تمرينات من التأسيس إلى مستوى البكالوريا، لكل تمرين
            تلميح وحل نموذجي مفصل خطوة بخطوة — بنفس منهجية التصحيح المطلوبة في الامتحان الرسمي.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
              <ListOrdered className="h-3.5 w-3.5" />
              {yearChains.length} سلسلة لهذا المستوى
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1.5 text-stone-700 ring-1 ring-stone-200">
              <Target className="h-3.5 w-3.5 text-emerald-700" />
              {CHAIN_EXERCISES_COUNT} تمريناً في {CHAINS_COUNT} سلاسل
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-800 ring-1 ring-amber-200">
              <Crown className="h-3.5 w-3.5" />
              {premiumCount} سلسلة مميزة
            </span>
          </div>
        </div>
      </div>

      {/* فلتر الفصول */}
      {yearChains.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-stone-500">المحور:</span>
          <button
            onClick={() => setChapterFilter('all')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-extrabold transition ${
              chapterFilter === 'all'
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'
            }`}
          >
            الكل
          </button>
          {yearChains
            .map((c) => c.chapterId)
            .filter((id, i, arr) => arr.indexOf(id) === i)
            .map((id) => {
              const ch = yearChapters.find((c) => c.id === id);
              if (!ch) return null;
              return (
                <button
                  key={id}
                  onClick={() => setChapterFilter(chapterFilter === id ? 'all' : id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-extrabold transition ${
                    chapterFilter === id
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'
                  }`}
                >
                  {ch.shortTitle}
                </button>
              );
            })}
        </div>
      )}

      {/* القائمة */}
      {yearChains.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm font-bold text-stone-500">
          لا توجد سلاسل لهذا المستوى حالياً — قريباً بإذن الله.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((chain) => (
            <ChainCard key={chain.id} chain={chain} isPremium={isPremium} onSubscribe={onSubscribe} />
          ))}
        </div>
      )}

      {/* توقيع الأستاذ */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gradient-to-l from-emerald-50 to-teal-50/50 p-4 ring-1 ring-emerald-100">
        <img
          src="/teacher-adli.jpg"
          alt="الأستاذ عدلي اسعد"
          className="h-11 w-11 shrink-0 rounded-full border-2 border-emerald-600 object-cover"
        />
        <div>
          <p className="text-sm font-black text-emerald-900">من مذكرة الأستاذ عدلي اسعد</p>
          <p className="mt-0.5 text-xs leading-6 text-emerald-800">
            «لا تحفظ الحل — افهم الخطوة الأولى، وأعد التمرين بنفسك بعد يومين. السلسلة التي أنجزتها بيدك خير من عشر سلاسل
            قرأتها فقط.»
          </p>
        </div>
      </div>
    </section>
  );
}
