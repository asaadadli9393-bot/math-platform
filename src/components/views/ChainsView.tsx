'use client';

import { useMemo, useState } from 'react';
import {
  BookMarked,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MathText } from '@/components/math-renderer';
import { ChapterIcon } from '@/components/shared';
import type { YearId } from '@/data/curriculum';
import { chaptersOfYear } from '@/data/chapters';
import {
  CHAIN_PDFS,
  DZEXAMS_CHAINS,
  chainPdfsOfYear,
  type ChainPdf,
} from '@/data/chain-pdfs';
import {
  CHAINS_STATS,
  interactiveChainsOfYear,
  type InteractiveChain,
} from '@/data/interactive-chains';
import {
  BAC_SOLUTION_CHAINS,
  BAC_SOLUTION_STATS,
  bacSolutionChainOf,
} from '@/data/bac-solutions';
import { BAC_OFFICIAL_CHAINS, BAC_OFFICIAL_STATS } from '@/data/bac-official';

const YEAR_NAMES: Record<YearId, string> = {
  '1as': 'السنة الأولى ثانوي',
  '2as': 'السنة الثانية ثانوي',
  '3as': 'السنة الثالثة ثانوي',
};

/* ================= ترويسة قسم داخل صفحة السلاسل ================= */

function ChainSectionHeader({
  icon,
  title,
  subtitle,
  badge,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
  tone: 'red' | 'indigo' | 'sky' | 'amber';
}) {
  const tones = {
    red: 'border-red-200 bg-gradient-to-l from-red-50 via-white to-amber-50',
    indigo: 'border-indigo-200 bg-gradient-to-l from-indigo-50 via-white to-violet-50',
    sky: 'border-sky-200 bg-gradient-to-l from-sky-50 via-white to-blue-50',
    amber: 'border-amber-200 bg-gradient-to-l from-amber-50 via-white to-orange-50',
  };
  const iconTones = {
    red: 'from-red-600 to-rose-700 shadow-red-600/25',
    indigo: 'from-indigo-600 to-violet-700 shadow-indigo-600/25',
    sky: 'from-sky-600 to-blue-700 shadow-sky-600/25',
    amber: 'from-amber-600 to-orange-700 shadow-amber-600/25',
  };
  const badgeTones = {
    red: 'bg-red-100 text-red-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    sky: 'bg-sky-100 text-sky-800',
    amber: 'bg-amber-100 text-amber-800',
  };
  return (
    <div className={`rounded-2xl border-2 p-4 sm:p-5 ${tones[tone]}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${iconTones[tone]}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-stone-900 sm:text-xl">{title}</h3>
          <p className="text-xs font-bold text-stone-500 sm:text-sm">{subtitle}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black ${badgeTones[tone]}`}>
          <Sparkles className="h-3 w-3" />
          {badge}
        </span>
      </div>
    </div>
  );
}

/* ================= بطاقة سلسلة PDF ================= */

function ChainPdfCard({
  pdf,
  isPremium,
  onSubscribe,
  onOpenSolutions,
}: {
  pdf: ChainPdf;
  isPremium: boolean;
  onSubscribe: () => void;
  onOpenSolutions?: () => void;
}) {
  // المكتبة (مكتبة الأستاذ) مقفولة بالكامل — تُفتح بالاشتراك فقط
  const locked = (pdf.premium || pdf.group === 'library') && !isPremium;
  const isHosted = !!pdf.file;
  const isBac = pdf.group === 'bac';
  const isDz = pdf.group === 'dzexams';
  const isLib = pdf.group === 'library';
  const sky = isDz && !isHosted;
  return (
    <Card
      className={`group relative overflow-hidden transition-all hover:shadow-lg ${
        locked
          ? 'border-amber-300 bg-amber-50/40'
          : isBac
            ? 'border-indigo-200 hover:border-indigo-400'
            : sky
              ? 'border-sky-200 hover:border-sky-400'
              : isDz
                ? 'border-sky-200 hover:border-sky-400'
                : isLib
                  ? 'border-amber-200 hover:border-amber-400'
                  : 'border-emerald-200 hover:border-emerald-400'
      }`}
    >
      <CardContent className="flex h-full flex-col gap-3 pt-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
              locked
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/25'
                : isBac
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-700 shadow-indigo-600/25'
                  : isDz
                    ? 'bg-gradient-to-br from-sky-600 to-teal-700 shadow-sky-600/25'
                    : isLib
                      ? 'bg-gradient-to-br from-amber-600 to-orange-700 shadow-amber-600/25'
                      : 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-600/25'
            }`}
          >
            {locked ? (
              <Lock className="h-5 w-5 text-white" />
            ) : isDz ? (
              <Sparkles className="h-5 w-5 text-white" />
            ) : isBac ? (
              <GraduationCap className="h-5 w-5 text-white" />
            ) : isLib ? (
              <BookMarked className="h-5 w-5 text-white" />
            ) : (
              <FileText className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h4 className="font-black leading-snug text-stone-900">{pdf.title}</h4>
              {pdf.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    locked
                      ? 'bg-amber-200 text-amber-900'
                      : isBac
                        ? 'bg-indigo-100 text-indigo-800'
                        : isDz
                          ? 'bg-sky-100 text-sky-800'
                          : isLib
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {pdf.badge}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] font-bold text-stone-400">
              {isDz && isHosted
                ? `سلسلة PDF مستضافة • ${pdf.pages} صفحات • ملخص المحور والصيغ + الحل المفصل لكل تمرين`
                : isDz
                  ? 'سلسلة من منصة DzExams • تفتح في صفحة المصدر مباشرة'
                  : isBac
                    ? `تجميعية بكالوريا • ${pdf.pages} صفحات • أسئلة حسب الدورات + حلولها النموذجية المفصلة على المنصة`
                    : isLib
                      ? `من مكتبة الأستاذ • ${pdf.pages} صفحات • ملف أصلي جاهز للفتح والتحميل`
                      : `PDF من أرشيف الأستاذ • ${pdf.pages} صفحات • الحلول النموذجية والتمثيلات البيانية داخل الملف`}
            </p>
          </div>
        </div>
        <p className="flex-1 text-xs leading-5 text-stone-600">{pdf.description}</p>
        {pdf.source && <p className="text-[10px] font-bold text-stone-400">{pdf.source}</p>}
        {locked ? (
          <Button
            onClick={onSubscribe}
            className="w-full gap-2 bg-gradient-to-l from-amber-600 to-amber-500 font-black text-white hover:from-amber-700 hover:to-amber-600"
          >
            <Lock className="h-4 w-4" />
            اشترك لفتح السلسلة كاملة
          </Button>
        ) : isHosted ? (
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-2">
              <Button
                asChild
                className="gap-1.5 bg-gradient-to-l from-sky-700 to-teal-700 font-black text-white hover:from-sky-800 hover:to-teal-800"
              >
                <a href={pdf.file} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  فتح السلسلة
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-1.5 font-black">
                <a href={pdf.file} download>
                  <Download className="h-4 w-4" />
                  تحميل PDF
                </a>
              </Button>
            </div>
            {isBac && onOpenSolutions && (
              <Button
                onClick={onOpenSolutions}
                className="w-full gap-2 bg-gradient-to-l from-emerald-700 to-teal-800 font-black text-white hover:from-emerald-800 hover:to-teal-900"
              >
                <Lightbulb className="h-4 w-4" />
                الحلول النموذجية المفصلة على المنصة
              </Button>
            )}
            {pdf.externalUrl && (
              <a
                href={pdf.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-[10px] font-bold text-sky-700 hover:text-sky-900 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                نسخة المصدر الأصلية على DzExams
              </a>
            )}
          </div>
        ) : (
          <Button
            asChild
            className="w-full gap-1.5 bg-gradient-to-l from-sky-700 to-blue-700 font-black text-white hover:from-sky-800 hover:to-blue-800"
          >
            <a href={pdf.externalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              فتح السلسلة في DzExams
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ================= قسم سلاسل PDF (المجموعات الثلاث) ================= */

function ChainPdfsSection({
  year,
  isPremium,
  onSubscribe,
  openBacSolutionId,
  onJumpToBacSolutions,
}: {
  year: YearId;
  isPremium: boolean;
  onSubscribe: () => void;
  openBacSolutionId: string | null;
  onJumpToBacSolutions: (compilationId: string) => void;
}) {
  const all = chainPdfsOfYear(year);
  if (all.length === 0) return null;
  const adli = all.filter((c) => (c.group ?? 'adli') === 'adli');
  const bac = all.filter((c) => c.group === 'bac');
  const dz = all.filter((c) => c.group === 'dzexams');
  const adliFree = adli.filter((c) => !c.premium).length;
  const adliPrem = adli.length - adliFree;
  const bacFree = bac.filter((c) => !c.premium).length;
  const bacPrem = bac.length - bacFree;
  const dzFree = dz.filter((c) => !c.premium).length;
  const dzPrem = dz.length - dzFree;
  const lib = all.filter((c) => c.group === 'library');
  const libChains = lib.filter((c) => (c.badge ?? '').includes('سلسلة')).length;
  const libLessons = lib.length - libChains;
  return (
    <section className="space-y-4">
      {adli.length > 0 && (
        <>
          <ChainSectionHeader
            tone="red"
            icon={<FileText className="h-6 w-6 text-white" />}
            title="السلاسل الأصلية PDF — من أرشيف الأستاذ عدلي اسعد"
            subtitle={`الملفات الأصلية الموقّعة: ${adli.length} سلاسل (${adliFree} مفتوحة + ${adliPrem} مميزة) — كل ملف يحتوي التمارين مع الحلول النموذجية، ومرفق بتمثيلات بيانية دقيقة للتمارين التي تتطلبها`}
            badge="حصري"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adli.map((pdf) => (
              <ChainPdfCard key={pdf.id} pdf={pdf} isPremium={isPremium} onSubscribe={onSubscribe} />
            ))}
          </div>
        </>
      )}
      {bac.length > 0 && (
        <>
          <ChainSectionHeader
            tone="amber"
            icon={<Lock className="h-6 w-6 text-white" />}
            title="تجميعيات البكالوريا (2008–2026) + الحلول النموذجية المفصلة"
            subtitle={`${bac.length} تجميعيات حسب المحاور: أسئلة البكالوريا الحقيقية مرتبة حسب الدورات، مقرونة مباشرة بالحلول النموذجية المفصلة أدناه — ${BAC_SOLUTION_STATS.totalExercises} حلاً نموذجياً حسب المحاور + التصحيح الرسمي الشامل للموضوعين الرسميين لدورة 2024 وفق منهجية شبكات التصحيح، تُفتح فور تفعيل الاشتراك`}
            badge="للمشتركين فقط"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bac.map((pdf) => (
              <ChainPdfCard
                key={pdf.id}
                pdf={pdf}
                isPremium={isPremium}
                onSubscribe={onSubscribe}
                onOpenSolutions={() => onJumpToBacSolutions(pdf.id)}
              />
            ))}
          </div>
          <div className="space-y-3" id="bac-solutions">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-emerald-700 to-teal-800 px-3.5 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-700/25">
                <Lightbulb className="h-3.5 w-3.5" />
                الحلول النموذجية المفصلة — مقرونة بالتجميعيات
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-200">
                <FileText className="h-3.5 w-3.5" />
                {BAC_SOLUTION_STATS.totalExercises + BAC_OFFICIAL_STATS.totalExercises} حلاً نموذجياً مفصلاً
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-extrabold text-amber-900 ring-1 ring-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                التصحيح الرسمي الشامل — بكالوريا 2024 (الموضوعان)
              </span>
            </div>
            {BAC_SOLUTION_CHAINS.map((chain) => (
              <InteractiveChainCard
                key={chain.id}
                chain={chain}
                isPremium={isPremium}
                onSubscribe={onSubscribe}
                forceOpen={openBacSolutionId === chain.id}
                highlight={openBacSolutionId === chain.id}
                domId={`bacsol-${chain.id}`}
                accentBadge="حلول تجميعية بكالوريا"
              />
            ))}
            {BAC_OFFICIAL_CHAINS.map((chain) => (
              <InteractiveChainCard
                key={chain.id}
                chain={chain}
                isPremium={isPremium}
                onSubscribe={onSubscribe}
                domId={`bacsol-${chain.id}`}
                accentBadge="تصحيح رسمي — دورة 2024"
              />
            ))}
          </div>
        </>
      )}
      {dz.length > 0 && (
        <>
          <ChainSectionHeader
            tone="sky"
            icon={<Sparkles className="h-6 w-6 text-white" />}
            title="سلاسل تمارين السنة الأولى والثانية — مستضافة مع الحلول النموذجية"
            subtitle={`${dz.length} سلسلة PDF (${dzFree} مفتوحة${dzPrem > 0 ? ` + ${dzPrem} مميزة` : ''}) تغطي كل محاور السنة: ملخص المحور والصيغ الأساسية + تمارين متنوعة + الحل النموذجي المفصل لكل تمرين، مع نسخة المصدر الأصلية من DzExams`}
            badge="مجانية"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dz.map((pdf) => (
              <ChainPdfCard key={pdf.id} pdf={pdf} isPremium={isPremium} onSubscribe={onSubscribe} />
            ))}
          </div>
        </>
      )}
      {lib.length > 0 && (
        <>
          <ChainSectionHeader
            tone="amber"
            icon={<Lock className="h-6 w-6 text-white" />}
            title="مكتبة الأستاذ — سلاسل ومذكرات حقيقية منتقاة من أرشيفه"
            subtitle={`${lib.length} وثيقة PDF (${libChains} سلسلة تمارين + ${libLessons} مذكرة وملخص) مصنفة حسب المحاور — محتوى حصري للمشتركين: تُفتح كل الوثائق فور تفعيل الاشتراك`}
            badge="للمشتركين فقط"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lib.map((pdf) => (
              <ChainPdfCard key={pdf.id} pdf={pdf} isPremium={isPremium} onSubscribe={onSubscribe} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ================= بطاقة سلسلة تفاعلية ================= */

function InteractiveChainCard({
  chain,
  isPremium,
  onSubscribe,
  forceOpen = false,
  highlight = false,
  domId,
  accentBadge,
}: {
  chain: InteractiveChain;
  isPremium: boolean;
  onSubscribe: () => void;
  forceOpen?: boolean;
  highlight?: boolean;
  domId?: string;
  accentBadge?: string;
}) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]);
  const locked = chain.premium && !isPremium;
  const isOpen = open || forceOpen;
  const chapter = useMemo(
    () => chaptersOfYear(chain.year).find((c) => c.id === chain.chapterId),
    [chain.year, chain.chapterId],
  );
  return (
    <article
      id={domId}
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        locked ? 'border-amber-200' : 'border-stone-200'
      } ${highlight ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-4 text-right transition hover:bg-stone-50 sm:px-5"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${
            chain.premium
              ? 'bg-gradient-to-br from-amber-500 to-amber-600'
              : 'bg-gradient-to-br from-emerald-600 to-teal-700'
          }`}
        >
          {chain.premium ? <Lock className="h-5 w-5" /> : <BookMarked className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-stone-900 sm:text-[15px]">{chain.title}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {chapter && (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {chapter.shortTitle}
              </span>
            )}
            {accentBadge && (
              <span className="rounded-full bg-gradient-to-l from-emerald-700 to-teal-800 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                {accentBadge}
              </span>
            )}
            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
              {chain.exercises.length} تمارين محلولة
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
        <ChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
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
                        onClick={revealed.includes(i) ? undefined : () => setRevealed((r) => (r.includes(i) ? r : [...r, i]))}
                        disabled={revealed.includes(i)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                          revealed.includes(i)
                            ? 'cursor-default bg-stone-200 text-stone-500'
                            : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 active:scale-[0.98]'
                        }`}
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        {revealed.includes(i) ? 'الحل ظاهر' : 'الحل النموذجي'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 text-[15px] leading-9 text-stone-800">
                  <MathText content={ex.statement} />
                </div>
                {ex.hint && !locked && (
                  <div className="border-t border-amber-100 bg-amber-50/60 px-4 py-2.5 text-xs leading-7 text-amber-900">
                    <span className="font-black">تلميح: </span>
                    <MathText content={ex.hint} />
                  </div>
                )}
                {revealed.includes(i) && (
                  <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-4">
                    <h5 className="mb-2 flex items-center gap-2 text-xs font-black text-emerald-900">
                      <span className="inline-flex h-5 items-center rounded-md bg-emerald-700 px-2 text-[10px] text-white">
                        الحل النموذجي
                      </span>
                      التمرين {i + 1}
                    </h5>
                    <div className="math-scroll min-w-0 text-[15px] leading-9 text-stone-800">
                      <MathText content={ex.solution} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {locked && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <Lock className="h-6 w-6 shrink-0 text-amber-500" />
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
                <Lock className="h-4 w-4" />
                اشترك الآن
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/* ================= قسم السلاسل التفاعلية ================= */

function InteractiveChainsSection({
  year,
  isPremium,
  onSubscribe,
}: {
  year: YearId;
  isPremium: boolean;
  onSubscribe: () => void;
}) {
  const chains = interactiveChainsOfYear(year);
  const chapters = chaptersOfYear(year);
  const [chapterFilter, setChapterFilter] = useState('all');
  const filtered = useMemo(
    () => chains.filter((c) => chapterFilter === 'all' || c.chapterId === chapterFilter),
    [chains, chapterFilter],
  );
  const premiumCount = chains.filter((c) => c.premium).length;
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7" id="chains">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 shadow-lg shadow-emerald-700/25">
          <BookMarked className="h-7 w-7 text-amber-300" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-black text-stone-900">سلاسل الأستاذ عدلي اسعد مع الحلول النموذجية</h2>
          <p className="mt-1.5 text-sm leading-7 text-stone-600">
            سلاسل تمارين متدرجة الإعداد يوقّع عليها الأستاذ عدلي اسعد شخصياً: تمرينات من التأسيس إلى مستوى البكالوريا،
            لكل تمرين تلميح وحل نموذجي مفصل خطوة بخطوة — بنفس منهجية التصحيح المطلوبة في الامتحان الرسمي.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 ring-1 ring-emerald-200">
              <BookMarked className="h-3.5 w-3.5" />
              {chains.length} سلسلة لهذا المستوى
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1.5 text-stone-700 ring-1 ring-stone-200">
              <FileText className="h-3.5 w-3.5 text-emerald-700" />
              {CHAINS_STATS.totalExercises} تمريناً في {CHAINS_STATS.total} سلاسل
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-amber-800 ring-1 ring-amber-200">
              <Lock className="h-3.5 w-3.5" />
              {premiumCount} سلسلة مميزة
            </span>
          </div>
        </div>
      </div>

      {chains.length > 0 && (
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
          {chains
            .map((c) => c.chapterId)
            .filter((id, i, arr) => arr.indexOf(id) === i)
            .map((id) => {
              const ch = chapters.find((c) => c.id === id);
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

      {chains.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm font-bold text-stone-500">
          لا توجد سلاسل لهذا المستوى حالياً — قريباً بإذن الله.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((chain) => (
            <InteractiveChainCard key={chain.id} chain={chain} isPremium={isPremium} onSubscribe={onSubscribe} />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gradient-to-l from-emerald-50 to-teal-50/50 p-4 ring-1 ring-emerald-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/teacher-adli-avatar.jpg"
          alt="الأستاذ عدلي اسعد"
          className="h-11 w-11 shrink-0 rounded-full border-2 border-emerald-600 object-cover"
        />
        <div>
          <p className="text-sm font-black text-emerald-900">من مذكرة الأستاذ عدلي اسعد</p>
          <p className="mt-0.5 text-xs leading-6 text-emerald-800">
            «لا تحفظ الحل — افهم الخطوة الأولى، وأعد التمرين بنفسك بعد يومين. السلسلة التي أنجزتها بيدك خير من عشر
            سلاسل قرأتها فقط.»
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================= صفحة السلاسل ================= */

export default function ChainsView({
  year,
  isPremium,
  onSubscribe,
  onOpenCourses,
}: {
  year: YearId;
  isPremium: boolean;
  onSubscribe: () => void;
  onOpenCourses?: () => void;
}) {
  const interactive = interactiveChainsOfYear(year);
  const pdfChains = chainPdfsOfYear(year);
  const is3as = year === '3as';
  const [openBacSolutionId, setOpenBacSolutionId] = useState<string | null>(null);

  /** الانتقال من بطاقة تجميعية إلى حلولها النموذجية المفصلة */
  const handleJumpToBacSolutions = (compilationId: string) => {
    const chain = bacSolutionChainOf(compilationId);
    setOpenBacSolutionId(chain ? chain.id : null);
    setTimeout(() => {
      document
        .getElementById('bac-solutions')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const totalPremium =
    interactive.filter((c) => c.premium).length + pdfChains.filter((c) => c.premium).length;
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 py-6 sm:px-5">
      <div className="text-center">
        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 shadow-lg shadow-emerald-700/25">
          <BookMarked className="h-8 w-8 text-amber-300" />
        </div>
        <h1 className="academic-divider mb-2 text-3xl font-bold md:text-4xl">
          {is3as ? 'سلاسل الأستاذ عدلي اسعد' : 'سلاسل التمارين'}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl leading-relaxed">
          {is3as
            ? 'سلاسل تمارين متدرجة الإعداد مع الحلول النموذجية المفصلة — التوقيع الخاص للأستاذ عدلي اسعد: من التأسيس إلى مستوى البكالوريا، لكل تمرين تلميح وحل نموذجي خطوة بخطوة بنفس منهجية التصحيح الرسمي.'
            : 'سلاسل تمارين منتقاة بعناية لكل محاور المنهاج مع الحلول النموذجية — من أفضل الإعدادارات التربوية الجزائرية (DzExams ومنسوخون معتمدون)، لكل تمرين حله المفصل بنفس منهجية التصحيح الرسمي.'}
          المستوى الحالي:{' '}
          <span className="font-black text-emerald-800">{YEAR_NAMES[year]}</span> (غيّر المستوى من الشريط العلوي).
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <BookMarked className="mx-auto mb-1 h-5 w-5 text-emerald-700" />
            <div className="text-2xl font-bold">{interactive.length + pdfChains.length}</div>
            <div className="text-xs text-muted-foreground">سلسلة لهذا المستوى</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <FileText className="mx-auto mb-1 h-5 w-5 text-emerald-700" />
            <div className="text-2xl font-bold">
              {CHAINS_STATS.totalExercises + BAC_SOLUTION_STATS.totalExercises + BAC_OFFICIAL_STATS.totalExercises}
            </div>
            <div className="text-xs text-muted-foreground">
              تمريناً في {CHAINS_STATS.total + BAC_SOLUTION_STATS.total + BAC_OFFICIAL_STATS.total} سلاسل
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Lock className="mx-auto mb-1 h-5 w-5 text-amber-500" />
            <div className="text-2xl font-bold">{totalPremium}</div>
            <div className="text-xs text-muted-foreground">سلسلة مميزة</div>
          </CardContent>
        </Card>
      </div>

      <ChainPdfsSection
        year={year}
        isPremium={isPremium}
        onSubscribe={onSubscribe}
        openBacSolutionId={openBacSolutionId}
        onJumpToBacSolutions={handleJumpToBacSolutions}
      />
      <InteractiveChainsSection year={year} isPremium={isPremium} onSubscribe={onSubscribe} />

      <Card className="border-r-4 border-r-emerald-700">
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-stone-900">تحت إشراف الأستاذ عدلي اسعد</p>
            <p className="text-xs text-stone-500" dir="ltr">
              asaadadli9393@gmail.com
            </p>
          </div>
          {onOpenCourses && (
            <Button variant="outline" onClick={onOpenCourses} className="gap-1.5 self-start sm:self-auto">
              الدورات الشاملة
              <ChapterIcon name="TrendingUp" className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* مراجع البيانات لضمان تضمينها في الحزمة (استخدامها في الإحصائيات المستقبلية) */
void CHAIN_PDFS;
void DZEXAMS_CHAINS;
