"use client";

import React from "react";
import katex from "katex";

interface MathProps {
  tex: string;
  display?: boolean;
  className?: string;
}

/**
 * مكوّن عرض الرياضيات باستعمال KaTeX
 * يدعم الوضعين السطري (inline) والعرض الكامل (display)
 * يتطلب أن يكون المحتوى النصي (statement) نصاً LaTeX خالصاً
 */
export function Math({ tex, display = false, className = "" }: MathProps) {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
        trust: true,
        output: "htmlAndMathml",
        dir: "ltr",
      });
    } catch (e) {
      return `<span style="color: red;">خطأ في صياغة LaTeX: ${String(e)}</span>`;
    }
  }, [tex, display]);

  return (
    <span
      className={`${className} ${display ? "block my-2" : "inline-block"}`}
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * مكوّن لعرض نص يحتوي على رياضيات inline
 * صياغة: نص عادي مع $...$ للرياضيات السطرية و $$...$$ للعرض الكامل
 */
interface MathTextProps {
  content: string;
  className?: string;
}

export function MathText({ content, className = "" }: MathTextProps) {
  const parts = React.useMemo(() => parseMathContent(content), [content]);

  return (
    <span className={className} dir="rtl">
      {parts.map((part, idx) => {
        if (part.type === "display") {
          return <Math key={idx} tex={part.content} display />;
        }
        if (part.type === "inline") {
          return <Math key={idx} tex={part.content} />;
        }
        return <React.Fragment key={idx}>{part.content}</React.Fragment>;
      })}
    </span>
  );
}

type MathPart =
  | { type: "text"; content: string }
  | { type: "inline"; content: string }
  | { type: "display"; content: string };

function parseMathContent(content: string): MathPart[] {
  const parts: MathPart[] = [];
  // نطابق: $$...$$ (display) أولاً، ثم $...$ (inline)
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // إضافة النص العادي قبل المطابقة
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: content.slice(lastIndex, match.index) });
    }

    const matched = match[0];
    if (matched.startsWith("$$")) {
      // display math
      const inner = matched.slice(2, -2).trim();
      parts.push({ type: "display", content: inner });
    } else {
      // inline math
      const inner = matched.slice(1, -1).trim();
      parts.push({ type: "inline", content: inner });
    }

    lastIndex = match.index + matched.length;
  }

  // إضافة ما تبقى من نص
  if (lastIndex < content.length) {
    parts.push({ type: "text", content: content.slice(lastIndex) });
  }

  return parts;
}

/**
 * مكوّن لعرض محتوى Markdown مبسّط يدعم:
 * - عناوين # ## ###
 * - قوائم - / *
 * - رياضيات $...$ و $$...$$
 * - فقرات
 */
interface MarkdownMathProps {
  content: string;
  className?: string;
}

export function MarkdownMath({ content, className = "" }: MarkdownMathProps) {
  const blocks = React.useMemo(() => parseMarkdownBlocks(content), [content]);

  return (
    <div className={`space-y-3 leading-loose ${className}`} dir="rtl">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={idx}
                className="text-2xl font-bold text-primary border-r-4 border-primary pr-3 mt-4 mb-2"
              >
                <MathText content={block.content} />
              </h2>
            );
          case "h3":
            return (
              <h3
                key={idx}
                className="text-xl font-bold text-accent-foreground mt-3 mb-1"
              >
                <MathText content={block.content} />
              </h3>
            );
          case "h4":
            return (
              <h4
                key={idx}
                className="text-lg font-semibold mt-2 mb-1"
              >
                <MathText content={block.content} />
              </h4>
            );
          case "list":
            return (
              <ul key={idx} className="list-disc pr-6 space-y-1">
                {block.items.map((item, i) => (
                  <li key={i} className="text-base">
                    <MathText content={item} />
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre
                key={idx}
                className="bg-muted p-3 rounded-md overflow-x-auto text-sm font-mono"
                dir="ltr"
              >
                <code>{block.content}</code>
              </pre>
            );
          case "paragraph":
            return (
              <p key={idx} className="text-base leading-relaxed">
                <MathText content={block.content} />
              </p>
            );
          case "display":
            return <Math key={idx} tex={block.content} display />;
          case "table":
            return <MarkdownTable key={idx} table={block.rows} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

interface MarkdownBlock {
  type:
    | "h2"
    | "h3"
    | "h4"
    | "list"
    | "code"
    | "paragraph"
    | "display"
    | "table";
  content?: string;
  items?: string[];
  rows?: string[][];
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const lines = content.split("\n");
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", content: trimmed.slice(3) });
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", content: trimmed.slice(4) });
      i++;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", content: trimmed.slice(5) });
      i++;
      continue;
    }

    // Display math
    if (trimmed.startsWith("$$")) {
      let blockContent = trimmed.slice(2);
      i++;
      // متعدد الأسطر
      while (i < lines.length && !lines[i].trim().endsWith("$$")) {
        blockContent += "\n" + lines[i];
        i++;
      }
      if (i < lines.length) {
        blockContent += "\n" + lines[i].trim().slice(0, -2);
        i++;
      } else {
        blockContent = blockContent.slice(0, -2);
      }
      blocks.push({ type: "display", content: blockContent.trim() });
      continue;
    }

    // Code block
    if (trimmed.startsWith("```")) {
      i++;
      let codeContent = "";
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeContent += lines[i] + "\n";
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", content: codeContent });
      continue;
    }

    // List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("|---")) {
      const rows: string[][] = [];
      rows.push(trimmed.split("|").slice(1, -1).map((c) => c.trim()));
      i += 2; // skip header and separator
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim().split("|").slice(1, -1).map((c) => c.trim()));
        i++;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    // Paragraph (multi-line)
    let para = trimmed;
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ") &&
      !lines[i].trim().startsWith("$$") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith("```")
    ) {
      para += "\n" + lines[i].trim();
      i++;
    }
    blocks.push({ type: "paragraph", content: para });
  }

  return blocks;
}

function MarkdownTable({ table }: { table: string[][] }) {
  if (!table || table.length === 0) return null;
  return (
    <div className="overflow-x-auto my-3">
      <table className="min-w-full border-collapse border border-border text-center">
        <thead>
          <tr className="bg-muted">
            {table[0].map((cell, i) => (
              <th key={i} className="border border-border p-2 font-bold">
                <MathText content={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-border p-2">
                  <MathText content={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
