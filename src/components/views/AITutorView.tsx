'use client';

import * as React from 'react';
import {
  Bot,
  Crown,
  Eraser,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
  Square,
} from 'lucide-react';
import { SectionTitle } from '@/components/shared';
import { RichText } from '@/lib/tex';
import type { YearId } from '@/data/curriculum';

// ============================================================
//  المدرّس الذكي — تدرّج AI
//  محادثة بثّية مع أستاذ رياضيات ذكي، يعرف مستوى التلميذ،
//  يشرح بالمنهجية ويرسم الصيغ بـ KaTeX. مجاني بحد يومي،
//  وغير محدود للمشتركين المميزين.
// ============================================================

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const FREE_DAILY_LIMIT = 15;
const CHAT_KEY = 'tadaruj-ai-chat-v1';
const QUOTA_KEY = 'tadaruj-ai-v1';

const STARTERS = [
  'اشرح لي الدرس: كيف نحسب مشتقة دالة؟',
  'لخّص لي درس المتتاليات العددية بأهم القوانين',
  'ساعدني خطوة بخطوة في حل هذا التمرين: احسب $\u005Cint_0^1 (2x+1)\u005C,dx$',
  'أعطني تمريناً على الأعداد المركبة مع حله',
  'ما الفرق بين المتتالية الحسابية والهندسية؟',
  'كيف أرسم دالة بدرجة ثانية وحدد اتجاه التغير؟',
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** توحيد نص الجواب: فواصل LaTeX، إزالة HTML، تفكيك الجداول إلى أسطر نصية */
function normalizeMath(src: string): string {
  const unified = src
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\\\[([\s\S]*?)\\\]/g, (_m, inner: string) => `$$${inner}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_m, inner: string) => `$${inner}$`);
  return unified
    .split('\n')
    .map((line) => {
      if (/^\s*\|[\s:|-]+\|?\s*$/.test(line)) return ''; // سطر فاصل الجدول
      if (/^\s*\|/.test(line))
        return line
          .replace(/^\s*\|/, '')
          .replace(/\|\s*$/, '')
          .replace(/\s*\|\s*/g, ' — ');
      return line;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

function loadQuota(): number {
  try {
    const raw = localStorage.getItem(QUOTA_KEY);
    if (raw) {
      const j = JSON.parse(raw) as { date: string; count: number };
      if (j.date === today()) return Math.max(0, j.count);
    }
  } catch {
    /* تجاهل */
  }
  return 0;
}

function saveQuota(count: number) {
  try {
    localStorage.setItem(QUOTA_KEY, JSON.stringify({ date: today(), count }));
  } catch {
    /* تجاهل */
  }
}

function loadChat(): Msg[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (raw) {
      const j = JSON.parse(raw) as Msg[];
      if (Array.isArray(j)) {
        return j
          .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .slice(-30);
      }
    }
  } catch {
    /* تجاهل */
  }
  return [];
}

export default function AITutorView({
  year,
  isPremium,
  onSubscribe,
}: {
  year: YearId;
  isPremium: boolean;
  onSubscribe: () => void;
}) {
  const [msgs, setMsgs] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [used, setUsed] = React.useState(0);
  const [netError, setNetError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  // استرجاع المحادثة والحصة المحفوظتين
  React.useEffect(() => {
    setMsgs(loadChat());
    setUsed(loadQuota());
  }, []);

  // تمرير تلقائي لآخر رسالة
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, streaming]);

  const remaining = Math.max(0, FREE_DAILY_LIMIT - used);
  const blocked = !isPremium && remaining <= 0;

  const persist = (next: Msg[]) => {
    try {
      localStorage.setItem(CHAT_KEY, JSON.stringify(next.slice(-30)));
    } catch {
      /* تجاهل */
    }
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming || blocked) return;
    if (!isPremium && remaining <= 0) return;
    setInput('');
    if (taRef.current) taRef.current.style.height = 'auto';
    setNetError(null);

    const history = [...msgs, { role: 'user' as const, content }];
    const next: Msg[] = [...history, { role: 'assistant', content: '' }];
    setMsgs(next);
    setStreaming(true);

    if (!isPremium) {
      const u = used + 1;
      setUsed(u);
      saveQuota(u);
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          year,
          history: history.slice(-12).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? 'network');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      let acc = '';
      let srvError: string | null = null;
      let finished = false;

      while (!finished) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split('\n\n');
        buf = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') {
            finished = true;
            break;
          }
          try {
            const j = JSON.parse(payload) as { t?: string; e?: string };
            if (j.t) {
              acc += j.t;
              setMsgs((cur) => {
                const c = [...cur];
                c[c.length - 1] = { role: 'assistant', content: acc };
                return c;
              });
            }
            if (j.e) srvError = j.e;
          } catch {
            /* تجاهل */
          }
        }
      }

      if (srvError && !acc) {
        throw new Error(srvError);
      }
      if (!acc) {
        throw new Error('empty');
      }
      persist([...history, { role: 'assistant', content: normalizeMath(acc) }]);
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === 'AbortError';
      if (aborted) {
        // أُوقف البث يدوياً: نحفظ ما وصل حتى الآن
        setMsgs((cur) => {
          const last = cur[cur.length - 1];
          if (last?.role === 'assistant' && !last.content) {
            const fixed = [...cur];
            fixed[fixed.length - 1] = {
              role: 'assistant',
              content: 'أوقفتُ الإجابة عند هذه النقطة. اسألني للتكملة متى شئت.',
            };
            persist(fixed);
            return fixed;
          }
          persist(cur);
          return cur;
        });
      } else {
        setNetError(
          e instanceof Error && e.message !== 'network' && e.message !== 'empty'
            ? 'تعذّر وصول الإجابة — راجع اتصالك ثم أعد المحاولة.'
            : 'تعذّر وصول الإجابة الآن — أعد المحاولة بعد لحظات.',
        );
        setMsgs((cur) => {
          const last = cur[cur.length - 1];
          if (last?.role === 'assistant' && !last.content) {
            const fixed = cur.slice(0, -1);
            persist(fixed);
            return fixed;
          }
          return cur;
        });
        if (!isPremium) {
          const u = Math.max(0, used - 1);
          setUsed(u);
          saveQuota(u);
        }
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const clearChat = () => {
    if (streaming) stop();
    setMsgs([]);
    setNetError(null);
    try {
      localStorage.removeItem(CHAT_KEY);
    } catch {
      /* تجاهل */
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <SectionTitle
        eyebrow="تدرّج AI — حصري للمنصة"
        title="مدرسك الذكي الخاص"
        sub="مساعد ذكاء اصطناعي يعرف مستواك الدراسي، يشرح الدروس ويرشدك خطوة بخطوة بمنهجية الثانوي الجزائري، ويرسم الصيغ الرياضية بدقة. مجاني بحد يومي — وغير محدود للمشتركين."
      />

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {/* شريط أعلى المحادثة */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 bg-stone-50/70 px-4 py-2.5">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold text-stone-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <Bot className="h-4 w-4" />
            </span>
            المدرّس الذكي — تدرّج AI
          </span>
          <span className="flex items-center gap-2">
            {isPremium ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-800 ring-1 ring-emerald-200">
                <Crown className="h-3 w-3 text-amber-500" />
                مشترك — أسئلة بلا حدود
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-200">
                متبقٍ لك {remaining} من {FREE_DAILY_LIMIT} سؤال اليوم
              </span>
            )}
            {msgs.length > 0 && (
              <button
                onClick={clearChat}
                title="محادثة جديدة"
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-stone-600 transition hover:bg-stone-100"
              >
                <Eraser className="h-3 w-3" />
                محادثة جديدة
              </button>
            )}
          </span>
        </div>

        {/* نافذة الرسائل */}
        <div
          ref={scrollRef}
          className="custom-scroll max-h-[58vh] min-h-[320px] overflow-y-auto bg-stone-50/50 px-3 py-4 sm:px-5"
        >
          {msgs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <MessageSquare className="h-7 w-7" />
              </span>
              <div>
                <p className="text-base font-black text-stone-800">
                  مرحباً! أنا مدرّسك الذكي 👋
                </p>
                <p className="mt-1 text-sm font-bold text-stone-500">
                  اسألني أي سؤال في الرياضيات — سأشرحه لك خطوة بخطوة
                </p>
              </div>
              <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={blocked}
                    className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-right text-xs font-bold text-stone-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {msgs.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-emerald-800 px-4 py-2.5 text-sm leading-7 text-white shadow-sm">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start">
                    <div className="flex max-w-[90%] items-start gap-2">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
                        <Bot className="h-4 w-4" />
                      </span>
                      <div className="rounded-2xl rounded-br-md border border-stone-200 bg-white px-4 py-3 text-sm leading-8 text-stone-800 shadow-sm">
                        {m.content ? (
                          <RichText text={normalizeMath(m.content)} />
                        ) : (
                          <span className="flex items-center gap-1.5 py-1" aria-label="يكتب الآن">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:0ms]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:150ms]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:300ms]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        {/* رسالة الخطأ */}
        {netError && (
          <div className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 sm:mx-5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {netError}
          </div>
        )}

        {/* حاجز الحصة المجانية */}
        {blocked && (
          <div className="mx-3 mb-2 rounded-2xl bg-emerald-800 px-4 py-4 text-white sm:mx-5">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-center text-sm font-extrabold sm:text-right">
                أكملت أسئلتك المجانية لهذا اليوم ({FREE_DAILY_LIMIT} أسئلة)! اشترك لتحصل على مدرّس
                ذكي بلا حدود كل يوم.
              </p>
              <button
                onClick={onSubscribe}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-extrabold text-emerald-950 shadow-md shadow-amber-400/25 transition hover:bg-amber-300"
              >
                <Crown className="h-4 w-4" />
                اشترك الآن
              </button>
            </div>
          </div>
        )}

        {/* حقل الإدخال */}
        <div className="border-t border-stone-100 bg-white px-3 py-3 sm:px-5">
          <div className="flex items-end gap-2">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={blocked ? 'اشترك لتتابع الأسئلة…' : 'اكتب سؤالك في الرياضيات…'}
              disabled={blocked || streaming}
              className="custom-scroll max-h-30 min-h-11 flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white disabled:opacity-50"
            />
            {streaming ? (
              <button
                onClick={stop}
                title="إيقاف الإجابة"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-800 text-white shadow-sm transition hover:bg-stone-700"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => send()}
                disabled={!input.trim() || blocked}
                title="إرسال"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md shadow-emerald-700/25 transition hover:bg-emerald-600 disabled:opacity-40"
              >
                <Send className="h-4 w-4 -scale-x-100" />
              </button>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
            <Sparkles className="h-3 w-3 shrink-0 text-emerald-600" />
            الإجابات بثّ مباشر وصيغ رياضية دقيقة — قد يخطئ الذكاء الاصطناعي أحياناً، تحقّق من
            الحلول مع أستاذك.
          </p>
        </div>
      </div>

      {/* كيف يستفيد منه التلميذ */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          {
            t: 'شرح يفهمه التلميذ',
            d: 'خطوة بخطوة بلغة عربية واضحة، مع الصيغ الرياضية مضبوطة ومنهجية الحل المعتمدة في التصحيح.',
          },
          {
            t: 'يعرف مستواك وشعبتك',
            d: 'يجيب وفق دروس السنة التي تدرسها (أولى/ثانية/ثالثة ثانوي) وبأسلوب تمارين البكالوريا.',
          },
          {
            t: 'متاح دائماً',
            d: 'ليل نهار، قبل الفروض والاختبارات — سؤالك الوحيد أو محادثة كاملة لمراجعة درس كامل.',
          },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <h3 className="mb-1.5 text-sm font-black text-stone-800">{c.t}</h3>
            <p className="text-xs leading-6 text-stone-600">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
