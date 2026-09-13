"use client";

import * as React from "react";

// ============================================================
//  VariationTable — مكوّن جدول التغيرات (Tableau de variations)
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  يعرض جدول التغيرات بأسلوب رسمي مطابق للمعايير الجزائرية
//  مثال:
//  <VariationTable
//    columns={[
//      { x: "-∞", values: ["+", "0", "−", "0", "+"] },
//      { x: "0", values: ["0", "↑", "f(0)", "↓", "0"] },
//    ]}
//    rows={[
//      { label: "x", values: ["-∞", "", "0", "", "+∞"] },
//      { label: "f'(x)", values: ["+", "", "0", "", "-"] },
//      { label: "f(x)", arrows: [
//        { from: "-∞", to: "f(0)", direction: "up" },
//        { from: "f(0)", to: "-∞", direction: "down" },
//      ]},
//    ]}
//  />
// ============================================================

export interface VariationArrow {
  from: string;
  to: string;
  direction: "up" | "down";
}

export interface VariationRow {
  label: string;
  values?: string[];
  arrows?: VariationArrow[];
}

export interface VariationTableProps {
  rows: VariationRow[];
  columns: string[]; // ["-∞", "0", "+∞"] etc
  title?: string;
}

export function VariationTable({ rows, columns, title }: VariationTableProps) {
  const numCells = columns.length;

  return (
    <div className="my-4 overflow-x-auto">
      {title && (
        <div className="text-sm font-bold text-center mb-2 text-primary">{title}</div>
      )}
      <table className="border-collapse mx-auto text-sm" dir="ltr">
        <tbody>
          {/* صف x */}
          <tr>
            <td className="border-2 border-black px-3 py-2 font-bold bg-muted/30">
              x
            </td>
            {columns.map((col, i) => (
              <React.Fragment key={i}>
                <td className="border-2 border-black px-3 py-2 font-mono">
                  {col}
                </td>
                {i < columns.length - 1 && (
                  <td className="border-2 border-black px-3 py-2 bg-muted/10"></td>
                )}
              </React.Fragment>
            ))}
          </tr>

          {/* صفوف البيانات */}
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td className="border-2 border-black px-3 py-2 font-bold bg-muted/30">
                {row.label}
              </td>
              {row.values && row.values.length > 0 ? (
                row.values.map((val, vi) => (
                  <React.Fragment key={vi}>
                    <td className="border-2 border-black px-3 py-2 font-mono text-center">
                      {val}
                    </td>
                    {vi < (row.values?.length ?? 0) - 1 && (
                      <td className="border-2 border-black px-3 py-2 text-center">
                        {row.arrows && row.arrows[vi] ? (
                          <ArrowSVG direction={row.arrows[vi]!.direction} />
                        ) : (
                          ""
                        )}
                      </td>
                    )}
                  </React.Fragment>
                ))
              ) : (row.arrows && row.arrows.length > 0) ? (
                <>
                  <td className="border-2 border-black px-3 py-2 font-mono text-center">
                    {row.arrows[0]?.from || ""}
                  </td>
                  {row.arrows.map((arrow, ai) => (
                    <React.Fragment key={ai}>
                      <td className="border-2 border-black px-3 py-2 text-center min-w-[60px]">
                        <ArrowSVG direction={arrow.direction} />
                      </td>
                      {ai < (row.arrows?.length ?? 0) - 1 && (
                        <td className="border-2 border-black px-3 py-2 font-mono text-center">
                          {arrow.to}
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                  <td className="border-2 border-black px-3 py-2 font-mono text-center">
                    {row.arrows[row.arrows.length - 1]?.to || ""}
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArrowSVG({ direction }: { direction: "up" | "down" }) {
  if (direction === "up") {
    return (
      <svg width="30" height="40" viewBox="0 0 30 40" className="inline-block">
        <line x1="15" y1="35" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="15,3 11,11 19,11" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="30" height="40" viewBox="0 0 30 40" className="inline-block">
      <line x1="15" y1="5" x2="15" y2="32" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="15,37 11,29 19,29" fill="currentColor" />
    </svg>
  );
}

// ============================================================
//  TikZRenderer — عرض مخططات TikZ في المتصفح
//  يستعمل TikZJax (نسخة WASM من TikZ)
// ============================================================

export function TikZRenderer({ code }: { code: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // تحميل TikZJax
    const script = document.createElement("script");
    script.src = "https://tikzjax.com/v1/tikzjax.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => setError("تعذّر تحميل TikZJax");
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  React.useEffect(() => {
    if (loaded && containerRef.current && code) {
      // تنظيف المحتوى السابق
      containerRef.current.innerHTML = "";

      // إنشاء عنصر TikZJax
      const tikzDiv = document.createElement("div");
      tikzDiv.setAttribute("data-tikz", code);
      containerRef.current.appendChild(tikzDiv);

      // تشغيل TikZJax على العنصر الجديد
      if (window.processTikz) {
        window.processTikz(tikzDiv);
      }
    }
  }, [loaded, code]);

  if (error) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
        ⚠️ {error}. استعمل الصور أو الرسوم البديلة.
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <div className="inline-block animate-pulse">جارٍ تحميل محرك TikZ...</div>
      </div>
    );
  }

  return <div ref={containerRef} className="my-4 flex justify-center" />;
}

// إضافة processTikz للنافذة
declare global {
  interface Window {
    processTikz?: (el: HTMLElement) => void;
  }
}
