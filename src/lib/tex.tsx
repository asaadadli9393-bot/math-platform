'use client';

import katex from 'katex';
import { useMemo } from 'react';

/** Render a single LaTeX string with KaTeX */
export function texHtml(tex: string, displayMode = false): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'html',
    });
  } catch {
    return tex;
  }
}

/** Split a rich string into text / inline-math / display-math segments */
function segment(src: string): Array<{ type: 'text' | 'inline' | 'display'; value: string }> {
  const parts = src.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
  const out: Array<{ type: 'text' | 'inline' | 'display'; value: string }> = [];
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith('$$') && p.endsWith('$$') && p.length > 4) {
      out.push({ type: 'display', value: p.slice(2, -2) });
    } else if (p.startsWith('$') && p.endsWith('$') && p.length > 2) {
      out.push({ type: 'inline', value: p.slice(1, -1) });
    } else {
      out.push({ type: 'text', value: p });
    }
  }
  return out;
}

/**
 * Rich Arabic text with embedded KaTeX math ($..$ inline, $$..$$ display).
 * Math is forced LTR inside the RTL flow.
 */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  const html = useMemo(() => {
    return segment(text).map((seg, i) => {
      if (seg.type === 'display') {
        return `<span class="block my-2 text-center overflow-x-auto" dir="ltr">${texHtml(seg.value, true)}</span>`;
      }
      if (seg.type === 'inline') {
        return `<span dir="ltr" style="display:inline-block" class="align-middle">${texHtml(seg.value, false)}</span>`;
      }
      return seg.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }).join('');
  }, [text]);

  return (
    <span
      className={`[word-spacing:normal] leading-loose ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
