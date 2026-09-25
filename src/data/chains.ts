// ============================================================
//  سلاسل الأستاذ عدلي اسعد مع الحلول النموذجية — التجميع والأدوات
// ============================================================

import { CHAPTERS } from "./chapters";
import type { Chapter, } from "./chapters";
import { CHAINS_A, type Chain, type ChainExercise } from "./chains-a";
import { CHAINS_B } from "./chains-b";

export type { Chain, ChainExercise };

/** كل سلاسل المنصة — من الأستاذ عدلي اسعد */
export const CHAINS: Chain[] = [...CHAINS_A, ...CHAINS_B];

export const CHAINS_COUNT = CHAINS.length;
export const CHAIN_EXERCISES_COUNT = CHAINS.reduce((n, c) => n + c.exercises.length, 0);

/** سلاسل سنة دراسية معينة */
export function chainsOfYear(year: Chain["year"]): Chain[] {
  return CHAINS.filter((c) => c.year === year);
}

/** فصل المنهاج المرتبط بالسلسلة (إن وُجد) */
export function chainChapter(chain: Chain): Chapter | undefined {
  return CHAPTERS.find((ch) => ch.id === chain.chapterId);
}
