import type { Exercise } from './chapters';
import { exercisesA } from './exercises-a';
import { exercisesB } from './exercises-b';
import { exercisesC } from './exercises-c';

export const EXERCISES: Exercise[] = [...exercisesA, ...exercisesB, ...exercisesC];

export function exercisesByChapter(chapterId: string): Exercise[] {
  return EXERCISES.filter((e) => e.chapterId === chapterId);
}

export function exercisesByStream(stream: string): Exercise[] {
  return EXERCISES.filter((e) => e.streams.includes(stream as never));
}

export const EXERCISE_COUNT = EXERCISES.length;
