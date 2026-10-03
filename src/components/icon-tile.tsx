'use client';

import React from 'react';

/* ============================================================
   نظام أيقونات المنصة المميز — IconTile
   أيقونة داخل بلاطة متعددة الطبقات:
   تدرّج لوني + لمعة داخلية علوية + هالة ضوئية + وميض زاويّ اختياري
   — بلا صور خارجية، أداء ممتاز، هوية موحّدة في كل المنصة.
   ============================================================ */

/** بلاطات التدرّج الجاهزة — لكل قسم من أقسام المنصة هويته */
export const TILE_GRADIENTS: Record<string, { g: string; glow: string }> = {
  emerald: { g: 'from-emerald-500 via-emerald-600 to-teal-700', glow: 'shadow-emerald-600/30' },
  teal: { g: 'from-teal-500 via-teal-600 to-cyan-700', glow: 'shadow-teal-600/30' },
  amber: { g: 'from-amber-400 via-amber-500 to-orange-600', glow: 'shadow-amber-500/30' },
  orange: { g: 'from-orange-400 via-orange-500 to-red-600', glow: 'shadow-orange-500/30' },
  violet: { g: 'from-violet-500 via-violet-600 to-purple-700', glow: 'shadow-violet-600/30' },
  rose: { g: 'from-rose-500 via-rose-600 to-pink-700', glow: 'shadow-rose-600/30' },
  sky: { g: 'from-sky-500 via-sky-600 to-blue-700', glow: 'shadow-sky-600/30' },
  cyan: { g: 'from-cyan-500 via-cyan-600 to-sky-700', glow: 'shadow-cyan-600/30' },
  fuchsia: { g: 'from-fuchsia-500 via-fuchsia-600 to-purple-700', glow: 'shadow-fuchsia-600/30' },
  slate: { g: 'from-slate-500 via-slate-600 to-stone-700', glow: 'shadow-slate-600/30' },
  royal: { g: 'from-indigo-500 via-indigo-600 to-violet-700', glow: 'shadow-indigo-600/30' },
  green: { g: 'from-green-500 via-green-600 to-emerald-700', glow: 'shadow-green-600/30' },
  purple: { g: 'from-purple-500 via-purple-600 to-fuchsia-700', glow: 'shadow-purple-600/30' },
  pink: { g: 'from-pink-500 via-pink-600 to-rose-700', glow: 'shadow-pink-600/30' },
};

export type TileColor = keyof typeof TILE_GRADIENTS | string;

const SIZES: Record<string, string> = {
  xs: 'h-7 w-7 rounded-lg',
  sm: 'h-9 w-9 rounded-xl',
  md: 'h-12 w-12 rounded-2xl',
  lg: 'h-14 w-14 rounded-2xl',
  xl: 'h-16 w-16 rounded-3xl',
};
const ICON_SIZES: Record<string, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4.5 w-4.5',
  md: 'h-6 w-6',
  lg: 'h-7 w-7',
  xl: 'h-8 w-8',
};

export function IconTile({
  icon: Icon,
  color = 'emerald',
  size = 'md',
  spark = false,
  className = '',
  iconClassName = '',
}: {
  icon: React.ComponentType<{ className?: string }>;
  color?: TileColor;
  size?: keyof typeof SIZES;
  /** وميض زاويّ ذهبي — للأقسام المميزة فقط */
  spark?: boolean;
  className?: string;
  iconClassName?: string;
}) {
  const t = TILE_GRADIENTS[color] ?? TILE_GRADIENTS.emerald;
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br shadow-lg transition-transform duration-300 ${t.g} ${t.glow} ${SIZES[size]} ${className}`}
    >
      {/* لمعة داخلية — حافة علوية مضيئة */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/30" />
      {/* انعكاس علوي ناعم */}
      <span className="pointer-events-none absolute inset-x-[15%] top-[6%] h-[38%] rounded-[inherit] bg-gradient-to-b from-white/25 to-transparent blur-[1px]" />
      <Icon className={`relative text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] ${ICON_SIZES[size]} ${iconClassName}`} />
      {spark && (
        <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rotate-45 rounded-[3px] bg-gradient-to-br from-amber-200 to-amber-400 shadow-sm ring-2 ring-white" />
      )}
    </span>
  );
}

/** بلاطة مصغّرة للتنقل — تضيء بتدرّج المنصة عند التفعيل */
export function NavTile({
  icon: Icon,
  active = false,
  size = 'sm',
}: {
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  size?: keyof typeof SIZES;
}) {
  if (active) return <IconTile icon={Icon} color="emerald" size={size} iconClassName="!h-4 !w-4" />;
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-xl bg-stone-100 ring-1 ring-inset ring-stone-200/70 transition-colors group-hover:bg-emerald-50 group-hover:ring-emerald-200 ${SIZES[size]}`}
    >
      <Icon className="h-4 w-4 text-emerald-700/70" />
    </span>
  );
}

/** شعار المنصة المميز — حرف σ داخل بلاطة متدرجة مع إكليل نقاط */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-700 to-teal-800 shadow-lg shadow-emerald-700/30 ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/30" />
      <span className="pointer-events-none absolute inset-x-[15%] top-[6%] h-[38%] rounded-[inherit] bg-gradient-to-b from-white/25 to-transparent blur-[1px]" />
      <svg viewBox="0 0 24 24" fill="none" className="relative h-3/5 w-3/5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        <path d="M18 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="19" cy="17.5" r="1.6" fill="#fbbf24" />
      </svg>
    </span>
  );
}
