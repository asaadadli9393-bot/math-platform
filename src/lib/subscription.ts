'use client';

import { useSyncExternalStore } from 'react';

/* ============================================================
   نظام الاشتراك المزدوج — منصة تدرّج للرياضيات
   الأستاذ المشرف: asaadadli9393@gmail.com
   ------------------------------------------------------------
   - باقتان أساسيتان: شهري / سنوي (+ أكواد 3 أشهر ودائم عبر الأستاذ)
   - مسارَا تفعيل مزدوجان:
       1) طلب اشتراك عبر البريد الإلكتروني → كود يصل الطالب بالبريد
       2) تفعيل فوري بإدخال الكود في صفحة الاشتراك
   - لوحة الأستاذ: دخول ببريد asaadadli9393@gmail.com لتوليد الأكواد
   - كل شيء يعمل بدون خادم (localStorage) — متوافق مع نشر Vercel الثابت
   ============================================================ */

export const PROFESSOR_EMAIL = 'asaadadli9393@gmail.com';

/* ---------------- الباقات ---------------- */

export type PlanId = 'M1' | 'M3' | 'Y1' | 'LT';

export interface PlanInfo {
  id: PlanId;
  /** مدة الاشتراك بالأشهر، null = دائم */
  months: number | null;
  label: string;
  shortLabel: string;
  priceDzd: number;
  note: string;
}

export const PLANS: Record<PlanId, PlanInfo> = {
  M1: { id: 'M1', months: 1, label: 'الاشتراك الشهري', shortLabel: 'شهري', priceDzd: 500, note: 'شهر كامل من الوصول للمحتوى المميز' },
  M3: { id: 'M3', months: 3, label: 'اشتراك 3 أشهر', shortLabel: '3 أشهر', priceDzd: 1200, note: 'توفير 300 دج مقارنة بالشهري' },
  Y1: { id: 'Y1', months: 12, label: 'الاشتراك السنوي', shortLabel: 'سنوي', priceDzd: 3000, note: 'أفضل قيمة — توفر 3000 دج' },
  LT: { id: 'LT', months: null, label: 'الاشتراك الدائم', shortLabel: 'دائم', priceDzd: 5000, note: 'وصول دائم بدون تجديد' },
};

/** الباقتان المعروضان في صفحة الاشتراك (النظام المزدوج) */
export const DUAL_PLANS: PlanInfo[] = [PLANS.M1, PLANS.Y1];
export const ALL_PLANS: PlanInfo[] = [PLANS.M1, PLANS.M3, PLANS.Y1, PLANS.LT];

/* ---------------- حالة الاشتراك ---------------- */

export interface SubscriptionState {
  tier: 'free' | 'premium';
  email?: string;
  plan?: PlanId;
  code?: string;
  activatedAt?: string;
  /** null = دائم */
  expiresAt?: string | null;
}

const KEY = 'tadaruj-subscription-v1';

const FREE: SubscriptionState = { tier: 'free' };

let state: SubscriptionState = FREE;
let loaded = false;
const listeners = new Set<() => void>();

function loadFromStorage(): SubscriptionState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return FREE;
    const parsed = JSON.parse(raw) as Partial<SubscriptionState>;
    if (parsed.tier !== 'premium' || !parsed.code || !parsed.plan) return FREE;
    return {
      tier: 'premium',
      email: parsed.email ?? '',
      plan: parsed.plan,
      code: parsed.code,
      activatedAt: parsed.activatedAt,
      expiresAt: parsed.expiresAt ?? null,
    };
  } catch {
    return FREE;
  }
}

function getSnapshot(): SubscriptionState {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true;
    state = loadFromStorage();
  }
  return state;
}

function getServerSnapshot(): SubscriptionState {
  return FREE;
}

function set(next: SubscriptionState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // تجاهل أخطاء الحصة
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/* ---------------- محرك أكواد التفعيل ----------------
   الكود بالشكل: TDJ-<الباقة>-<مسلسل4>-<تحقق4>
   التحقق دالة تجزئة (djb2) بملح مخفي داخل الحزمة —
   يمنع توليد أكواد عشوائية صالحة، والأكواد الحقيقية
   يوزعها الأستاذ فقط بعد تأكيد الدفع.
   -------------------------------------------------- */

const SECRET = ['ADLI', 'TADARUJ', 'x9#', '2026'].join('~');

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // بدون أحرف/أرقام ملتبسة

function checksum(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((((h << 5) + h) >>> 0) + input.charCodeAt(i)) >>> 0;
  }
  let out = '';
  let v = h;
  for (let i = 0; i < 4; i++) {
    out = ALPHABET[v % 32] + out;
    v = Math.floor(v / 32);
  }
  return out;
}

function randomSerial(): string {
  const buf = new Uint8Array(4);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < 4; i++) buf[i] = Math.floor(Math.random() * 256);
  }
  let out = '';
  for (let i = 0; i < 4; i++) out += ALPHABET[buf[i] % 32];
  return out;
}

/** توليد كود تفعيل لباقة معينة (للاستخدام في لوحة الأستاذ) */
export function generateCode(plan: PlanId): string {
  const serial = randomSerial();
  const check = checksum(`${SECRET}|${plan}|${serial}`);
  return `TDJ-${plan}-${serial}-${check}`;
}

export type CodeValidation = { ok: true; plan: PlanId } | { ok: false; reason: string };

/** التحقق من صحة كود التفعيل */
export function validateCode(raw: string): CodeValidation {
  const code = raw.trim().toUpperCase().replace(/\s+/g, '');
  const m = /^TDJ-(M1|M3|Y1|LT)-([A-Z2-9]{4})-([A-Z2-9]{4})$/.exec(code);
  if (!m) return { ok: false, reason: 'صيغة الكود غير صحيحة — يجب أن يكون بالشكل TDJ-XX-XXXX-XXXX' };
  const plan = m[1] as PlanId;
  const serial = m[2];
  const check = m[3];
  const expected = checksum(`${SECRET}|${plan}|${serial}`);
  if (check !== expected) {
    return { ok: false, reason: 'الكود غير صالح — تأكد من كتابته كما وصلك في البريد تماماً' };
  }
  return { ok: true, plan };
}

/* ---------------- العمليات ---------------- */

export function activate(email: string, rawCode: string): { ok: true; plan: PlanInfo } | { ok: false; reason: string } {
  const v = validateCode(rawCode);
  if (!v.ok) return v;
  const plan = PLANS[v.plan];
  const now = new Date();
  const expiresAt =
    plan.months === null
      ? null
      : new Date(now.getTime() + plan.months * 30 * 24 * 3600 * 1000).toISOString();
  set({
    tier: 'premium',
    email: email.trim(),
    plan: v.plan,
    code: rawCode.trim().toUpperCase().replace(/\s+/g, ''),
    activatedAt: now.toISOString(),
    expiresAt,
  });
  return { ok: true, plan };
}

export function deactivate() {
  set({ tier: 'free' });
}

/* ---------------- أدوات مساعدة ---------------- */

export function isPremiumActive(s: SubscriptionState): boolean {
  if (s.tier !== 'premium') return false;
  if (s.expiresAt === null || s.expiresAt === undefined) return true;
  return Date.now() < new Date(s.expiresAt).getTime();
}

export function daysLeft(s: SubscriptionState): number | null {
  if (s.tier !== 'premium') return null;
  if (s.expiresAt === null || s.expiresAt === undefined) return null; // دائم
  const ms = new Date(s.expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 3600 * 1000)));
}

export function formatArDate(iso?: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

/** بناء رابط mailto لطلب اشتراك يصل بريد الأستاذ */
export function buildRequestMailto(opts: {
  name: string;
  email: string;
  year: string;
  plan: PlanId;
  payment: string;
}): string {
  const plan = PLANS[opts.plan];
  const subject = `طلب اشتراك — ${plan.label} (${plan.priceDzd} دج)`;
  const body = [
    'السلام عليكم أستاذ عدلي،',
    '',
    'أرغب في الاشتراك في منصة تدرّج للرياضيات، وهذه بياناتي:',
    '',
    `• الاسم الكامل: ${opts.name}`,
    `• البريد الإلكتروني: ${opts.email}`,
    `• المستوى الدراسي: ${opts.year}`,
    `• الباقة المطلوبة: ${plan.label} — ${plan.priceDzd} دج`,
    `• طريقة الدفع المفضلة: ${opts.payment}`,
    '',
    'بانتظار تفاصيل الدفع وكود التفعيل. وشكراً.',
    '',
    '— أُرسل هذا الطلب من صفحة الاشتراك في منصة تدرّج',
  ].join('\n');
  return `mailto:${PROFESSOR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** بناء رابط mailto يفتح على بريد الطالب مع كود التفعيل (من لوحة الأستاذ) */
export function buildCodeDeliveryMailto(studentEmail: string, code: string, plan: PlanId): string {
  const planInfo = PLANS[plan];
  const subject = 'كود تفعيل اشتراكك في منصة تدرّج للرياضيات';
  const body = [
    'السلام عليكم،',
    '',
    'تم تأكيد اشتراكك. هذا هو كود التفعيل الخاص بك:',
    '',
    `الكود: ${code}`,
    `الباقة: ${planInfo.label} (${planInfo.priceDzd} دج)`,
    '',
    'خطوات التفعيل:',
    '1) افتح منصة تدرّج',
    '2) انتقل إلى صفحة «الاشتراك»',
    '3) في قسم «تفعيل بكود التفعيل» أدخل بريدك الإلكتروني ثم الكود',
    '4) اضغط «تفعيل الاشتراك»',
    '',
    'مع تمنياتي لك بالنجاح والتفوق.',
    'الأستاذ عدلي اسعد',
  ].join('\n');
  return `mailto:${studentEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ---------------- لوحة الأستاذ (حساب محلي) ----------------
   كلمة السر تُخزن مجزّأة في متصفح الأستاذ فقط — الدخول يحمي
   واجهة توليد الأكواد على هذا الجهاز.
   -------------------------------------------------------- */

const ADMIN_PASS_KEY = 'tadaruj-admin-pass-v1';
const ADMIN_CODES_KEY = 'tadaruj-admin-codes-v1';
const ADMIN_SESSION_KEY = 'tadaruj-admin-session-v1';

function adminHash(input: string): string {
  return checksum(`${SECRET}|admin|${input}`);
}

export function adminHasPassword(): boolean {
  try {
    return !!window.localStorage.getItem(ADMIN_PASS_KEY);
  } catch {
    return false;
  }
}

export function adminSetPassword(pass: string): boolean {
  if (pass.length < 6) return false;
  try {
    window.localStorage.setItem(ADMIN_PASS_KEY, adminHash(pass));
    return true;
  } catch {
    return false;
  }
}

export function adminLogin(email: string, pass: string): { ok: boolean; reason?: string } {
  if (email.trim().toLowerCase() !== PROFESSOR_EMAIL) {
    return { ok: false, reason: `هذه اللوحة مخصصة للأستاذ المشرف فقط (${PROFESSOR_EMAIL})` };
  }
  try {
    const stored = window.localStorage.getItem(ADMIN_PASS_KEY);
    if (!stored) return { ok: false, reason: 'لم تُعيَّن كلمة سر بعد — عيّنها من الحقل أعلاه' };
    if (stored !== adminHash(pass)) return { ok: false, reason: 'كلمة السر غير صحيحة' };
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    return { ok: true };
  } catch {
    return { ok: false, reason: 'تعذر الوصول إلى التخزين المحلي' };
  }
}

export function adminLoggedIn(): boolean {
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function adminLogout() {
  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // تجاهل
  }
}

export interface AdminCode {
  code: string;
  plan: PlanId;
  note: string;
  at: string;
}

export function adminCodes(): AdminCode[] {
  try {
    const raw = window.localStorage.getItem(ADMIN_CODES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminCode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function adminSaveCode(entry: AdminCode): AdminCode[] {
  const list = [entry, ...adminCodes()].slice(0, 200);
  try {
    window.localStorage.setItem(ADMIN_CODES_KEY, JSON.stringify(list));
  } catch {
    // تجاهل
  }
  return list;
}

/* ---------------- الخطاف ---------------- */

export function useSubscription() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    state: current,
    isPremium: isPremiumActive(current),
    daysLeft: daysLeft(current),
    activate,
    deactivate,
  };
}
