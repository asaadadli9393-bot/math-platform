'use client';

import { TrendingUp, Zap, ArrowUpRight, ListOrdered, Pi, Calculator, Dices, Orbit, Shuffle, Boxes, Sigma } from 'lucide-react';
import type { Difficulty } from '@/data/chapters';
import type { StreamId } from '@/data/curriculum';
import { getStream } from '@/data/curriculum';

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
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.color} ${className}`}>
      {s.shortName}
    </span>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <span className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">{title}</h2>
      {sub && <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">{sub}</p>}
    </div>
  );
}
