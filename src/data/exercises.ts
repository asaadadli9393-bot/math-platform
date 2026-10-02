import type { Exercise } from './chapters';
import { chaptersOfYear } from './chapters';
import type { YearId } from './curriculum';
import { exercisesA } from './exercises-a';
import { exercisesB } from './exercises-b';
import { exercisesC } from './exercises-c';
import { exercisesD } from './exercises-d';
import { exercisesE } from './exercises-e';
import { exercisesF } from './exercises-f';
import { exercisesG } from './exercises-g';
import { exercisesH } from './exercises-h';
import { exercisesOld } from './exercises-old';
import { exercisesX } from './exercises-x';
import { exercisesNew1AsA } from './exercises-new-1as-a';
import { exercisesNew1AsB } from './exercises-new-1as-b';
import { exercisesNew2AsA } from './exercises-new-2as-a';
import { exercisesNew2AsB } from './exercises-new-2as-b';
import { exercisesNew2AsC } from './exercises-new-2as-c';

/** كل تمارين المنصة: السنة الأولى ثم الثانية ثم الثالثة */
export const EXERCISES: Exercise[] = [
  ...exercisesNew1AsA,
  ...exercisesNew1AsB,
  ...exercisesNew2AsA,
  ...exercisesNew2AsB,
  ...exercisesNew2AsC,
  ...exercisesD,
  ...exercisesG,
  ...exercisesE,
  ...exercisesF,
  ...exercisesA,
  ...exercisesB,
  ...exercisesC,
  ...exercisesH,
  ...exercisesOld,
  ...exercisesX,
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
