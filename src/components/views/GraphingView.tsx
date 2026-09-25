'use client';

import * as React from 'react';
import {
  AlertTriangle,
  Eraser,
  Loader2,
  MousePointerClick,
  Move,
  Palette,
  RefreshCw,
  Sigma,
  Sparkles,
  Undo2,
} from 'lucide-react';
import { SectionTitle } from '@/components/shared';

// ============================================================
//  لوحة الرسم التفاعلية — GeoGebra
//  رسم الدوال والتمثيلات البيانية والأشكال الهندسية
//  تُحمَّل حزمة GeoGebra الرسمية من خوادمها (مجانية لجميع التلاميذ)
// ============================================================

/** واجهة مصغّرة ثابتة لـ GeoGebra Apps API (نتحقق وقت التشغيل قبل أي استدعاء) */
interface GgbApi {
  evalCommand: (cmd: string) => boolean | void;
  setWidth?: (w: number) => void;
  setHeight?: (h: number) => void;
  reset?: () => void;
  undo?: () => void;
  exportSVG?: (cb: (svg: string) => void) => void;
}

type GGBAppletCtor = new (
  params: Record<string, unknown>,
  apiVersion?: string,
) => { inject: (el: HTMLElement | string) => void };

declare global {
  interface Window {
    GGBApplet?: GGBAppletCtor;
  }
}

/** تحميل deployggb.js مرة واحدة فقط (مفرد) */
let deployPromise: Promise<void> | null = null;
function loadDeployGGB(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('ssr'));
  if (window.GGBApplet) return Promise.resolve();
  if (!deployPromise) {
    deployPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://www.geogebra.org/apps/deployggb.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        deployPromise = null;
        reject(new Error('deployggb-failed'));
      };
      document.head.appendChild(s);
    });
  }
  return deployPromise;
}

// ---------- الأوضاع الثلاثة ----------
const MODES = [
  { id: 'graphing', label: 'آلة بيانية', desc: 'الدوال والمنحنيات' },
  { id: 'geometry', label: 'هندسة', desc: 'الأشكال والتحويلات' },
  { id: 'classic', label: 'الوضع الكامل', desc: 'كل الأدوات + 3D' },
] as const;
type ModeId = (typeof MODES)[number]['id'];

// ---------- نماذج جاهزة (أوامر GeoGebra بصيغتها العالمية) ----------
const EXAMPLES: { id: string; label: string; cmds: string[] }[] = [
  { id: 'parabola', label: 'قطع مكافئ', cmds: ['f(x)=x^2-3x+1', 'g(x)=(x-2)^2'] },
  { id: 'trig', label: 'دوال مثلثية', cmds: ['g(x)=sin(x)', 'h(x)=cos(2x)'] },
  { id: 'circle', label: 'دائرة', cmds: ['x^2+y^2=9', 'A=(3,0)'] },
  { id: 'exp', label: 'أسية ولوغاريتم', cmds: ['k(x)=2^x', 'l(x)=ln(x)'] },
  { id: 'lines', label: 'مستقيمات وتقاطع', cmds: ['a: y=2x+1', 'b: y=-x+4', 'I=Intersect(a,b)'] },
  { id: 'roots', label: 'جذور وقيمة مطلقة', cmds: ['m(x)=sqrt(4-x^2)', 'n(x)=abs(x)'] },
];

const TIPS = [
  {
    icon: Sigma,
    title: 'أدخل دالتك',
    body: 'اكتب في شريط الإدخال مثل f(x)=x^2-2x-3 ثم اضغط Enter — يُرسم المنحنى فوراً. تدعم اللوحة الجذور والقوى والنسبة π والدوال المثلثية واللوغاريتمية.',
  },
  {
    icon: Move,
    title: 'تحكّم بالمستوى',
    body: 'اسحب بالماوس (أو بإصبعين على الهاتف) لتحريك المستوى، وعجلة الماوس أو إشارة التكبير لتقريب المحاور. زر إعادة الضبط يعيد المستوى لوضعه الأصلي.',
  },
  {
    icon: Palette,
    title: 'خصائص الكائنات',
    body: 'انقر بالزر الأيمن على أي منحنى أو نقطة لتغيير لونه ونمطه وسماكته من شريط الأنماط، أو أخفِه وأظهره بلمسة واحدة من نافذة الجبر.',
  },
  {
    icon: MousePointerClick,
    title: 'أدوات متقدمة',
    body: 'من شريط الأدوات: نقاط ومماس ومستقيمات وأشكال، مع قياس الزوايا والأطوال والمساحات، وحساب التكامل والمشتقة في «الوضع الكامل» مع الرؤية ثلاثية الأبعاد.',
  },
];

function appletHeight(w: number): number {
  return Math.round(Math.min(680, Math.max(430, w * 0.6)));
}

export default function GraphingView({ onOpenBank }: { onOpenBank?: () => void }) {
  const [mode, setMode] = React.useState<ModeId>('graphing');
  const [nonce, setNonce] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [hasExport, setHasExport] = React.useState(false);
  const [applying, setApplying] = React.useState<string | null>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useRef<GgbApi | null>(null);
  const resizeTimer = React.useRef<number | null>(null);

  // حقن التطبيق عند تغيير الوضع أو إعادة المحاولة
  React.useEffect(() => {
    let disposed = false;
    setReady(false);
    setFailed(false);
    setHasExport(false);

    loadDeployGGB()
      .then(() => {
        if (disposed || !hostRef.current) return;
        const GGB = window.GGBApplet;
        if (!GGB) throw new Error('no-ggb');
        const host = hostRef.current;
        const w = host.clientWidth || 760;
        const params: Record<string, unknown> = {
          appName: mode,
          width: w,
          height: appletHeight(w),
          showToolBar: true,
          showToolBarHelp: true,
          showAlgebraInput: true,
          showMenuBar: mode === 'classic',
          showResetIcon: true,
          enableRightClick: true,
          enableShiftDragZoom: true,
          allowStyleBar: true,
          language: 'ar',
          preventFocus: true,
          appletOnLoad: (api: GgbApi) => {
            if (disposed) return;
            apiRef.current = api;
            setHasExport(typeof api?.exportSVG === 'function');
            setReady(true);
          },
        };
        const applet = new GGB(params, '5.0');
        applet.inject(host);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      apiRef.current = null;
      if (hostRef.current) hostRef.current.innerHTML = '';
    };
  }, [mode, nonce]);

  // الاستجابة لتغيّر حجم النافذة (بدون إعادة حقن)
  React.useEffect(() => {
    const onResize = () => {
      if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
      resizeTimer.current = window.setTimeout(() => {
        const api = apiRef.current;
        const host = hostRef.current;
        if (!api || !host) return;
        const w = host.clientWidth;
        if (!w) return;
        try {
          api.setWidth?.(w);
          api.setHeight?.(appletHeight(w));
        } catch {
          /* بعض الإصدارات لا تدعم تغيير الحجم — نتجاهل بهدوء */
        }
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
    };
  }, []);

  const applyExample = (ex: (typeof EXAMPLES)[number]) => {
    const api = apiRef.current;
    if (!api || applying) return;
    setApplying(ex.id);
    try {
      api.reset?.();
    } catch {
      /* تجاهل */
    }
    window.setTimeout(() => {
      const a = apiRef.current;
      if (!a) {
        setApplying(null);
        return;
      }
      for (const c of ex.cmds) {
        try {
          a.evalCommand(c);
        } catch {
          /* تجاهل الأوامر غير المدعومة في وضع معيّن */
        }
      }
      setApplying(null);
    }, api.reset ? 120 : 0);
  };

  const clearAll = () => {
    try {
      apiRef.current?.reset?.();
    } catch {
      /* تجاهل */
    }
  };

  const undo = () => {
    try {
      apiRef.current?.undo?.();
    } catch {
      /* تجاهل */
    }
  };

  const exportSVG = () => {
    const api = apiRef.current;
    if (!api || typeof api.exportSVG !== 'function') return;
    try {
      api.exportSVG((svg: string) => {
        const raw = svg.startsWith('data:') ? svg : `data:image/svg+xml;base64,${svg}`;
        const a = document.createElement('a');
        a.href = raw;
        a.download = 'geogebra-tadaruj.svg';
        a.click();
      });
    } catch {
      /* تجاهل */
    }
  };

  const modeLabel = MODES.find((m) => m.id === mode)?.label ?? '';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="أداة تفاعلية — GeoGebra"
        title="لوحة رسم الدوال والتمثيلات البيانية"
        sub="ارسم الدوال والمنحنيات والمتحوّلات والأشكال الهندسية بأقوى أداة رسم رياضية في العالم — بأربعته العربية وبالمجان لجميع التلاميذ. مثالية للتحقق من نتائجك في التمارين ومراجعة البكالوريا."
      />

      {/* الأوضاع + أزرار التحكم */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl bg-stone-100 p-1 ring-1 ring-stone-200">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              title={m.desc}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                mode === m.id
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25'
                  : 'text-stone-500 hover:bg-white hover:text-emerald-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mr-auto flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!ready}
            title="تراجع عن آخر إجراء"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-extrabold text-stone-600 transition hover:bg-stone-50 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            تراجع
          </button>
          <button
            onClick={clearAll}
            disabled={!ready}
            title="مسح الرسم كاملاً"
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-extrabold text-stone-600 transition hover:bg-stone-50 disabled:opacity-40"
          >
            <Eraser className="h-3.5 w-3.5" />
            مسح الكل
          </button>
          {hasExport && (
            <button
              onClick={exportSVG}
              disabled={!ready}
              title="تنزيل الرسم كصورة SVG"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-40"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              تنزيل الرسم
            </button>
          )}
        </div>
      </div>

      {/* النماذج الجاهزة */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3">
        <span className="inline-flex items-center gap-1 text-xs font-black text-amber-800">
          <Sparkles className="h-3.5 w-3.5" />
          نماذج جاهزة:
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.id}
            onClick={() => applyExample(ex)}
            disabled={!ready || applying !== null}
            className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-stone-700 shadow-sm transition hover:border-amber-300 hover:bg-amber-100 hover:text-amber-900 disabled:opacity-40"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* بطاقة اللوحة */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/70 px-4 py-2.5">
          <span className="text-xs font-extrabold text-stone-600">
            GeoGebra — {modeLabel}
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 ring-1 ring-emerald-200">
            مجاناً لجميع التلاميذ
          </span>
        </div>

        <div className="relative p-2 sm:p-3">
          {/* حاوية الحقن */}
          <div ref={hostRef} className="w-full" aria-label="لوحة GeoGebra التفاعلية" />

          {/* طبقة التحميل */}
          {!ready && !failed && (
            <div className="absolute inset-2 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-stone-50/95 sm:inset-3">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
              <p className="text-sm font-extrabold text-stone-700">
                جارٍ تحميل لوحة الرسم من GeoGebra…
              </p>
              <p className="text-xs font-bold text-stone-400">
                تحتاج اللوحة اتصالاً بالإنترنت عند أول تحميل
              </p>
              <button
                onClick={() => setNonce((n) => n + 1)}
                className="mt-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-extrabold text-stone-600 transition hover:bg-stone-100"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* حالة الفشل */}
          {failed && (
            <div className="absolute inset-2 z-10 flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/95 sm:inset-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <p className="text-sm font-extrabold text-red-800">
                تعذّر تحميل GeoGebra — تحقّق من اتصالك بالإنترنت
              </p>
              <button
                onClick={() => setNonce((n) => n + 1)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-red-700"
              >
                إعادة المحاولة
              </button>
            </div>
          )}
        </div>
      </div>

      {/* نصائح الاستعمال */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {TIPS.map((t) => (
          <div key={t.title} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                <t.icon className="h-4 w-4 text-emerald-700" />
              </span>
              <h3 className="text-sm font-black text-stone-800">{t.title}</h3>
            </div>
            <p className="text-xs leading-6 text-stone-600">{t.body}</p>
          </div>
        ))}
      </div>

      {/* ربط مع بنك التمارين */}
      {onOpenBank && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl bg-emerald-800 px-5 py-4 text-white sm:flex-row">
          <p className="text-center text-sm font-extrabold sm:text-right">
            نصيحة: جرّب رسم دوال التمارين التي تحلّها للتحقق من إجاباتك بصرياً
          </p>
          <button
            onClick={onOpenBank}
            className="shrink-0 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300"
          >
            افتح بنك التمارين
          </button>
        </div>
      )}
    </div>
  );
}
