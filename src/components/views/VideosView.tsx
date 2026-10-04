'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpenCheck, ExternalLink, Info, MonitorPlay, Play, ShieldCheck, UserRound } from 'lucide-react';
import { VIDEO_AXES, VIDEO_TOTAL, type VideoLevel } from '@/data/video-lessons';

/** الشرح بالفيديو — دروس منتقاة من قنوات يوتيوب الجزائرية تُضمَّن عبر المشغل الرسمي */
export default function VideosView({ year, onOpenBank }: { year: string; onOpenBank?: () => void }) {
  const [axisId, setAxisId] = React.useState<string>('all');
  const [playing, setPlaying] = React.useState<string | null>(null);

  const axes = React.useMemo(
    () => VIDEO_AXES.filter((a) => axisId === 'all' || a.id === axisId),
    [axisId]
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* الترويسة */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20">
          <MonitorPlay className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">الشرح بالفيديو</h1>
        <p className="text-sm text-stone-500 max-w-2xl mx-auto leading-relaxed">
          {VIDEO_TOTAL} درساً مرئياً منتقى بعناية من أفضل القنوات الجزائرية المتخصصة في رياضيات
          الثانوي — مرتبة حسب المحاور ومواءمة مع فصول المنصة، لتشاهد الشرح ثم تدرب فوراً في بنك
          التمارين.
        </p>
      </div>

      {/* ملاحظة المستوى */}
      {year === '1as' || year === '2as' ? (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="flex items-start gap-2 py-3 text-sm text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            أغلب الدروس الحالية مخصصة للسنة الثالثة ثانوي — دروس مستواك قيد الإضافة، ويمكنك
            الاستفادة من دروس «الاشتقاقية» و«الدوال» المشتركة في المنهاج.
          </CardContent>
        </Card>
      ) : null}

      {/* ملاحظة الحقوق */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="flex items-start gap-2 py-3 text-xs text-emerald-900 leading-relaxed">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          المقاطع تُشغَّل عبر مشغل يوتيوب الرسمي فقط ولا تُخزَّن في المنصة — تبقى كل المقطع ملكاً
          لقناته، ونُسبت أسماء القنوات على كل درس. لصاحب قناة يرغب في تعديل أو إزالة مقطعه: يكفي
          مراسلتنا وسيُنفَّذ فوراً.
        </CardContent>
      </Card>

      {/* مرشح المحاور */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterChip active={axisId === 'all'} onClick={() => setAxisId('all')}>
          كل المحاور
        </FilterChip>
        {VIDEO_AXES.map((a) => (
          <FilterChip key={a.id} active={axisId === a.id} onClick={() => setAxisId(a.id)}>
            {a.label}
            <span className="mr-1 opacity-60">{a.lessons.length}</span>
          </FilterChip>
        ))}
      </div>

      {/* الدروس حسب المحور */}
      {axes.map((axis) => (
        <section key={axis.id} className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-black text-stone-800">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            {axis.label}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {axis.lessons.map((v) => {
              const isPlaying = playing === v.ytId;
              return (
                <Card key={v.ytId} className="overflow-hidden transition-shadow hover:shadow-md">
                  {/* المشغل / الصورة المصغرة */}
                  <div className="relative aspect-video bg-stone-900">
                    {isPlaying ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${v.ytId}?autoplay=1&rel=0&modestbranding=1&hl=ar`}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlaying(v.ytId)}
                        className="group absolute inset-0 h-full w-full"
                        aria-label={`تشغيل: ${v.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${v.ytId}/hqdefault.jpg`}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-transform group-hover:scale-110">
                            <Play className="h-7 w-7 fill-white" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>

                  {/* بيانات الدرس */}
                  <CardContent className="space-y-2 pt-3">
                    <div className="font-bold leading-snug text-stone-800">{v.title}</div>
                    <p className="text-xs text-stone-500 leading-relaxed">{v.focus}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="gap-1 border-stone-300 text-stone-600">
                          <UserRound className="h-3 w-3" />
                          {v.channel}
                        </Badge>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          ثالثة ثانوي
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <a
                          href={`https://www.youtube.com/watch?v=${v.ytId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          يوتيوب
                        </a>
                        {onOpenBank && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={onOpenBank}
                            className="h-7 gap-1 px-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            <BookOpenCheck className="h-3.5 w-3.5" />
                            تدرّب الآن
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}

      {/* خاتمة تحفيزية */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="text-sm font-bold text-stone-700">شاهدت الشرح؟ الآن الدور عليك</p>
          <p className="max-w-md text-xs text-stone-500">
            الفيديو يبني الفهم — والتمرين يبني العلامة. انتقل مباشرة إلى بنك التمارين وأنجز
            تمارين المحور نفسه بحلول نموذجية خطوة بخطوة.
          </p>
          {onOpenBank && (
            <Button
              onClick={onOpenBank}
              className="mt-1 gap-2 bg-emerald-700 hover:bg-emerald-800"
            >
              <BookOpenCheck className="h-4 w-4" />
              فتح بنك التمارين
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
        active
          ? 'bg-emerald-700 text-white shadow-sm'
          : 'border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-700'
      }`}
    >
      {children}
    </button>
  );
}
