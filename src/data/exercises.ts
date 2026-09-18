import type { Exercise } from './chapters';
import { chaptersOfYear } from './chapters';
import type { YearId } from './curriculum';
import { exercisesA } from './exercises-a';
import { exercisesB } from './exercises-b';
import { exercisesC } from './exercises-c';
import { exercisesD } from './exercises-d';
import { exercisesE } from './exercises-e';

/** كل تمارين المنصة: السنة الأولى ثم الثانية ثم الثالثة */
export const EXERCISES: Exercise[] = [
  ...exercisesD,
  ...exercisesE,
  ...exercisesA,
  ...exercisesB,
  ...exercisesC,
];

export const EXERCISE_COUNT = EXERCISES.length;

/** تمارين سنة دراسية معينة (انطلاقاً من فصول تلك السنة) */
export function exercisesOfYear(year: YearId): Exercise[] {
  const ids = new Set(chaptersOfYear(year).map((c) => c.id));
  return EXERCISES.filter((e) => ids.has(e.chapterId));
}

export function exercisesByChapter(chapterId: string): Exercise[] {
  return EXERCISES.filter((e) => e.chapterId === chapterId);
}

export function exercisesByStream(stream: string): Exercise[] {
  return EXERCISES.filter((e) => e.streams.includes(stream as never));
}
