"use client";

// ============================================================
//  @/lib/auth-client.ts — أدوات المصادقة للعميل
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  - تسجيل الدخول/التسجيل/تسجيل الخروج
//  - تخزين JWT في localStorage
//  - إرسال JWT مع كل طلب API
// ============================================================

const TOKEN_KEY = "math-platform-token";

/**
 * يحصل على JWT المخزّن محلياً.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * يخزّن JWT محلياً.
 */
export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * يحذف JWT (تسجيل خروج).
 */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * يُرجع ترويسة Authorization للاستخدام في fetch.
 */
export function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  city?: string | null;
  avatar?: string | null;
}

/**
 * تسجيل جديد.
 */
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  stream?: string;
}): Promise<{ success: boolean; error?: string; user?: AuthUser; token?: string }> {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (data.success && data.token) {
      setToken(data.token);
      return { success: true, user: data.user, token: data.token };
    }
    return { success: false, error: data.error || "فشل التسجيل" };
  } catch (err) {
    return { success: false, error: "تعذّر الاتصال بالخادم" };
  }
}

/**
 * تسجيل دخول.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AuthUser; token?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      setToken(data.token);
      return { success: true, user: data.user, token: data.token };
    }
    return { success: false, error: data.error || "فشل تسجيل الدخول" };
  } catch (err) {
    return { success: false, error: "تعذّر الاتصال بالخادم" };
  }
}

/**
 * معلومات المستخدم الحالي (للتحقق من صحة الـ JWT).
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) return data.user;
    clearToken();
    return null;
  } catch {
    return null;
  }
}

/**
 * تسجيل خروج.
 */
export function logout() {
  clearToken();
}

/**
 * التحقق من تسجيل الدخول.
 */
export function isLoggedIn(): boolean {
  return !!getToken();
}
