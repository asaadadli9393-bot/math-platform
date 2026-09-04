"use client";

import * as React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================
//  مخزن حالة الطالب — تتبع التقدم محلياً (مع إمكانية المزامنة)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

export interface AttemptRecord {
  exerciseId: string;
  exerciseTitle: string;
  unitSlug: string;
  chapterSlug: string;
  difficulty: string;
  selfRated: boolean;
  timeSpentSec: number;
  score: number | null;
  attemptedAt: string;
}

export interface QuizAttemptRecord {
  quizId: string;
  quizTitle: string;
  score: number;
  correctCount: number;
  totalCount: number;
  answers: number[];
  timeSpentSec: number;
  attemptedAt: string;
}

export interface UnitProgressLocal {
  unitSlug: string;
  completion: number;
  exercisesDone: number;
  exercisesTotal: number;
  averageScore: number;
  lastVisitedAt: string | null;
}

export interface UserProfile {
  name: string;
  stream: "EXPERIMENTAL_SCIENCES" | "MATHEMATICS" | "TECHNICAL_MATH";
  grade: string;
  city: string;
  onboarded: boolean;
}

interface StudentStore {
  profile: UserProfile | null;
  attempts: AttemptRecord[];
  quizAttempts: QuizAttemptRecord[];
  unitProgress: Record<string, UnitProgressLocal>;
  lastVisitedUnit: string | null;
  favoriteUnits: string[];

  setProfile: (p: UserProfile) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  addAttempt: (a: AttemptRecord) => void;
  addQuizAttempt: (q: QuizAttemptRecord) => void;
  setUnitProgress: (slug: string, p: Partial<UnitProgressLocal>) => void;
  setLastVisitedUnit: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
  resetProgress: () => void;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      profile: null,
      attempts: [],
      quizAttempts: [],
      unitProgress: {},
      lastVisitedUnit: null,
      favoriteUnits: [],

      setProfile: (p) => set({ profile: p }),

      updateProfile: (p) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...p }
            : { name: "", stream: "EXPERIMENTAL_SCIENCES", grade: "السنة الثالثة ثانوي", city: "", onboarded: false, ...p } as UserProfile,
        })),

      addAttempt: (a) =>
        set((state) => {
          const attempts = [a, ...state.attempts].slice(0, 100); // آخر 100 محاولة
          return { attempts };
        }),

      addQuizAttempt: (q) =>
        set((state) => ({
          quizAttempts: [q, ...state.quizAttempts].slice(0, 50),
        })),

      setUnitProgress: (slug, p) =>
        set((state) => {
          const existing = state.unitProgress[slug] || {
            unitSlug: slug,
            completion: 0,
            exercisesDone: 0,
            exercisesTotal: 0,
            averageScore: 0,
            lastVisitedAt: null,
          };
          return {
            unitProgress: {
              ...state.unitProgress,
              [slug]: { ...existing, ...p, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      setLastVisitedUnit: (slug) => set({ lastVisitedUnit: slug }),

      toggleFavorite: (slug) =>
        set((state) => {
          const favorites = state.favoriteUnits.includes(slug)
            ? state.favoriteUnits.filter((s) => s !== slug)
            : [...state.favoriteUnits, slug];
          return { favoriteUnits: favorites };
        }),

      resetProgress: () =>
        set({
          attempts: [],
          quizAttempts: [],
          unitProgress: {},
          lastVisitedUnit: null,
        }),
    }),
    {
      name: "student-storage",
      version: 1,
    }
  )
);

// ============================================================
//  محددات مفيدة (selectors)
// ============================================================

export function useExerciseAttempts(exerciseId: string) {
  return useStudentStore((state) =>
    state.attempts.filter((a) => a.exerciseId === exerciseId)
  );
}

export function useUnitProgress(unitSlug: string) {
  return useStudentStore((state) => state.unitProgress[unitSlug]);
}

export function useOverallStats() {
  const attempts = useStudentStore((state) => state.attempts);
  const quizAttempts = useStudentStore((state) => state.quizAttempts);
  const unitProgress = useStudentStore((state) => state.unitProgress);
  return React.useMemo(() => {
    const totalAttempts = attempts.length;
    const successful = attempts.filter((a) => a.selfRated).length;
    const quizScores = quizAttempts.map((q) => q.score);
    const avgQuizScore =
      quizScores.length > 0
        ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
        : 0;
    const unitsStarted = Object.keys(unitProgress).length;
    return {
      totalAttempts,
      successful,
      successRate: totalAttempts > 0 ? (successful / totalAttempts) * 100 : 0,
      quizCount: quizAttempts.length,
      avgQuizScore,
      unitsStarted,
    };
  }, [attempts, quizAttempts, unitProgress]);
}
