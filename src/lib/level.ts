'use client';

import { useSyncExternalStore } from 'react';
import type { YearId } from '@/data/curriculum';

const KEY = 'tadaruj-level-v1';

let level: YearId = '3as';
let loaded = false;
const listeners = new Set<() => void>();

function loadFromStorage(): YearId {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === '1as' || raw === '2as' || raw === '3as') return raw;
    return '3as';
  } catch {
    return '3as';
  }
}

function getSnapshot(): YearId {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true;
    level = loadFromStorage();
  }
  return level;
}

function getServerSnapshot(): YearId {
  return '3as';
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setLevel(l: YearId) {
  level = l;
  try {
    window.localStorage.setItem(KEY, l);
  } catch {
    // ignore quota errors
  }
  listeners.forEach((fn) => fn());
}

export function useLevel() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { year: current, setLevel };
}
