'use client';

/**
 * قسم «السلاسل PDF» — ثلاث مجموعات:
 *  1) السلاسل الأصلية — أرشيف الأستاذ عدلي اسعد (محلية، حلول + رسوم بيانية)
 *  2) تجميعيات البكالوريا 2008-2026 (محلية مجانية — تجميع الأستاذ خالد بخاخشة)
 *  3) سلاسل DzExams للسنة الأولى والثانية (روابط خارجية مجانية)
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
  GraduationCap,
  Globe,
} from 'lucide-react';
import { chainPdfsOfYear, type ChainPdf } from '@/data/chain-pdfs';
import type { YearId } from '@/data/curriculum';

function ChainPdfCard({
  pdf,
  isPremium,
  onSubscribe,
}: {
  pdf: ChainPdf;
  isPremium: boolean;
  onSubscribe?: () => void;
}) {
  const locked = pdf.premium && !isPremium;
  const isExternal = !!pdf.externalUrl;
  const isBac = pdf.group === 'bac';

  return (
    <Card
      className={`group relative overflow-hidden transition-all hover:shadow-lg ${
        locked
          ? 'border-amber-300 bg-amber-50/40'
          : isBac
            ? 'border-indigo-200 hover:border-indigo-400'
            : isExternal
              ? 'border-sky-200 hover:border-sky-400'
              : 'border-emerald-200 hover:border-emerald-400'
      }`}
    >
      <CardContent className="flex h-full flex-col gap-3 pt-5">
        {/* رأس البطاقة */}
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
              locked
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/25'
                : isBac
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-700 shadow-indigo-600/25'
                  : isExternal
                    ? 'bg-gradient-to-br from-sky-600 to-blue-700 shadow-sky-600/25'
                    : 'bg-gradient-to-br from-red-600 to-rose-700 shadow-red-600/25'
            }`}
          >
            {locked ? (
              <Lock className="h-5 w-5 text-white" />
            ) : isExternal ? (
              <Globe className="h-5 w-5 text-white" />
            ) : isBac ? (
              <GraduationCap className="h-5 w-5 text-white" />
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
                        : isExternal
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {pdf.badge}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] font-bold text-stone-400">
              {isExternal
                ? `سلسلة من منصة DzExams • تفتح في صفحة المصدر مباشرة`
                : isBac
                  ? `تجميعية بكالوريا • ${pdf.pages} صفحات • تمارين حسب الدورات`
                  : `PDF من أرشيف الأستاذ • ${pdf.pages} صفحات • الحلول النموذجية والتمثيلات البيانية داخل الملف`}
            </p>
          </div>
        </div>

        {/* الوصف */}
        <p className="flex-1 text-xs leading-5 text-stone-600">{pdf.description}</p>

        {/* المصدر للملفات الخارجية أو التجميعيات */}
        {pdf.source && (
          <p className="text-[10px] font-bold text-stone-400">{pdf.source}</p>
        )}

        {/* الأزرار */}
        {locked ? (
          <Button
            onClick={onSubscribe}
            className="w-full gap-2 bg-gradient-to-l from-amber-600 to-amber-500 font-black text-white hover:from-amber-700 hover:to-amber-600"
          >
            <Crown className="h-4 w-4" />
            اشترك لفتح السلسلة كاملة
          </Button>
        ) : isExternal ? (
          <Button
            asChild
            className="w-full gap-1.5 bg-gradient-to-l from-sky-700 to-blue-700 font-black text-white hover:from-sky-800 hover:to-blue-800"
          >
            <a href={pdf.externalUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              فتح السلسلة في DzExams
            </a>
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              className="gap-1.5 bg-gradient-to-l from-emerald-700 to-teal-700 font-black text-white hover:from-emerald-800 hover:to-teal-800"
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
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  badge,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  tone: 'red' | 'indigo' | 'sky';
}) {
  const tones = {
    red: 'border-red-200 bg-gradient-to-l from-red-50 via-white to-amber-50',
    indigo: 'border-indigo-200 bg-gradient-to-l from-indigo-50 via-white to-violet-50',
    sky: 'border-sky-200 bg-gradient-to-l from-sky-50 via-white to-blue-50',
  } as const;
  const iconBg = {
    red: 'from-red-600 to-rose-700 shadow-red-600/25',
    indigo: 'from-indigo-600 to-violet-700 shadow-indigo-600/25',
    sky: 'from-sky-600 to-blue-700 shadow-sky-600/25',
  } as const;
  const badgeBg = {
    red: 'bg-red-600',
    indigo: 'bg-indigo-600',
    sky: 'bg-sky-600',
  } as const;

  return (
    <div className={`rounded-2xl border-2 p-4 sm:p-5 ${tones[tone]}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${iconBg[tone]}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-stone-900 sm:text-xl">{title}</h3>
          <p className="text-xs font-bold text-stone-500 sm:text-sm">{subtitle}</p>
        </div>
        {badge && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black text-white shadow-md ${badgeBg[tone]}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default function ChainPdfSection({
  year,
  isPremium,
  onSubscribe,
}: {
  year: YearId;
  isPremium: boolean;
  onSubscribe?: () => void;
}) {
  const pdfs = chainPdfsOfYear(year);

  if (pdfs.length === 0) return null;

  const adli = pdfs.filter((p) => (p.group ?? 'adli') === 'adli');
  const bac = pdfs.filter((p) => p.group === 'bac');
  const dzexams = pdfs.filter((p) => p.group === 'dzexams');

  const adliFree = adli.filter((p) => !p.premium).length;
  const adliPremium = adli.length - adliFree;
  const bacFree = bac.filter((p) => !p.premium).length;
  const bacPremium = bac.length - bacFree;
  const dzFree = dzexams.filter((p) => !p.premium).length;
  const dzPremium = dzexams.length - dzFree;

  return (
    <section className="space-y-4">
      {/* 1) السلاسل الأصلية — أرشيف الأستاذ */}
      {adli.length > 0 && (
        <>
          <SectionHeader
            tone="red"
            icon={<FileText className="h-6 w-6 text-white" />}
            title="السلاسل الأصلية PDF — من أرشيف الأستاذ عدلي اسعد"
            subtitle={`الملفات الأصلية الموقّعة: ${adli.length} سلاسل (${adliFree} مفتوحة + ${adliPremium} مميزة) — كل ملف يحتوي التمارين مع الحلول النموذجية، ومرفق بتمثيلات بيانية دقيقة للتمارين التي تتطلبها`}
            badge="حصري"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adli.map((pdf) => (
              <ChainPdfCard
                key={pdf.id}
                pdf={pdf}
                isPremium={isPremium}
                onSubscribe={onSubscribe}
              />
            ))}
          </div>
        </>
      )}

      {/* 2) تجميعيات البكالوريا */}
      {bac.length > 0 && (
        <>
          <SectionHeader
            tone="indigo"
            icon={<GraduationCap className="h-6 w-6 text-white" />}
            title="تجميعيات تمارين البكالوريا (2008–2026) — شعبة علوم تجريبية"
            subtitle={`كل تمارين البكالوريا مرتبة حسب المحاور والدورات: ${bac.length} تجميعيات (${bacFree} مفتوحة${bacPremium > 0 ? ` + ${bacPremium} مميزة` : ''}) — ملف مخصص لكل محور لتدريب مكثف على أنماط البكالوريا`}
            badge="مجانية"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bac.map((pdf) => (
              <ChainPdfCard
                key={pdf.id}
                pdf={pdf}
                isPremium={isPremium}
                onSubscribe={onSubscribe}
              />
            ))}
          </div>
        </>
      )}

      {/* 3) سلاسل DzExams */}
      {dzexams.length > 0 && (
        <>
          <SectionHeader
            tone="sky"
            icon={<Globe className="h-6 w-6 text-white" />}
            title="سلاسل تمارين إضافية — منتقاة من منصة DzExams"
            subtitle={`${dzexams.length} سلاسل (${dzFree} مفتوحة${dzPremium > 0 ? ` + ${dzPremium} مميزة` : ''}) لكل محاور السنة — مع الحلول، تفتح مباشرة في صفحة المصدر للتحميل المجاني`}
            badge="مجانية"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dzexams.map((pdf) => (
              <ChainPdfCard
                key={pdf.id}
                pdf={pdf}
                isPremium={isPremium}
                onSubscribe={onSubscribe}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
