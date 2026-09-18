'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Copy,
  History,
  KeyRound,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  ALL_PLANS,
  PLANS,
  PROFESSOR_EMAIL,
  adminCodes,
  adminHasPassword,
  adminLoggedIn,
  adminLogin,
  adminLogout,
  adminSaveCode,
  adminSetPassword,
  buildCodeDeliveryMailto,
  formatArDate,
  generateCode,
  type AdminCode,
  type PlanId,
} from '@/lib/subscription';

export default function AdminView() {
  const [mounted, setMounted] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [hasPass, setHasPass] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setLoggedIn(adminLoggedIn());
    setHasPass(adminHasPassword());
  }, []);

  if (!mounted) {
    return <div className="mx-auto h-40 max-w-md animate-pulse rounded-2xl bg-stone-100" />;
  }

  return loggedIn ? (
    <AdminPanel
      onLogout={() => {
        adminLogout();
        setLoggedIn(false);
      }}
    />
  ) : (
    <AdminLogin
      hasPass={hasPass}
      onSuccess={() => {
        setLoggedIn(true);
        setHasPass(true);
      }}
    />
  );
}

/* ================= دخول الأستاذ ================= */

function AdminLogin({ hasPass, onSuccess }: { hasPass: boolean; onSuccess: () => void }) {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [pass2, setPass2] = React.useState('');
  const [err, setErr] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);
  /** حالة كلمة السر محلياً — تُحدّث فور حفظها */
  const [passSet, setPassSet] = React.useState(hasPass);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOkMsg(null);
    if (!passSet) {
      if (pass.length < 6) {
        setErr('كلمة السر يجب أن تكون 6 أحرف على الأقل.');
        return;
      }
      if (pass !== pass2) {
        setErr('كلمتا السر غير متطابقتين.');
        return;
      }
      if (!adminSetPassword(pass)) {
        setErr('تعذر حفظ كلمة السر.');
        return;
      }
      setPassSet(true);
      setPass2('');
      setOkMsg('تم تعيين كلمة السر ✓ — اضغط «دخول» الآن.');
      return;
    }
    const res = adminLogin(email, pass);
    if (res.ok) {
      onSuccess();
    } else {
      setErr(res.reason ?? 'تعذر الدخول.');
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-700 shadow-lg shadow-emerald-700/25">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-stone-900">لوحة الأستاذ</h1>
        <p className="mt-1 text-sm text-stone-500">
          إدارة اشتراكات منصة تدرّج — مخصصة للأستاذ المشرف.
        </p>
      </div>

      <Card>
        <CardContent className="pt-5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">البريد الإلكتروني</Label>
              <Input
                id="admin-email"
                type="email"
                dir="ltr"
                className="text-right"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={PROFESSOR_EMAIL}
                required
              />
              <p className="text-xs text-stone-400">الدخول مسموح فقط ببريد المشرف: {PROFESSOR_EMAIL}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-pass">{passSet ? 'كلمة السر' : 'تعيين كلمة سر (أول مرة)'}</Label>
              <Input
                id="admin-pass"
                type="password"
                dir="ltr"
                className="text-right"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {!passSet && (
              <div className="space-y-1.5">
                <Label htmlFor="admin-pass2">تأكيد كلمة السر</Label>
                <Input
                  id="admin-pass2"
                  type="password"
                  dir="ltr"
                  className="text-right"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {err && <p className="rounded-lg bg-red-50 p-2.5 text-sm font-bold text-red-700">{err}</p>}
            {okMsg && <p className="rounded-lg bg-emerald-50 p-2.5 text-sm font-bold text-emerald-700">{okMsg}</p>}

            <Button type="submit" className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800">
              <KeyRound className="h-4 w-4" />
              {passSet ? 'دخول' : 'حفظ كلمة السر'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-xs leading-5 text-stone-400">
        كلمة السر تُحفظ مجزّأة في متصفح هذا الجهاز فقط. إن نسيتها، أبلغ مطوّر المنصة لإعادة تعيينها.
      </p>
    </div>
  );
}

/* ================= لوحة توليد الأكواد ================= */

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [plan, setPlan] = React.useState<PlanId>('Y1');
  const [note, setNote] = React.useState('');
  const [studentEmail, setStudentEmail] = React.useState('');
  const [lastCode, setLastCode] = React.useState<string | null>(null);
  const [codes, setCodes] = React.useState<AdminCode[]>([]);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setCodes(adminCodes());
  }, []);

  const generate = () => {
    const code = generateCode(plan);
    setLastCode(code);
    setCopied(false);
    setCodes(
      adminSaveCode({
        code,
        plan,
        note: note.trim() || (studentEmail.trim() ? studentEmail.trim() : ''),
        at: new Date().toISOString(),
      }),
    );
    setNote('');
  };

  const copyLast = async () => {
    if (!lastCode) return;
    try {
      await navigator.clipboard.writeText(lastCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // تجاهل
    }
  };

  const stats = React.useMemo(() => {
    const by: Record<string, number> = {};
    for (const c of codes) by[c.plan] = (by[c.plan] ?? 0) + 1;
    return by;
  }, [codes]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* الرأس */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-stone-900">لوحة الأستاذ — إدارة الاشتراكات</h1>
            <p className="text-xs text-stone-500" dir="ltr">{PROFESSOR_EMAIL}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCodes(adminCodes())} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            تحديث
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-1.5 border-red-200 text-red-700 hover:bg-red-50">
            <LogOut className="h-3.5 w-3.5" />
            خروج
          </Button>
        </div>
      </div>

      {/* توليد كود */}
      <Card className="border-r-4 border-r-emerald-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-black text-stone-900">
            <Sparkles className="h-5 w-5 text-amber-500" />
            توليد كود تفعيل جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="gen-plan">الباقة</Label>
              <select
                id="gen-plan"
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
            <div className="space-y-1.5">
              <Label htmlFor="gen-note">ملاحظة (اسم الطالب مثلاً) — اختياري</Label>
              <Input id="gen-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: محمد أمين" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="gen-email">بريد الطالب لإرسال الكود — اختياري</Label>
              <Input
                id="gen-email"
                type="email"
                dir="ltr"
                className="text-right"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="student@example.com"
              />
            </div>
          </div>

          <Button onClick={generate} className="w-full gap-2 bg-emerald-700 hover:bg-emerald-800 sm:w-auto sm:px-8">
            <KeyRound className="h-4 w-4" />
            توليد الكود
          </Button>

          {lastCode && (
            <div className="space-y-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 p-4">
              <div className="text-xs font-black text-emerald-700">الكود المولَّد — صالح للباقة: {PLANS[plan].label}</div>
              <div className="flex flex-wrap items-center gap-3">
                <code dir="ltr" className="rounded-lg bg-white px-4 py-2 font-mono text-lg font-black tracking-wider text-emerald-900 shadow-sm">
                  {lastCode}
                </code>
                <Button size="sm" variant="outline" onClick={copyLast} className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? 'نُسخ ✓' : 'نسخ'}
                </Button>
                {studentEmail.trim() && (
                  <a
                    href={buildCodeDeliveryMailto(studentEmail.trim(), lastCode, plan)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-black text-white hover:bg-emerald-800"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    فتح البريد لإرساله للطالب
                  </a>
                )}
              </div>
              <p className="text-xs leading-5 text-emerald-700">
                انسخ الكود وأرسله للطالب بعد تأكيد الدفع. الكود صالح حتى يعيد الأستاذ تحديث المنصة — لا يحتاج الطالب لأي شيء آخر سوى إدخاله في صفحة «الاشتراك».
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* سجل الأكواد */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-lg font-black text-stone-900">
            <span className="flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-700" />
              سجل الأكواد المولَّدة
            </span>
            <Badge variant="outline" className="font-bold text-stone-500">{codes.length} كود</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">لم تُولِّد أي أكواد بعد على هذا الجهاز.</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                {ALL_PLANS.map((p) =>
                  stats[p.id] ? (
                    <Badge key={p.id} variant="secondary" className="font-bold">
                      {p.shortLabel}: {stats[p.id]}
                    </Badge>
                  ) : null,
                )}
              </div>
              <div className="space-y-2">
                {codes.map((c) => (
                  <div key={c.code} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-stone-200 bg-stone-50/60 px-3 py-2">
                    <code dir="ltr" className="font-mono text-sm font-bold text-stone-800">{c.code}</code>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Badge variant="outline" className="text-[10px] font-black">{PLANS[c.plan].shortLabel}</Badge>
                      {c.note ? <span className="max-w-40 truncate font-bold">{c.note}</span> : null}
                      <span>{formatArDate(c.at)}</span>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(c.code);
                          } catch {
                            // تجاهل
                          }
                        }}
                        className="text-emerald-700 hover:underline"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-stone-400">السجل محفوظ في متصفح هذا الجهاز فقط (آخر 200 كود).</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
