'use client';

import { TrendingUp, Zap, ArrowUpRight, ListOrdered, Pi, Calculator, Dices, Orbit, Shuffle, Boxes, Sigma, Move3d, Percent, Table } from 'lucide-react';
import type { Difficulty } from '@/data/chapters';
import type { StreamId } from '@/data/curriculum';
import { getStream } from '@/data/curriculum';
import { IconTile, TILE_GRADIENTS } from '@/components/icon-tile';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Zap,
  ArrowUpRight,
  ListOrdered,
  Pi,
  Calculator,
  Dices,
  Orbit,
  Shuffle,
  Boxes,
  Sigma,
  Move3d,
  Percent,
  Table,
};

export function ChapterIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Sigma;
  return <Cmp className={className} />;
}

export const THEME_STYLES: Record<string, { bg: string; text: string; ring: string; soft: string }> = {
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-700', ring: 'ring-emerald-200', soft: 'bg-emerald-50' },
  teal: { bg: 'bg-teal-600', text: 'text-teal-700', ring: 'ring-teal-200', soft: 'bg-teal-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-700', ring: 'ring-amber-200', soft: 'bg-amber-50' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-700', ring: 'ring-orange-200', soft: 'bg-orange-50' },
  violet: { bg: 'bg-violet-600', text: 'text-violet-700', ring: 'ring-violet-200', soft: 'bg-violet-50' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-700', ring: 'ring-rose-200', soft: 'bg-rose-50' },
  slate: { bg: 'bg-slate-600', text: 'text-slate-700', ring: 'ring-slate-200', soft: 'bg-slate-50' },
  green: { bg: 'bg-green-600', text: 'text-green-700', ring: 'ring-green-200', soft: 'bg-green-50' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-700', ring: 'ring-purple-200', soft: 'bg-purple-50' },
  fuchsia: { bg: 'bg-fuchsia-600', text: 'text-fuchsia-700', ring: 'ring-fuchsia-200', soft: 'bg-fuchsia-50' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-700', ring: 'ring-pink-200', soft: 'bg-pink-50' },
};

export const DIFF_STYLES: Record<Difficulty, string> = {
  'سهل': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'متوسط': 'bg-amber-100 text-amber-800 border-amber-200',
  'صعب': 'bg-rose-100 text-rose-800 border-rose-200',
  'بكالوريا': 'bg-violet-100 text-violet-800 border-violet-200',
};

export function StreamChip({ id, className = '' }: { id: StreamId; className?: string }) {
  const s = getStream(id);
  const yearSuffix = s.year === '1as' ? ' • أولى' : s.year === '2as' ? ' • ثانية' : '';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.color} ${className}`}>
      {s.shortName}
      {yearSuffix && <span className="mr-1 font-bold opacity-70">{yearSuffix}</span>}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="relative mb-8">
      {/* علامة مائية رياضية — لمسة هوية خلف العنوان */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-0 hidden select-none font-serif text-7xl font-black text-emerald-900/[0.05] sm:block"
      >
        ∑
      </span>
      {eyebrow && (
        <span className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-black text-emerald-800 ring-1 ring-emerald-200/70">
          <span className="h-1.5 w-1.5 rotate-45 rounded-[2px] bg-amber-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="relative text-2xl font-black text-stone-900 sm:text-3xl">{title}</h2>
      {/* شريط هوية المنصة: تدرج زمردية ← فيروز ← عنبري + فاصل نقاطي */}
      <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-1.5 w-24 rounded-full bg-gradient-to-l from-emerald-600 via-teal-500 to-amber-400" />
        <span className="h-1.5 w-3 rounded-full bg-amber-400/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      </div>
      {sub && <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">{sub}</p>}
    </div>
  );
}

/** تدرّج IconTile الموافق لثيم الفصل (THEME_STYLES) */
export function themeTileColor(theme: string): string {
  return theme in TILE_GRADIENTS ? theme : 'emerald';
}

/** أيقونة فصل داخل بلاطة مميزة — بديل الحاوية اليدوية القديمة */
export function ChapterIconTile({
  name,
  theme,
  size = 'md',
  className = '',
}: {
  name: string;
  theme: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Sigma;
  return <IconTile icon={Cmp} color={themeTileColor(theme)} size={size} className={className} />;
}
