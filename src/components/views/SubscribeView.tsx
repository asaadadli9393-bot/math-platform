'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  Crown,
  KeyRound,
  Lock,
  Mail,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Video,
  XCircle,
} from 'lucide-react';
import {
  ALL_PLANS,
  DUAL_PLANS,
  PROFESSOR_EMAIL,
  PLANS,
  activate,
  buildRequestMailto,
  daysLeft,
  deactivate,
  formatArDate,
  isPremiumActive,
  type PlanId,
  useSubscription,
} from '@/lib/subscription';

const YEARS = ['السنة الأولى ثانوي', 'السنة الثانية ثانوي', 'السنة الثالثة ثانوي (بكالوريا)'];
const PAYMENTS = ['بريدي موب BaridiMob', 'حساب بريدي CCP', 'البطاقة الذهبية CIB', 'سأتفق مع الأستاذ'];

const FREE_FEATURES = [
  'بنك التمارين الكامل بأحلوله النموذجية (1168 تمريناً)',
  'الفصول والملخصات وصيغ التدرج الرسمية',
  'الدورات المجانية والاختبارات التفاعلية',
  'لوحة تتبع التقدم الشخصية',
];

const PREMIUM_FEATURES = [
  'مكتبة الأستاذ الكاملة: 137 وثيقة PDF منتقاة (سلاسل تمارين مع الحلول + مذكرات وملخصات)',
  'المواضيع والدورات المميزة الكاملة (سلاسل PDF + حلول مفصلة)',
  'السلاسل المميزة الخاصة من أرشيف الأستاذ',
  'تجميعيات البكالوريا (2008–2026) حسب المحاور + 40 حل نموذجي مفصل خطوة بخطوة مباشرة على المنصة',
  'حصص Zoom المباشرة الأسبوعية مع الأستاذ',
  'الوصول لمعرّفات الحصص وتسجيلاتها السابقة',
  'الدعم والمتابعة المباشرة عبر البريد الإلكتروني',
];

function CopyButton({ text, label = 'نسخ' }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          // تجاهل
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="gap-1.5"
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? 'نُسخ ✓' : label}
    </Button>
  );
}

export default function SubscribeView() {
  const { state, isPremium } = useSubscription();

  /* ---- نموذج طلب الاشتراك ---- */
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [year, setYear] = React.useState(YEARS[2]);
  const [plan, setPlan] = React.useState<PlanId>('Y1');
  const [payment, setPayment] = React.useState(PAYMENTS[0]);

  /* ---- تفعيل بالكود ---- */
  const [actEmail, setActEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [actMsg, setActMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const requestValid = name.trim().length >= 3 && emailValid;
  const mailto = buildRequestMailto({ name: name.trim(), email: email.trim(), year, plan, payment });

  const doActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(actEmail.trim())) {
      setActMsg({ ok: false, text: 'أدخل بريداً إلكترونياً صحيحاً (نفس البريد الذي أرسل به الأستاذ الكود).' });
      return;
    }
    const res = activate(actEmail, code);
    if (res.ok) {
      setActMsg({
        ok: true,
        text: `تم تفعيل اشتراكك بنجاح! الباقة: ${res.plan.label} — راجع بطاقة «اشتراكك المميز نشط» أعلاه لتفاصيل الانتهاء.`,
      });
      setCode('');
    } else {
      setActMsg({ ok: false, text: res.reason });
    }
  };

  const active = isPremiumActive(state);
  const left = daysLeft(state);
  const planInfo = state.plan ? PLANS[state.plan] : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* ================= الرأس ================= */}
      <div className="text-center">
        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-black text-stone-900 md:text-4xl">نظام الاشتراك المزدوج</h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-stone-500">
          باقتان للاختيار بينهما، ومسارَا تفعيل عبر البريد الإلكتروني: أرسل طلبك إلى الأستاذ
          عدلي اسعد واستلم كود التفعيل في بريدك، أو فعّل فوراً بكود وصلك. المحتوى الأساسي
          يبقى مجانياً للجميع.
        </p>
      </div>

      {/* ================= حالة اشتراكك ================= */}
      {active ? (
        <Card className="border-r-4 border-r-emerald-600 bg-emerald-50/60">
          <CardContent className="flex flex-col items-start justify-between gap-4 pt-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <div className="font-black text-emerald-900">اشتراكك المميز نشط ✓</div>
                <div className="text-sm text-emerald-700">
                  {planInfo ? planInfo.label : 'باقة مميزة'}
                  {left === null ? ' — دائم' : ` — متبقٍ ${left} يوماً`}
                  {state.expiresAt ? ` (حتى ${formatArDate(state.expiresAt)})` : ''}
                </div>
                {state.email ? (
                  <div className="mt-0.5 text-xs text-emerald-600" dir="ltr">
                    {state.email}
                  </div>
                ) : null}
              </div>
            </div>
            <Button variant="outline" onClick={deactivate} className="border-emerald-300 text-emerald-800 hover:bg-emerald-100">
              إلغاء الاشتراك على هذا الجهاز
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-r-4 border-r-stone-300 bg-white">
          <CardContent className="flex flex-col items-start justify-between gap-3 pt-5 sm:flex-row sm:items-center">
            <div>
              <div className="font-black text-stone-800">أنت الآن على الباقة المجانية</div>
              <div className="mt-0.5 text-sm text-stone-500">تشمل {FREE_FEATURES.length} مزايا أساسية — تكفي للمراجعة والتدريب اليومي.</div>
            </div>
            <Badge variant="outline" className="shrink-0 border-stone-300 font-bold text-stone-600">مجاني</Badge>
          </CardContent>
        </Card>
      )}

      {/* ================= الباقتان (مزدوج) ================= */}
      <div className="grid gap-5 md:grid-cols-2">
        {DUAL_PLANS.map((p, idx) => {
          const popular = idx === 1;
          return (
            <Card
              key={p.id}
              className={`relative overflow-hidden ${popular ? 'border-2 border-amber-400 shadow-lg shadow-amber-400/10' : ''}`}
            >
              {popular && (
                <div className="absolute left-0 top-0 rounded-br-xl bg-amber-400 px-3 py-1 text-xs font-black text-emerald-950">
                  ⭐ الأكثر طلباً
                </div>
              )}
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-xl font-black text-stone-900">{p.label}</CardTitle>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-emerald-700">{p.priceDzd}</span>
                  <span className="font-bold text-stone-500">دج / {p.months === null ? 'مرة واحدة' : p.months === 1 ? 'شهر' : 'سنة'}</span>
                </div>
                <p className="mt-1 text-xs font-bold text-stone-400">{p.note}</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <ul className="space-y-2">
                  {PREMIUM_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => {
                    setPlan(p.id);
                    document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full gap-2 ${popular ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-400/25 hover:bg-amber-300' : 'bg-emerald-700 hover:bg-emerald-800'}`}
                >
                  <Mail className="h-4 w-4" />
                  طلب هذه الباقة عبر البريد
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs font-bold text-stone-400">
        أكواد «3 أشهر» و«الدائم» تُدار مباشرة من الأستاذ حسب الحالة — تواصل عبر البريد.
      </p>

      {/* ================= ماذا يجاني كل مسار؟ ================= */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-black text-stone-800">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              الباقة المجانية تشمل
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-black text-stone-800">
              <Crown className="h-4 w-4 text-amber-500" />
              الاشتراك المميز يضيف
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ================= الفيديو التعريفي ================= */}
      <Card className="overflow-hidden border-2 border-amber-200/70 bg-gradient-to-b from-amber-50/60 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-center text-lg font-black text-stone-900 sm:text-xl">
            <Play className="h-5 w-5 text-amber-600" />
            فيديو تعريفي — تعرّف على المنصة في دقيقة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <video
            controls
            preload="none"
            poster="/video/poster.jpg"
            src="/video/promo.mp4"
            className="mx-auto aspect-video w-full max-w-3xl rounded-2xl bg-stone-950 shadow-xl shadow-stone-900/20 ring-1 ring-stone-200"
          >
            متصفحك لا يدعم تشغيل الفيديو — حمّله من الرابط مباشرة.
          </video>
          <p className="mt-3 text-center text-xs font-bold text-stone-500">
            مشاهد من المنصة: بنك التمارين • السلاسل • الفروض والاختبارات • مكتبة الأستاذ • الباقات
          </p>
        </CardContent>
      </Card>

      {/* ================= المسار 1: طلب عبر البريد ================= */}
      <Card id="request-form" className="scroll-mt-24 border-r-4 border-r-emerald-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black text-stone-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">1</span>
            المسار الأول — طلب الاشتراك عبر البريد الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* خطوات */}
          <ol className="grid gap-3 text-sm sm:grid-cols-4">
            {[
              'املأ النموذج واضغط «إرسال الطلب» ليفتح بريدك بإجابات جاهزة',
              'أرسل مبلغ الاشتراك بالطريقة المتفق عليها (بريدي موب / CCP / CIB)',
              'يؤكد لك الأستاذ الدفع ويرسل كود التفعيل إلى بريدك',
              'أدخل الكود في «المسار الثاني» بالأسفل ليُفتح المحتوى المميز',
            ].map((s, i) => (
              <li key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <div className="mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                  {i + 1}
                </div>
                <p className="leading-5 text-stone-600">{s}</p>
              </li>
            ))}
          </ol>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sub-name">الاسم الكامل *</Label>
              <Input id="sub-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: محمد أمين بلقاسم" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub-email">البريد الإلكتروني *</Label>
              <Input id="sub-email" type="email" dir="ltr" className="text-right" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub-year">المستوى الدراسي</Label>
              <select
                id="sub-year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub-plan">الباقة المطلوبة</Label>
              <select
                id="sub-plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanId)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                {ALL_PLANS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.priceDzd} دج
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="sub-pay">طريقة الدفع المفضلة</Label>
              <select
                id="sub-pay"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                {PAYMENTS.map((pm) => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={requestValid ? mailto : undefined}
              onClick={(e) => {
                if (!requestValid) e.preventDefault();
              }}
              aria-disabled={!requestValid}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black shadow-md transition ${
                requestValid
                  ? 'bg-emerald-700 text-white shadow-emerald-700/25 hover:bg-emerald-800 active:scale-[0.99]'
                  : 'cursor-not-allowed bg-stone-200 text-stone-400'
              }`}
            >
              <Send className="h-4 w-4" />
              إرسال الطلب عبر البريد الإلكتروني
            </a>
            <CopyButton text={PROFESSOR_EMAIL} label="نسخ بريد الأستاذ" />
          </div>
          {!requestValid && (
            <p className="text-xs font-bold text-stone-400">* أدخل الاسم الكامل وبريداً صحيحاً لتفعيل زر الإرسال.</p>
          )}
          <div className="flex items-start gap-2 rounded-xl bg-emerald-50/70 p-3 text-sm text-emerald-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p className="leading-6">
              يُرسل الطلب إلى بريد الأستاذ المشرف:{' '}
              <span dir="ltr" className="font-black">{PROFESSOR_EMAIL}</span> — إن لم يفتح تطبيق البريد تلقائياً، انسخ العنوان وأرسل بياناتك يدوياً.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ================= المسار 2: تفعيل بالكود ================= */}
      <Card className="border-r-4 border-r-amber-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black text-stone-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-sm font-black text-white">2</span>
            المسار الثاني — التفعيل بكود التفعيل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={doActivate} className="space-y-4">
            <p className="text-sm leading-6 text-stone-600">
              إذا وصلك كود تفعيل من الأستاذ (بالشكل <span dir="ltr" className="font-mono font-bold">TDJ-XX-XXXX-XXXX</span>)،
              أدخل بريدك الإلكتروني والكود هنا ليُفتح المحتوى المميز فوراً على هذا الجهاز.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="act-email">بريدك الإلكتروني</Label>
                <Input
                  id="act-email"
                  type="email"
                  dir="ltr"
                  className="text-right"
                  value={actEmail}
                  onChange={(e) => setActEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-code">كود التفعيل</Label>
                <Input
                  id="act-code"
                  dir="ltr"
                  className="font-mono tracking-wider"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="TDJ-XX-XXXX-XXXX"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2 bg-amber-500 text-emerald-950 shadow-md shadow-amber-500/25 hover:bg-amber-400 sm:w-auto sm:px-8">
              <KeyRound className="h-4 w-4" />
              تفعيل الاشتراك
            </Button>

            {actMsg && (
              <div
                className={`flex items-start gap-2 rounded-xl p-3 text-sm font-bold ${
                  actMsg.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                }`}
              >
                {actMsg.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span className="leading-6">{actMsg.text}</span>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* ================= أسئلة شائعة ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black text-stone-900">
            <Video className="h-5 w-5 text-emerald-700" />
            أسئلة شائعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-stone-600">
          <div>
            <h4 className="mb-1 font-black text-stone-800">هل المحتوى المجاني كافٍ للمذاكرة؟</h4>
            <p>نعم — بنك التمارين كاملاً بأحلوله النموذجية، والفصول والملخصات والاختبارات، كلها مجانية. الاشتراك المميز يفتح «مكتبة الأستاذ» (137 وثيقة منتقاة) والمواضيع والدورات المميزة والسلاسل الخاصة، إضافة إلى حصص Zoom المباشرة والمتابعة الشخصية.</p>
          </div>
          <div>
            <h4 className="mb-1 font-black text-stone-800">متى يصلني كود التفعيل بعد الدفع؟</h4>
            <p>عادة في نفس اليوم: يرد الأستاذ على بريدك لتأكيد الدفع ويرسل الكود إلى نفس العنوان، ثم تفعّله من «المسار الثاني» أعلاه.</p>
          </div>
          <div>
            <h4 className="mb-1 font-black text-stone-800">هل يعمل الاشتراك على كل أجهزتي؟</h4>
            <p>يُنشَّط الاشتراك على الجهاز الذي أدخلت فيه الكود (بدون حساب أو كلمة سر). إن غيّرت جهازاً، راسل الأستاذ على البريد وسيعيد إرسال الكود لك.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-stone-50 p-3 text-stone-700">
            <Lock className="h-4 w-4 shrink-0 text-stone-400" />
            <span>
              للاستفسار التجاري أو التقني:{' '}
              <a href={`mailto:${PROFESSOR_EMAIL}`} dir="ltr" className="font-black text-emerald-700 hover:underline">
                {PROFESSOR_EMAIL}
              </a>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
