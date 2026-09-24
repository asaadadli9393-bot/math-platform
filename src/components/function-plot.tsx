"use client";

import * as React from "react";

// ============================================================
//  مكوّن رسم الدوال البيانية — منصة الرياضيات
//  يرسم منحنيات الدوال على Canvas (بدون مكتبة خارجية)
// ============================================================

export interface FunctionPlotProps {
  functions: Array<{
    expr: string;
    color: string;
    label?: string;
    width?: number;
    dashed?: boolean;
  }>;
  xRange?: [number, number];
  yRange?: [number, number];
  points?: Array<{ x: number; y: number; label?: string; color?: string }>;
  sequence?: {
    values: number[];
    color?: string;
    connect?: boolean;
    label?: string;
    showValues?: boolean;
    fixedPoint?: number;
  };
  height?: number;
  title?: string;
}

function compileExpr(expr: string): (x: number) => number {
  let safe = expr
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsin\b/gi, "Math.sin")
    .replace(/\bcos\b/gi, "Math.cos")
    .replace(/\btan\b/gi, "Math.tan")
    .replace(/\bln\b/gi, "Math.log")
    .replace(/\blog\b/gi, "Math.log10")
    .replace(/\bsqrt\b/gi, "Math.sqrt")
    .replace(/\babs\b/gi, "Math.abs")
    .replace(/\bexp\b/gi, "Math.exp")
    .replace(/(\w+|\([^)]+\))\^(\w+|\([^)]+\))/g, "Math.pow($1, $2)");
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `"use strict"; return (${safe});`) as (x: number) => number;
    return fn;
  } catch {
    return () => 0;
  }
}

function niceStep(range: number): number {
  const targetSteps = 8;
  const rough = range / targetSteps;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / pow;
  let step;
  if (norm < 1.5) step = 1;
  else if (norm < 3) step = 2;
  else if (norm < 7) step = 5;
  else step = 10;
  return step * pow;
}

export function FunctionPlot({
  functions,
  xRange = [-10, 10],
  yRange,
  points = [],
  sequence,
  height = 320,
  title,
}: FunctionPlotProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = React.useState<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);

    let [ymin, ymax] = yRange ?? [Infinity, -Infinity];

    if (!yRange) {
      const compiledFns = functions.map((f) => ({ ...f, fn: compileExpr(f.expr) }));
      const samples = 200;
      for (const f of compiledFns) {
        for (let i = 0; i <= samples; i++) {
          const x = xRange[0] + ((xRange[1] - xRange[0]) * i) / samples;
          try {
            const y = f.fn(x);
            if (isFinite(y) && Math.abs(y) < 1000) {
              if (y < ymin) ymin = y;
              if (y > ymax) ymax = y;
            }
          } catch {}
        }
      }
      if (sequence) {
        for (const v of sequence.values) {
          if (isFinite(v)) { if (v < ymin) ymin = v; if (v > ymax) ymax = v; }
        }
        if (sequence.fixedPoint !== undefined && isFinite(sequence.fixedPoint)) {
          if (sequence.fixedPoint < ymin) ymin = sequence.fixedPoint;
          if (sequence.fixedPoint > ymax) ymax = sequence.fixedPoint;
        }
      }
      for (const p of points) {
        if (isFinite(p.y)) { if (p.y < ymin) ymin = p.y; if (p.y > ymax) ymax = p.y; }
      }
      const pad = (ymax - ymin) * 0.1 || 1;
      ymin -= pad;
      ymax += pad;
    }

    const padding = 40;
    const plotW = w - 2 * padding;
    const plotH = h - 2 * padding;
    const xToPx = (x: number) => padding + ((x - xRange[0]) / (xRange[1] - xRange[0])) * plotW;
    const yToPx = (y: number) => padding + ((ymax - y) / (ymax - ymin)) * plotH;
    const pxToX = (px: number) => xRange[0] + ((px - padding) / plotW) * (xRange[1] - xRange[0]);

    // Grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const xStep = niceStep(xRange[1] - xRange[0]);
    for (let x = Math.ceil(xRange[0] / xStep) * xStep; x <= xRange[1]; x += xStep) {
      ctx.beginPath(); ctx.moveTo(xToPx(x), padding); ctx.lineTo(xToPx(x), h - padding); ctx.stroke();
    }
    const yStep = niceStep(ymax - ymin);
    for (let y = Math.ceil(ymin / yStep) * yStep; y <= ymax; y += yStep) {
      ctx.beginPath(); ctx.moveTo(padding, yToPx(y)); ctx.lineTo(w - padding, yToPx(y)); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#374151"; ctx.lineWidth = 1.5;
    if (ymin <= 0 && ymax >= 0) { ctx.beginPath(); ctx.moveTo(padding, yToPx(0)); ctx.lineTo(w - padding, yToPx(0)); ctx.stroke(); }
    if (xRange[0] <= 0 && xRange[1] >= 0) { ctx.beginPath(); ctx.moveTo(xToPx(0), padding); ctx.lineTo(xToPx(0), h - padding); ctx.stroke(); }

    // Labels
    ctx.fillStyle = "#6b7280"; ctx.font = "11px Cairo, sans-serif"; ctx.textAlign = "center";
    for (let x = Math.ceil(xRange[0] / xStep) * xStep; x <= xRange[1]; x += xStep) {
      if (Math.abs(x) > 0.001) ctx.fillText(x.toString(), xToPx(x), h - padding + 14);
    }
    ctx.textAlign = "right";
    for (let y = Math.ceil(ymin / yStep) * yStep; y <= ymax; y += yStep) {
      if (Math.abs(y) > 0.001) ctx.fillText(y.toString(), padding - 4, yToPx(y) + 4);
    }

    // Functions
    for (const f of functions) {
      const fn = compileExpr(f.expr);
      ctx.strokeStyle = f.color; ctx.lineWidth = f.width ?? 2.5;
      ctx.setLineDash(f.dashed ? [5, 5] : []);
      ctx.beginPath();
      let prevValid = false;
      const samples = 800;
      for (let i = 0; i <= samples; i++) {
        const x = xRange[0] + ((xRange[1] - xRange[0]) * i) / samples;
        try {
          const y = fn(x);
          if (!isFinite(y) || Math.abs(y) > 1e6) { prevValid = false; continue; }
          const px = xToPx(x); const py = yToPx(Math.max(ymin - 100, Math.min(ymax + 100, y)));
          if (!prevValid) { ctx.moveTo(px, py); prevValid = true; } else ctx.lineTo(px, py);
        } catch { prevValid = false; }
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Sequence
    if (sequence) {
      const seqColor = sequence.color ?? "#A4133C";
      const n = sequence.values.length;
      if (sequence.fixedPoint !== undefined && isFinite(sequence.fixedPoint)) {
        ctx.strokeStyle = "#10b981"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(padding, yToPx(sequence.fixedPoint)); ctx.lineTo(w - padding, yToPx(sequence.fixedPoint)); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#10b981"; ctx.font = "bold 12px Cairo, sans-serif"; ctx.textAlign = "right";
        ctx.fillText(`α = ${sequence.fixedPoint}`, w - padding - 4, yToPx(sequence.fixedPoint) - 6);
      }
      if (sequence.connect && n > 1) {
        ctx.strokeStyle = seqColor; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const x = i; const y = sequence.values[i];
          if (isFinite(y)) {
            const px = xToPx(x); const py = yToPx(Math.max(ymin, Math.min(ymax, y)));
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
        }
        ctx.stroke(); ctx.setLineDash([]);
      }
      ctx.fillStyle = seqColor;
      for (let i = 0; i < n; i++) {
        const x = i; const y = sequence.values[i];
        if (!isFinite(y)) continue;
        const px = xToPx(x); const py = yToPx(Math.max(ymin, Math.min(ymax, y)));
        ctx.beginPath(); ctx.arc(px, py, 6, 0, 2 * Math.PI); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        if (sequence.showValues) {
          ctx.fillStyle = "#1f2937"; ctx.font = "bold 11px Cairo, sans-serif"; ctx.textAlign = "center";
          ctx.fillText(`u${i}=${y.toFixed(2)}`, px, py - 10);
          ctx.fillStyle = seqColor;
        }
      }
    }

    // Points
    for (const p of points) {
      if (!isFinite(p.y)) continue;
      const px = xToPx(p.x); const py = yToPx(Math.max(ymin, Math.min(ymax, p.y)));
      ctx.fillStyle = p.color ?? "#A4133C";
      ctx.beginPath(); ctx.arc(px, py, 5, 0, 2 * Math.PI); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      if (p.label) {
        ctx.fillStyle = "#1f2937"; ctx.font = "bold 12px Cairo, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(p.label, px, py - 10);
      }
    }

    // Hover
    if (hover) {
      const x = pxToX(hover.x);
      ctx.strokeStyle = "rgba(164, 19, 60, 0.5)"; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(hover.x, padding); ctx.lineTo(hover.x, h - padding); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#A4133C"; ctx.fillRect(hover.x - 30, padding - 4, 60, 20);
      ctx.fillStyle = "#fff"; ctx.font = "bold 11px Cairo, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(`x=${x.toFixed(2)}`, hover.x, padding + 10);
    }

    // Title
    if (title) {
      ctx.fillStyle = "#1f2937"; ctx.font = "bold 14px Cairo, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(title, w / 2, 18);
    }

    // Legend
    if (functions.length > 1) {
      ctx.font = "12px Cairo, sans-serif"; ctx.textAlign = "right";
      let legendY = padding + 10;
      for (const f of functions) {
        if (!f.label) continue;
        ctx.strokeStyle = f.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w - padding - 80, legendY); ctx.lineTo(w - padding - 60, legendY); ctx.stroke();
        ctx.fillStyle = "#1f2937"; ctx.fillText(f.label, w - padding - 55, legendY + 4);
        legendY += 18;
      }
    }
  }, [functions, xRange, yRange, points, sequence, height, hover, title]);

  return (
    <div className="w-full rounded-lg border bg-white dark:bg-slate-950 p-2" dir="ltr">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: `${height}px`, cursor: "crosshair" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setHover(null)}
      />
      <div className="text-xs text-muted-foreground mt-1 text-center" dir="rtl">
        مرّر الماوس لعرض قيم x — الرسم تفاعلي
      </div>
    </div>
  );
}
