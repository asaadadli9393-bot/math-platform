'use client';

/**
 * عرض «الحلول النموذجية PPT» — صفحة مخصصة لحلول سلاسل الأستاذ عدلي اسعد
 * تعرض دائماً كل السلاسل التسع (مستوى الثالثة ثانوي) بغض النظر عن المستوى المختار
 * حتى لا يضيع الزائر: المفتوحة فيها زر تحميل PPT مباشر، والمميزة تظهر بقفل واضح
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  ExternalLink,
  Download,
  Crown,
  Lock,
  Sparkles,
  Presentation,
  CheckCircle2,
  MonitorPlay,
  GraduationCap,
} from 'lucide-react';
import { CHAIN_PDFS } from '@/data/chain-pdfs';
import { CHAPTERS } from '@/data/chapters';

function SolutionCard({
  pdf,
  isPremium,
  onSubscribe,
}: {
  pdf: (typeof CHAIN_PDFS)[number];
  isPremium: boolean;
  onSubscribe?: () => void;
}) {
  const locked = pdf.premium && !isPremium;
  const chapter = CHAPTERS.find((c) => c.id === pdf.chapterId);
  const free = !pdf.premium;

  return (
    <Card
      className={`group relative overflow-hidden transition-all hover:shadow-lg ${
        locked
          ? 'border-amber-300 bg-amber-50/40'
          : 'border-red-200 bg-white hover:border-red-400'
      }`}
    >
      <CardContent className="flex h-full flex-col gap-3 pt-5">
        {/* رأس البطاقة */}
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
              locked
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/25'
                : 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-600/25'
            }`}
          >
            {locked ? (
              <Lock className="h-5 w-5 text-white" />
            ) : (
              <Presentation className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h4 className="font-black leading-snug text-stone-900">{pdf.title}</h4>
              {free && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                  مجاني
                </span>
              )}
              {pdf.badge && !free && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    locked ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {pdf.badge}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] font-bold text-stone-400">
              {chapter ? `فصل: ${chapter.title}` : 'محور المنهاج'} • {pdf.pages} صفحات •
              حلول نموذجية PPT
            </p>
          </div>
        </div>

        {/* الوصف */}
        <p className="flex-1 text-xs leading-5 text-stone-600">{pdf.description}</p>

        {/* الأزرار */}
        {locked ? (
          <Button
            onClick={onSubscribe}
            className="w-full gap-2 bg-gradient-to-l from-amber-600 to-amber-500 font-black text-white hover:from-amber-700 hover:to-amber-600"
          >
            <Crown className="h-4 w-4" />
            اشترك لفتح الحلول + السلسلة
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              className="gap-1.5 bg-gradient-to-l from-red-600 to-rose-700 font-black text-white hover:from-red-700 hover:to-rose-800"
            >
              <a href={pdf.ppt} download title="تحميل الحلول النموذجية بصيغة PowerPoint">
                <Download className="h-4 w-4" />
                تحميل الحلول PPT
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-1.5 font-black">
              <a href={pdf.file} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                فتح السلسلة PDF
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SolutionsView({
  isPremium,
  onSubscribe,
}: {
  isPremium: boolean;
  onSubscribe?: () => void;
}) {
  const freeCount = CHAIN_PDFS.filter((p) => !p.premium).length;
  const premiumCount = CHAIN_PDFS.length - freeCount;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* ============ رأس الصفحة ============ */}
      <section className="rounded-2xl border-2 border-red-200 bg-gradient-to-l from-red-50 via-white to-amber-50 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-600/25">
            <Presentation className="h-7 w-7 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-black text-stone-900 sm:text-2xl">
              حلول السلاسل النموذجية — PowerPoint قابل للتحميل
            </h1>
            <p className="mt-1 text-xs font-bold leading-6 text-stone-500 sm:text-sm">
              سلاسل الأستاذ عدلي اسعد ({CHAIN_PDFS.length} سلاسل — مستوى الثالثة ثانوي):{' '}
              {freeCount} مجانية + {premiumCount} بالاشتراك — كل ملف يحتوي التمارين مع الحلول
              النموذجية خطوة بخطوة
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[11px] font-black text-white shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            حصري
          </span>
        </div>

        {/* شريط المزايا */}
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-red-100">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-red-600" />
            <span className="text-[11px] font-bold text-stone-600 sm:text-xs">
              حلول مفصلة خطوة بخطوة لكل تمرين
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-red-100">
            <MonitorPlay className="h-4 w-4 shrink-0 text-red-600" />
            <span className="text-[11px] font-bold text-stone-600 sm:text-xs">
              نسخة PowerPoint جاهزة للعرض على السبورة
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-red-100">
            <GraduationCap className="h-4 w-4 shrink-0 text-red-600" />
            <span className="text-[11px] font-bold text-stone-600 sm:text-xs">
              بإشراف الأستاذ عدلي اسعد — موافقة للتدرج الرسمي
            </span>
          </div>
        </div>
      </section>

      {/* ============ السلاسل المجانية أولاً ============ */}
      <h2 className="mt-8 mb-3 flex items-center gap-2 text-base font-black text-stone-800">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        السلاسل المجانية — حمّل الحلول الآن
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAIN_PDFS.filter((p) => !p.premium || isPremium).map((pdf) => (
          <SolutionCard key={pdf.id} pdf={pdf} isPremium={isPremium} onSubscribe={onSubscribe} />
        ))}
      </div>

      {/* ============ السلاسل المميزة ============ */}
      {!isPremium && (
        <>
          <h2 className="mt-8 mb-3 flex items-center gap-2 text-base font-black text-stone-800">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Lock className="h-4 w-4" />
            </span>
            سلاسل الاشتراك المميز ({premiumCount})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CHAIN_PDFS.filter((p) => p.premium).map((pdf) => (
              <SolutionCard key={pdf.id} pdf={pdf} isPremium={false} onSubscribe={onSubscribe} />
            ))}
          </div>

          {/* دعوة للاشتراك */}
          <div className="mt-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-l from-amber-50 to-white p-5 text-center">
            <FileText className="mx-auto mb-2 h-8 w-8 text-amber-600" />
            <h3 className="text-lg font-black text-stone-900">
              فتح كامل لـ {premiumCount} سلاسل + الحلول النموذجية
            </h3>
            <p className="mx-auto mt-1 max-w-xl text-xs font-bold leading-6 text-stone-500 sm:text-sm">
              بالاشتراك تفتح كل السلاسل وملفات PPT الخاصة بحلولها، إضافة إلى بقية المحتوى المميز:
              الدورات والفروض والاختبارات.
            </p>
            <Button
              onClick={onSubscribe}
              className="mt-4 gap-2 bg-gradient-to-l from-amber-600 to-amber-500 px-8 font-black text-white hover:from-amber-700 hover:to-amber-600"
            >
              <Crown className="h-4 w-4" />
              اشترك الآن
            </Button>
          </div>
        </>
      )}

      {/* ملاحظة ختامية */}
      <p className="mt-6 rounded-xl bg-stone-50 px-4 py-3 text-center text-[11px] font-bold text-stone-500 ring-1 ring-stone-200">
        ملاحظة: هذه السلاسل مخصصة لمستوى الثالثة ثانوي (جميع الشعب). تُعرض أيضاً داخل صفحة
        «السلاسل» عند اختيار مستوى الثالثة ثانوي، مع أزرار التحميل نفسها.
      </p>
    </div>
  );
}
