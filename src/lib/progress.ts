'use client';

import { useSyncExternalStore } from 'react';

export interface QuizResult {
  date: string;
  score: number;
  total: number;
  stream: string;
}

export interface ProgressState {
  solved: string[];
  revealed: string[];
  quizResults: QuizResult[];
  lastVisit: string;
}

const KEY = 'tadaruj3as-progress-v1';

const EMPTY: ProgressState = {
  solved: [],
  revealed: [],
  quizResults: [],
  lastVisit: new Date().toISOString(),
};

/* ---- tiny external store backed by localStorage ---- */

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function loadFromStorage(): ProgressState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      solved: Array.isArray(parsed.solved) ? parsed.solved : [],
      revealed: Array.isArray(parsed.revealed) ? parsed.revealed : [],
      quizResults: Array.isArray(parsed.quizResults) ? parsed.quizResults : [],
      lastVisit: parsed.lastVisit ?? EMPTY.lastVisit,
    };
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): ProgressState {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true;
    state = loadFromStorage();
  }
  return state;
}

function getServerSnapshot(): ProgressState {
  return EMPTY;
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function set(next: ProgressState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  listeners.forEach((l) => l());
}

/* ---- actions ---- */

export function toggleSolved(id: string) {
  const s = getSnapshot();
  const solved = s.solved.includes(id) ? s.solved.filter((x) => x !== id) : [...s.solved, id];
  set({ ...s, solved });
}

export function markRevealed(id: string) {
  const s = getSnapshot();
  if (s.revealed.includes(id)) return;
  set({ ...s, revealed: [...s.revealed, id] });
}

export function addQuizResult(r: QuizResult) {
  const s = getSnapshot();
  set({ ...s, quizResults: [r, ...s.quizResults].slice(0, 30) });
}

export function resetAll() {
  set({ solved: [], revealed: [], quizResults: [], lastVisit: new Date().toISOString() });
}

/* ---- hook ---- */

export function useProgress() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    state: current,
    toggleSolved,
    markRevealed,
    addQuizResult,
    resetAll,
  };
}
