'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Film,
  Lightbulb,
  Lock,
  Mail,
  MessageSquareHeart,
  Pause,
  Play,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { RichText } from '@/lib/tex';
import { ANIME_STORIES, ANIME_TEASERS, type AnimeStory } from '@/data/anime-stories';

const LEVEL_BADGE: Record<string, string> = {
  '1as': 'السنة الأولى ثانوي',
  '2as': 'السنة الثانية ثانوي',
  '3as': 'السنة الثالثة ثانوي',
  all: 'كل المستويات',
};
import { PROFESSOR_EMAIL } from '@/lib/subscription';

/** زمن المشهد في التشغيل التلقائي (ثانية) */
const AUTO_MS = 13000;

/* ============================================================
   أنمي الرياضيات — قصص تفاعلية حصرية بأسلوب الأنمي:
   مشاهد مرسومة + سرد + الرياضيات الحقيقية بـ KaTeX.
   القصة الأولى مجانية — والقادم مُعلَّق بمسار الاشتراك.
   ============================================================ */
export default function AnimeView({
  year,
  onOpenChapter,
  onOpenBank,
}: {
  year: string;
  onOpenChapter?: (chapterId: string) => void;
  onOpenBank?: (chapterId?: string) => void;
}) {
  const [playingStory, setPlayingStory] = React.useState<AnimeStory | null>(null);

  if (playingStory) {
    return (
      <StoryPlayer
        story={playingStory}
        year={year}
        onExit={() => setPlayingStory(null)}
        onOpenChapter={onOpenChapter}
        onOpenBank={onOpenBank}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* الترويسة */}
      <div className="space-y-2 pt-2 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 shadow-lg shadow-fuchsia-500/25">
          <Wand2 className="h-7 w-7 text-white" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">أنمي الرياضيات</h1>
          <Badge className="bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-100">جديد</Badge>
        </div>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-500">
          قصص تفاعلية قصيرة بأسلوب الأنمي تحوّل أصعب فصول المنهاج إلى مغامرة: مشاهد مرسومة، سرد
          مشوّق، والرياضيات الحقيقية تظهر داخل الحكاية كما ستستعملها في الامتحان. قسم حصري على
          المنصة — قصة لكل مستوى، مجانية للجميع.
        </p>
      </div>

      {/* تنبيه المستوى — فقط إن لم توجد قصة لمستواه بعد */}
      {!ANIME_STORIES.some((st) => st.level === year) ? (
        <Card className="border-amber-200 bg-amber-50/60">
          <CardContent className="flex items-start gap-2 py-3 text-sm text-amber-900">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
            قصص مستواك قيد الإعداد حالياً — ويمكنك مشاهدة قصص المستويات الأخرى لتفهم الفكرة قبل
            أن يأتي درسها.
          </CardContent>
        </Card>
      ) : null}

      {/* القصص المتاحة — قصة مستواك أولاً */}
      {[...ANIME_STORIES]
        .sort((a, b) => (a.level === year ? -1 : 0) - (b.level === year ? -1 : 0))
        .map((story) => (
          <StoryCard key={story.id} story={story} onPlay={() => setPlayingStory(story)} />
        ))}

      {/* قيد الإنتاج — تشويق صادق */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-black text-stone-800">
          <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.8)]" />
          قيد الإعداد — عوالم قادمة
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ANIME_TEASERS.map((t) => (
            <Card key={t.id} className="border-dashed bg-stone-50/60">
              <CardContent className="flex items-start gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-200 text-stone-400">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-black text-stone-600">
                    {t.title}
                    <Badge variant="outline" className="border-stone-300 text-[10px] text-stone-400">
                      قريباً
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{t.tagline}</p>
                  <p className="mt-1 text-[11px] font-bold text-stone-400">{t.topic}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* رأيك يصنع القصة القادمة */}
      <Card className="border-fuchsia-200 bg-fuchsia-50/40">
        <CardContent className="flex flex-col items-center gap-2 py-5 text-center">
          <MessageSquareHeart className="h-5 w-5 text-fuchsia-500" />
          <p className="text-sm font-black text-stone-700">قسم جديد تجريبي — رأيك يصنع القصة القادمة</p>
          <p className="max-w-md text-xs leading-relaxed text-stone-500">
            أعجبتك القصة؟ أرسل رأيك واقتراح الفصل الذي تريد أن يتحول إلى مغامرة أنمي بعدها — كل
            اقتراح يُقرأ ويُؤخذ في الحسبان.
          </p>
          <a
            href={`mailto:${PROFESSOR_EMAIL}?subject=${encodeURIComponent('رأيي في قسم أنمي الرياضيات + اقتراح الفصل القادم')}`}
            className="mt-1 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-extrabold text-white shadow-md shadow-fuchsia-600/25 transition hover:bg-fuchsia-700"
          >
            <Mail className="h-4 w-4" />
            شارك رأيك واقتراحك
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============ بطاقة القصة في القائمة ============ */
function StoryCard({ story, onPlay }: { story: AnimeStory; onPlay: () => void }) {
  return (
    <Card className="group overflow-hidden border-2 border-fuchsia-200/60 shadow-md shadow-fuchsia-500/5 transition-shadow hover:shadow-lg hover:shadow-fuchsia-500/15">
      <button type="button" onClick={onPlay} className="relative block w-full" aria-label={`مشاهدة: ${story.title}`}>
        <div className="relative aspect-video bg-stone-900">
          <img
            src={story.cover}
            alt={story.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-2xl shadow-fuchsia-900/40 transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 fill-white" />
            </span>
          </span>
          <span className="absolute bottom-3 right-3 flex flex-wrap items-center gap-1.5">
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">مجاني</Badge>
            <Badge className="bg-black/60 text-white backdrop-blur hover:bg-black/60">
              <Film className="mr-1 h-3 w-3" />
              {story.scenes.length} مشاهد
            </Badge>
            <Badge className="bg-black/60 text-white backdrop-blur hover:bg-black/60">
              <Clock3 className="mr-1 h-3 w-3" />
              ≈ {story.minutes} د
            </Badge>
          </span>
        </div>
      </button>
      <CardContent className="space-y-1.5 pt-3">
        <h3 className="text-lg font-black text-stone-800">{story.title}</h3>
        <p className="text-sm leading-relaxed text-stone-500">{story.tagline}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
            {LEVEL_BADGE[story.level] ?? story.level}
          </Badge>
          <Button
            onClick={onPlay}
            size="sm"
            className="gap-2 bg-gradient-to-l from-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-600/25 hover:from-fuchsia-700 hover:to-violet-700"
          >
            <Play className="h-4 w-4 fill-white" />
            ابدأ المشاهدة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============ مشغّل القصة ============ */
function StoryPlayer({
  story,
  year,
  onExit,
  onOpenChapter,
  onOpenBank,
}: {
  story: AnimeStory;
  year: string;
  onExit: () => void;
  onOpenChapter?: (chapterId: string) => void;
  onOpenBank?: (chapterId?: string) => void;
  }) {
  const [index, setIndex] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [auto, setAuto] = React.useState(false);
  const scene = story.scenes[index];
  const total = story.scenes.length;

  const go = React.useCallback(
    (dir: 1 | -1) => {
      setFinished(false);
      setIndex((i) => {
        const next = i + dir;
        if (next >= total) {
          setFinished(true);
          return i;
        }
        return Math.max(0, next);
      });
    },
    [total],
  );

  const jump = (i: number) => {
    setFinished(false);
    setIndex(Math.max(0, Math.min(total - 1, i)));
  };

  // لوحة المفاتيح: في RTL السهم الأيسر = التالي
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(1);
      if (e.key === 'ArrowRight') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // التشغيل التلقائي
  React.useEffect(() => {
    if (!auto || finished) return;
    const t = setTimeout(() => go(1), AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, finished, index, go]);

  // تحميل مشاهد القصة مسبقاً لانتقال سلس
  React.useEffect(() => {
    story.scenes.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, [story]);

  /* ---------- شاشة الخاتمة ---------- */
  if (finished) {
    return (
      <div className="mx-auto max-w-3xl space-y-5 pt-2">
        <Card className="overflow-hidden border-2 border-amber-200/70 bg-gradient-to-b from-amber-50/70 to-white">
          <CardContent className="space-y-4 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-stone-900">انتهت الحكاية… لكن الدرس بقى</h2>
            <p className="text-sm text-stone-500">
              «{story.title}» — هذه هي الخلاصة الحقيقية التي تحملها معك إلى التمرين والامتحان:
            </p>
            <ul className="mx-auto max-w-xl space-y-2.5 text-right">
              {story.takeaways.map((t) => (
                <li key={t} className="flex items-start gap-2 rounded-xl bg-white/80 p-3 text-sm font-bold text-stone-700 ring-1 ring-stone-100">
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                  <RichText text={t} />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {story.chapterId && onOpenChapter && (
                <Button onClick={() => onOpenChapter(story.chapterId!)} className="gap-2 bg-emerald-700 hover:bg-emerald-800">
                  <BookOpenCheck className="h-4 w-4" />
                  افتح درس الفصل الكامل
                </Button>
              )}
              {onOpenBank && (
                <Button onClick={() => onOpenBank(story.chapterId)} variant="outline" className="gap-2 border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                  تدرّب في بنك التمارين
                </Button>
              )}
              <Button
                onClick={() => {
                  jump(0);
                }}
                variant="ghost"
                className="gap-2 text-stone-500"
              >
                <Play className="h-4 w-4" />
                إعادة المشاهدة
              </Button>
              <Button onClick={onExit} variant="ghost" className="gap-2 text-stone-500">
                <ArrowRight className="h-4 w-4" />
                عودة للقسم
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------- مشغّل المشاهد ---------- */
  return (
    <div className="mx-auto max-w-3xl space-y-4 pt-2">
      {/* الشريط العلوي */}
      <div className="flex items-center justify-between gap-2">
        <Button onClick={onExit} variant="ghost" size="sm" className="gap-1.5 text-stone-500 hover:text-stone-800">
          <ArrowRight className="h-4 w-4" />
          القسم
        </Button>
        <div className="min-w-0 truncate text-sm font-black text-stone-700">{story.title}</div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            onClick={() => setAuto((a) => !a)}
            variant="ghost"
            size="sm"
            title={auto ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي'}
            className={`gap-1.5 px-2 ${auto ? 'bg-fuchsia-50 text-fuchsia-700' : 'text-stone-400 hover:text-stone-700'}`}
          >
            {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="hidden sm:inline">تلقائي</span>
          </Button>
        </div>
      </div>

      {/* المشهد */}
      <div className="overflow-hidden rounded-2xl bg-stone-900 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/10">
        <div className="relative aspect-video">
          <img
            key={scene.image}
            src={scene.image}
            alt={scene.title}
            className="kenburns absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <span className="rounded-full bg-black/55 px-3 py-1 text-[11px] font-black text-white backdrop-blur">
              {scene.title}
            </span>
          </div>
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-fuchsia-600/85 px-3 py-1 text-[11px] font-black text-white backdrop-blur">
              {index + 1} / {total}
            </span>
          </div>
          {scene.math ? (
            <div className="fade-up absolute inset-x-3 bottom-3 sm:inset-x-6" key={`math-${scene.id}`}>
              <div className="mx-auto max-w-lg rounded-2xl bg-white/92 p-3 shadow-2xl shadow-black/30 backdrop-blur sm:p-4">
                <div dir="ltr" className="overflow-x-auto text-center text-[15px] leading-relaxed sm:text-lg">
                  <RichText text={`$$${scene.math}$$`} />
                </div>
                {scene.mathCaption && (
                  <p className="mt-1.5 text-center text-[11px] font-bold leading-relaxed text-stone-500">
                    {scene.mathCaption}
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* السرد */}
        <div className="fade-up bg-stone-900 p-4 sm:p-5" key={`narr-${scene.id}`}>
          <div className="mb-3 flex items-center gap-1.5">
            {[...Array(total)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jump(i)}
                aria-label={`المشهد ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-7 bg-fuchsia-400' : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <p className="text-[15px] leading-8 text-stone-100 sm:text-base">
            <RichText text={scene.narration} />
          </p>
        </div>
      </div>

      {/* هل تعلم؟ */}
      {scene.fact ? (
        <Card className="fade-up border-violet-200 bg-violet-50/60" key={`fact-${scene.id}`}>
          <CardContent className="flex items-start gap-2.5 py-3.5 text-sm leading-relaxed text-violet-950">
            <Lightbulb className="mt-0.5 h-4.5 w-4.5 shrink-0 text-violet-500" />
            <span>{scene.fact}</span>
          </CardContent>
        </Card>
      ) : null}

      {/* أزرار التنقل */}
      <div className="flex items-center justify-between gap-3">
        <Button
          onClick={() => go(-1)}
          disabled={index === 0}
          variant="outline"
          className="gap-1.5 border-stone-200 text-stone-600 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
          السابق
        </Button>
        <span className="hidden text-xs font-bold text-stone-400 sm:block">
          استعمل أسهم لوحة المفاتيح للتنقل
        </span>
        <Button
          onClick={() => go(1)}
          className="gap-1.5 bg-gradient-to-l from-fuchsia-600 to-violet-600 text-white shadow-md shadow-fuchsia-600/25 hover:from-fuchsia-700 hover:to-violet-700"
        >
          {index === total - 1 ? 'الخاتمة' : 'التالي'}
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
