'use client';

import { useEffect, useState } from 'react';

/* ============================================================
   القارئ الذكي — فهرس الوثائق المستخرَجة بأسلوب المنصة
   index.json: { pdfPath: { ok, file, pages, words, headings } }
   ============================================================ */

export interface FormattedEntry {
  ok: boolean;
  file?: string;
  pages?: number;
  words?: number;
  headings?: string[];
}

export interface FormattedDoc {
  id: string;
  src: string;
  pages: number;
  blocks: Array<{ t: 'h' | 'p' | 'm' | 'li' | 'pg'; x: string }>;
}

let indexPromise: Promise<Record<string, FormattedEntry>> | null = null;

export function loadFormattedIndex(): Promise<Record<string, FormattedEntry>> {
  if (!indexPromise) {
    indexPromise = fetch('/formatted/index.json')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return indexPromise;
}

/** يحمّل فهرس الوثائق المستخرجة مرة واحدة ويشاركه بين كل البطاقات */
export function useFormattedIndex(): Record<string, FormattedEntry> | null {
  const [index, setIndex] = useState<Record<string, FormattedEntry> | null>(null);
  useEffect(() => {
    let alive = true;
    loadFormattedIndex().then((idx) => {
      if (alive) setIndex(idx);
    });
    return () => {
      alive = false;
    };
  }, []);
  return index;
}

export function formattedEntry(
  index: Record<string, FormattedEntry> | null,
  pdfPath: string | undefined,
): FormattedEntry | null {
  if (!index || !pdfPath) return null;
  const e = index[pdfPath];
  return e && e.ok && e.file ? e : null;
}

export async function fetchFormattedDoc(entry: FormattedEntry): Promise<FormattedDoc | null> {
  try {
    const r = await fetch(`/formatted/${entry.file}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
