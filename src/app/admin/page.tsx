"use client";

// ============================================================
//  /app/admin — لوحة الإدارة الكاملة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  - LoginScreen : الدخول عبر /api/admin/login
//  - AdminDashboard : 4 تبويبات
//    * المدفوعات  (PaymentsTab)      : قائمة + فلترة + تحقق/رفض/إلغاء/انتهاء
//    * التحليلات  (AnalyticsTab)     : Recharts — AreaChart + PieChart + BarChart + 4 بطاقات
//    * الإشعارات  (NotificationsTab) : قائمة + تعليم كمقروء
//    * الإعدادات  (SettingsTab)      : SMTP + دليل App Password + Test Email
//  - كلمة السر: adli2024
//  - STORAGE_KEY = "math_admin_key"
// ============================================================

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ShieldCheck,
  LogIn,
  LogOut,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  CalendarX,
  Bell,
  BellRing,
  Settings as SettingsIcon,
  CreditCard,
  Wallet,
  TrendingUp,
  Coins,
  Send,
  Search,
  Eye,
  Mail,
  KeyRound,
  Video,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";

// ============================================================
//  ثوابت
// ============================================================

const STORAGE_KEY = "math_admin_key";
const DEFAULT_PASSWORD = "adli2024";

const STATUS_BADGE: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "قيد المراجعة", variant: "secondary" },
  VERIFIED: { label: "موثّقة", variant: "default" },
  REJECTED: { label: "مرفوضة", variant: "destructive" },
  EXPIRED: { label: "منتهية", variant: "outline" },
  CANCELLED: { label: "ملغاة", variant: "outline" },
};

const METHOD_LABEL: Record<string, string> = {
  CIB: "CIB",
  BARIDI_MOB: "بريدي موب",
  CCP: "CCP",
  BANK_TRANSFER: "تحويل بنكي",
};

const PLAN_LABEL: Record<string, string> = {
  FREE: "مجاني",
  BASIC: "أساسي",
  PREMIUM: "مميز",
  FAMILY: "عائلي",
};

// ألوان للرسوم البيانية
const PIE_COLORS = ["#2D6A4F", "#40916C", "#74C69D", "#95D5B2", "#B7E4C7"];
const STATUS_COLORS: Record<string, string> = {
  PENDING: "#D4A017",
  VERIFIED: "#2D6A4F",
  REJECTED: "#C9302C",
  EXPIRED: "#6C757D",
  CANCELLED: "#ADB5BD",
};

// ============================================================
//  أنواع البيانات
// ============================================================

interface PaymentRow {
  id: string;
  paymentId: string;
  transactionRef: string | null;
  plan: string;
  method: string;
  amount: number;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED" | "CANCELLED";
  studentName: string | null;
  phone: string;
  email: string | null;
  metadata: string | null;
  verifiedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface NotificationRow {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface StatsData {
  success: boolean;
  totalPayments: number;
  totalVerifiedCount: number;
  totalRevenue: number;
  statusStats: { key: string; name: string; count: number }[];
  methodStats: { key: string; name: string; count: number }[];
  dailyData: {
    date: string;
    label: string;
    count: number;
    verifiedCount: number;
    revenue: number;
  }[];
  statusLabels: Record<string, string>;
  methodLabels: Record<string, string>;
}

interface AdminSettings {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  WEBHOOK_URL: string;
  TELEGRAM_CHAT_ID: string;
  ADMIN_EMAIL: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}

// ============================================================
//  مساعدات
// ============================================================

function fmtAmount(n: number): string {
  return new Intl.NumberFormat("ar-DZ").format(n) + " دج";
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ar-DZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

async function apiFetch<T = unknown>(
  url: string,
  opts: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = opts;
  const headers = new Headers(rest.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (rest.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...rest, headers });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    const msg =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as Record<string, unknown>).error)
        : `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// ============================================================
//  الصفحة الرئيسية
// ============================================================

export default function AdminPage() {
  const [token, setToken] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // استرجاع التوكن من localStorage عند التحميل
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setToken(saved);
    } catch {
      // تجاهل
    }
    setHydrated(true);
  }, []);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    try {
      localStorage.setItem(STORAGE_KEY, newToken);
    } catch {
      // تجاهل
    }
  };

  const handleLogout = () => {
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // تجاهل
    }
  };

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <RefreshCw className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {token ? (
        <AdminDashboard token={token} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

// ============================================================
//  شاشة تسجيل الدخول
// ============================================================

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const { toast } = useToast();
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch<{ success: boolean; token: string; message?: string }>(
        "/api/admin/login",
        {
          method: "POST",
          body: JSON.stringify({ password: password.trim() }),
        }
      );
      if (data.success && data.token) {
        toast({ title: "تم تسجيل الدخول", description: "مرحباً بك في لوحة الإدارة" });
        onLogin(data.token);
      } else {
        toast({ title: "فشل الدخول", description: "كلمة السر غير صحيحة", variant: "destructive" });
      }
    } catch (err) {
      toast({
        title: "فشل الدخول",
        description: err instanceof Error ? err.message : "خطأ غير معروف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="size-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">لوحة إدارة المنصة</CardTitle>
          <CardDescription>منصة الرياضيات — الأستاذ عدلي أسعد</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">كلمة السر</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !password.trim()}>
              {loading ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  جارٍ التحقق...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  دخول
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              كلمة السر الافتراضية محفوظة في الإعدادات. للحصول على صلاحية الإدارة،
              تواصل مع الأستاذ.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
//  لوحة الإدارة الرئيسية
// ============================================================

function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = React.useState("payments");

  return (
    <div className="flex min-h-screen flex-col">
      {/* الترويسة */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold">لوحة الإدارة</h1>
              <p className="text-xs text-muted-foreground">
                منصة الرياضيات — الأستاذ عدلي أسعد
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/admin/videos"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-background px-3 text-sm font-medium hover:bg-accent"
            >
              <Video className="size-4" />
              رفع الفيديوهات
            </a>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="size-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      {/* التبويبات */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="payments">
              <CreditCard className="size-4" />
              المدفوعات
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="size-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="size-4" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="size-4" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="content-check">
              <ShieldCheck className="size-4" />
              فحص المحتوى
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-4">
            <PaymentsTab token={token} />
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <AnalyticsTab token={token} />
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <NotificationsTab token={token} />
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <SettingsTab token={token} />
          </TabsContent>
          <TabsContent value="content-check" className="mt-4">
            <ContentCheckTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* التذييل */}
      <footer className="border-t bg-background py-4">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground">
          © منصة الرياضيات — الأستاذ عدلي أسعد — لوحة الإدارة
        </div>
      </footer>
    </div>
  );
}

// ============================================================
//  تبويب المدفوعات
// ============================================================

function PaymentsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [payments, setPayments] = React.useState<PaymentRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [search, setSearch] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const fetchPayments = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const url = `/api/admin/payments${params.toString() ? "?" + params.toString() : ""}`;
      const data = await apiFetch<{ success: boolean; payments: PaymentRow[] }>(url, {
        method: "GET",
        token,
      });
      setPayments(data.payments ?? []);
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر جلب المدفوعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, search, toast]);

  React.useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const handleAction = async (
    paymentId: string,
    action: "verify" | "reject" | "expire" | "cancel"
  ) => {
    const actionLabel: Record<typeof action, string> = {
      verify: "تأكيد التحقق",
      reject: "رفض",
      expire: "إنهاء الصلاحية",
      cancel: "إلغاء",
    };
    const durationMonths =
      action === "verify" ? window.prompt("عدد شهور الاشتراك:", "1") : null;
    if (action === "verify" && !durationMonths) return;

    setActionLoading(paymentId + ":" + action);
    try {
      const body: Record<string, unknown> = { paymentId, action };
      if (action === "verify" && durationMonths) {
        const months = parseInt(durationMonths, 10);
        if (!Number.isFinite(months) || months <= 0) {
          throw new Error("عدد الشهور غير صالح");
        }
        body.durationMonths = months;
      }
      await apiFetch<{ success: boolean; payment: PaymentRow }>(
        "/api/admin/payments",
        { method: "PATCH", body: JSON.stringify(body), token }
      );
      toast({
        title: "تم",
        description: `${actionLabel[action]} — ${paymentId}`,
      });
      await fetchPayments();
    } catch (err) {
      toast({
        title: "فشل",
        description: err instanceof Error ? err.message : "خطأ",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>إدارة المدفوعات</CardTitle>
            <CardDescription>
              اعرض، فلتر، ووثّق/ارفض الدفعات الواردة من الطلاب.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => void fetchPayments()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
        </div>

        {/* الفلاتر */}
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pr-9"
                placeholder="بحث: paymentId، رقم العملية، الهاتف، الاسم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void fetchPayments();
                }}
              />
            </div>
          </div>
          <div className="w-full sm:w-56">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setTimeout(() => void fetchPayments(), 0);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">كل الحالات</SelectItem>
                <SelectItem value="PENDING">قيد المراجعة</SelectItem>
                <SelectItem value="VERIFIED">موثّقة</SelectItem>
                <SelectItem value="REJECTED">مرفوضة</SelectItem>
                <SelectItem value="EXPIRED">منتهية</SelectItem>
                <SelectItem value="CANCELLED">ملغاة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && payments.length === 0 ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CreditCard className="size-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              لا توجد مدفوعات بهذه الفلاتر.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>معرّف الدفعة</TableHead>
                  <TableHead>الطالب</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>الباقة</TableHead>
                  <TableHead>الطريقة</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>رقم العملية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-center">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => {
                  const badge = STATUS_BADGE[p.status] ?? {
                    label: p.status,
                    variant: "outline" as const,
                  };
                  const isPending = p.status === "PENDING";
                  const isFinal = p.status === "VERIFIED" || p.status === "REJECTED";
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.paymentId}</TableCell>
                      <TableCell>{p.studentName || "—"}</TableCell>
                      <TableCell className="font-mono text-xs" dir="ltr">{p.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{PLAN_LABEL[p.plan] ?? p.plan}</Badge>
                      </TableCell>
                      <TableCell>{METHOD_LABEL[p.method] ?? p.method}</TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {fmtAmount(p.amount)}
                      </TableCell>
                      <TableCell className="font-mono text-xs" dir="ltr">
                        {p.transactionRef || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {fmtDate(p.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center justify-center gap-1">
                          {isPending && (
                            <>
                              <ActionButton
                                loading={actionLoading === p.paymentId + ":verify"}
                                onClick={() => void handleAction(p.paymentId, "verify")}
                                variant="default"
                                label="توثيق"
                                icon={<CheckCircle2 className="size-3.5" />}
                              />
                              <ActionButton
                                loading={actionLoading === p.paymentId + ":reject"}
                                onClick={() => void handleAction(p.paymentId, "reject")}
                                variant="destructive"
                                label="رفض"
                                icon={<XCircle className="size-3.5" />}
                              />
                            </>
                          )}
                          {!isFinal && !isPending && (
                            <>
                              <ActionButton
                                loading={actionLoading === p.paymentId + ":expire"}
                                onClick={() => void handleAction(p.paymentId, "expire")}
                                variant="outline"
                                label="إنهاء"
                                icon={<CalendarX className="size-3.5" />}
                              />
                              <ActionButton
                                loading={actionLoading === p.paymentId + ":cancel"}
                                onClick={() => void handleAction(p.paymentId, "cancel")}
                                variant="outline"
                                label="إلغاء"
                                icon={<Ban className="size-3.5" />}
                              />
                            </>
                          )}
                          {isFinal && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActionButton({
  loading,
  onClick,
  variant,
  label,
  icon,
}: {
  loading: boolean;
  onClick: () => void;
  variant: "default" | "destructive" | "outline" | "secondary";
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Button
      size="sm"
      variant={variant}
      onClick={onClick}
      disabled={loading}
      className="h-7 px-2 text-xs"
    >
      {loading ? <RefreshCw className="size-3 animate-spin" /> : icon}
      {label}
    </Button>
  );
}

// ============================================================
//  تبويب التحليلات
// ============================================================

function AnalyticsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [stats, setStats] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchStats = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<StatsData>("/api/admin/stats", {
        method: "GET",
        token,
      });
      setStats(data);
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر جلب الإحصائيات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  React.useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertTriangle className="size-10 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">لا توجد بيانات إحصائية.</p>
      </div>
    );
  }

  const pendingCount =
    stats.statusStats.find((s) => s.key === "PENDING")?.count ?? 0;

  return (
    <div className="space-y-4">
      {/* بطاقات الإحصاء */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي المدفوعات"
          value={new Intl.NumberFormat("ar-DZ").format(stats.totalPayments)}
          icon={<CreditCard className="size-5" />}
          tint="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
        />
        <StatCard
          title="مدفوعات موثّقة"
          value={new Intl.NumberFormat("ar-DZ").format(stats.totalVerifiedCount)}
          icon={<CheckCircle2 className="size-5" />}
          tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <StatCard
          title="الإيرادات"
          value={fmtAmount(stats.totalRevenue)}
          icon={<Coins className="size-5" />}
          tint="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <StatCard
          title="قيد المراجعة"
          value={new Intl.NumberFormat("ar-DZ").format(pendingCount)}
          icon={<Clock className="size-5" />}
          tint="bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300"
        />
      </div>

      {/* الرسم البياني اليومي (AreaChart) */}
      <Card>
        <CardHeader>
          <CardTitle>المدفوعات آخر 7 أيام</CardTitle>
          <CardDescription>عدد المدفوعات اليومية (إجمالي وموثّقة).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40916C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#40916C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    direction: "rtl",
                    fontFamily: "Tahoma, sans-serif",
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Legend wrapperStyle={{ fontFamily: "Tahoma, sans-serif" }} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="إجمالي"
                  stroke="#2D6A4F"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
                <Area
                  type="monotone"
                  dataKey="verifiedCount"
                  name="موثّقة"
                  stroke="#40916C"
                  strokeWidth={2}
                  fill="url(#colorVerified)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* PieChart + BarChart جنباً إلى جنب */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>توزيع المدفوعات حسب الحالة</CardTitle>
            <CardDescription>عدد المدفوعات في كل حالة.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(entry) => `${entry.name}: ${entry.count}`}
                    labelLine={false}
                  >
                    {stats.statusStats.map((entry, i) => (
                      <Cell
                        key={entry.key}
                        fill={STATUS_COLORS[entry.key] ?? PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      direction: "rtl",
                      fontFamily: "Tahoma, sans-serif",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontFamily: "Tahoma, sans-serif" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>توزيع المدفوعات حسب طريقة الدفع</CardTitle>
            <CardDescription>عدد المدفوعات لكل وسيلة دفع.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.methodStats} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      direction: "rtl",
                      fontFamily: "Tahoma, sans-serif",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="count" name="عدد" fill="#2D6A4F" radius={[6, 6, 0, 0]}>
                    {stats.methodStats.map((entry, i) => (
                      <Cell key={entry.key} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* زر تحديث */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => void fetchStats()} disabled={loading}>
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          تحديث الإحصائيات
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  tint,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tint: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex size-12 items-center justify-center rounded-lg ${tint}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
//  تبويب الإشعارات
// ============================================================

function NotificationsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [onlyUnread, setOnlyUnread] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = `/api/admin/notifications${onlyUnread ? "?unread=true" : ""}`;
      const data = await apiFetch<{
        success: boolean;
        notifications: NotificationRow[];
        unreadCount: number;
      }>(url, { method: "GET", token });
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر جلب الإشعارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, onlyUnread, toast]);

  React.useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const markOne = async (id: string) => {
    try {
      await apiFetch("/api/admin/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
        token,
      });
      await fetchNotifications();
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر التحديث",
        variant: "destructive",
      });
    }
  };

  const markAll = async () => {
    try {
      const r = await apiFetch<{ success: boolean; updated: number }>(
        "/api/admin/notifications",
        { method: "PATCH", body: JSON.stringify({ all: true }), token }
      );
      toast({ title: "تم", description: `تم تعليم ${r.updated} إشعار كمقروء` });
      await fetchNotifications();
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر التحديث",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="size-5" />
              الإشعارات
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full">
                  {new Intl.NumberFormat("ar-DZ").format(unreadCount)} جديدة
                </Badge>
              )}
            </CardTitle>
            <CardDescription>إشعارات لوحة الإدارة حول المدفوعات والأحداث.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={onlyUnread ? "default" : "outline"}
              size="sm"
              onClick={() => setOnlyUnread((v) => !v)}
            >
              {onlyUnread ? "عرض المقروءة فقط ✓" : "عرض الكل"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => void fetchNotifications()} disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              تحديث
            </Button>
            {unreadCount > 0 && (
              <Button variant="default" size="sm" onClick={() => void markAll()}>
                <CheckCircle2 className="size-4" />
                تعليم الكل كمقروء
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="size-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">لا توجد إشعارات.</p>
          </div>
        ) : (
          <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition ${
                  n.read ? "bg-background" : "bg-primary/5 border-primary/30"
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  {n.type === "success" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : n.type === "warning" ? (
                    <AlertTriangle className="size-4 text-amber-600" />
                  ) : n.type === "alert" ? (
                    <XCircle className="size-4 text-red-600" />
                  ) : (
                    <Bell className="size-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{n.title}</p>
                    {!n.read && (
                      <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="غير مقروء" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{fmtDate(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 shrink-0 px-2 text-xs"
                    onClick={() => void markOne(n.id)}
                  >
                    <Eye className="size-3" />
                    مقروء
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
//  تبويب الإعدادات
// ============================================================

const SETTINGS_FIELDS: {
  key: keyof AdminSettings;
  label: string;
  type: "text" | "password" | "number";
  placeholder?: string;
  hint?: string;
  group: "smtp" | "email" | "admin" | "webhook";
}[] = [
  { key: "ADMIN_EMAIL", label: "بريد المسؤول", type: "text", placeholder: "asaadadli9393@gmail.com", hint: "يستقبل إشعارات المنصة", group: "admin" },
  { key: "SMTP_HOST", label: "SMTP Host", type: "text", placeholder: "smtp.gmail.com", group: "smtp" },
  { key: "SMTP_PORT", label: "SMTP Port", type: "text", placeholder: "587", hint: "587 لـ STARTTLS، 465 لـ SSL", group: "smtp" },
  { key: "SMTP_USER", label: "SMTP User", type: "text", placeholder: "your_email@gmail.com", group: "smtp" },
  { key: "SMTP_PASS", label: "SMTP Pass", type: "password", placeholder: "App Password (16 char)", hint: "App Password من Gmail — راجع الدليل أدناه", group: "smtp" },
  { key: "SMTP_FROM", label: "SMTP From", type: "text", placeholder: "no-reply@math.dz", group: "smtp" },
  { key: "RESEND_API_KEY", label: "Resend API Key", type: "password", placeholder: "re_xxxxx...", hint: "اختياري — بديل عن SMTP", group: "email" },
  { key: "RESEND_FROM_EMAIL", label: "Resend From Email", type: "text", placeholder: "no-reply@math.dz", group: "email" },
  { key: "WEBHOOK_URL", label: "Webhook URL", type: "text", placeholder: "https://...", hint: "اختياري — يُستدعى عند أحداث الدفع", group: "webhook" },
  { key: "TELEGRAM_CHAT_ID", label: "Telegram Chat ID", type: "text", placeholder: "123456789", group: "webhook" },
];

const GROUP_LABEL: Record<string, string> = {
  smtp: "إعدادات SMTP",
  email: "إعدادات Resend (بديل)",
  admin: "إعدادات المسؤول",
  webhook: "تكاملات خارجية",
};

function SettingsTab({ token }: { token: string }) {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<AdminSettings | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);

  const fetchSettings = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ success: boolean; settings: AdminSettings }>(
        "/api/admin/settings",
        { method: "GET", token }
      );
      setSettings(data.settings);
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر جلب الإعدادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  React.useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await apiFetch("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(settings),
        token,
      });
      toast({ title: "تم الحفظ", description: "تم تحديث الإعدادات بنجاح" });
    } catch (err) {
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "تعذّر الحفظ",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      const data = await apiFetch<{ success: boolean; to: string; messageId?: string; error?: string }>(
        "/api/admin/test-email",
        { method: "POST", body: JSON.stringify({}), token }
      );
      if (data.success) {
        toast({
          title: "تم الإرسال",
          description: `تم إرسال بريد اختبار إلى ${data.to}`,
        });
      } else {
        toast({
          title: "فشل الإرسال",
          description: data.error ?? "خطأ غير معروف",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "فشل الإرسال",
        description: err instanceof Error ? err.message : "خطأ",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!settings) return null;

  const groups = Array.from(new Set(SETTINGS_FIELDS.map((f) => f.group)));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>إعدادات لوحة الإدارة</CardTitle>
              <CardDescription>
                إعدادات SMTP والبريد والتكاملات. كل الحقول محفوظة في قاعدة البيانات.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => void fetchSettings()} disabled={loading}>
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
                تحديث
              </Button>
              <Button variant="default" size="sm" onClick={() => void handleSave()} disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    حفظ الإعدادات
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {groups.map((g) => (
            <div key={g} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {GROUP_LABEL[g]}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SETTINGS_FIELDS.filter((f) => f.group === g).map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Input
                      id={f.key}
                      type={f.type}
                      value={settings[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        setSettings({ ...settings, [f.key]: e.target.value })
                      }
                    />
                    {f.hint && (
                      <p className="text-xs text-muted-foreground">{f.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* بطاقة بريد اختبار */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="size-5" />
            اختبار إرسال البريد
          </CardTitle>
          <CardDescription>
            يُرسل بريد اختبار إلى <code className="rounded bg-muted px-1">{settings.ADMIN_EMAIL || "ADMIN_EMAIL"}</code> عبر إعدادات SMTP المحفوظة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => void handleTestEmail()} disabled={testing}>
            {testing ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Mail className="size-4" />
                إرسال بريد اختبار
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* دليل Gmail App Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-5" />
            دليل إنشاء Gmail App Password
          </CardTitle>
          <CardDescription>
            للحصول على SMTP_PASS (16 خانة) من حساب Gmail بدلاً من كلمة السر العادية.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <Step n={1}>
            افتح <a className="text-primary underline" href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer">إعدادات أمان Google</a>.
          </Step>
          <Step n={2}>
            فعّل التحقق بخطوتين (2-Step Verification) إن لم يكن مفعّلاً.
          </Step>
          <Step n={3}>
            اذهب إلى <a className="text-primary underline" href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">App Passwords</a> (كلمات مرور التطبيقات).
          </Step>
          <Step n={4}>
            اختر اسم التطبيق (مثلاً "Math Platform") ثم اضغط Create.
          </Step>
          <Step n={5}>
            انسخ كلمة المرور المكوّنة من 16 خانة (بدون مسافات) والصقها في حقل <strong>SMTP_PASS</strong>.
          </Step>
          <Step n={6}>
            اضبط <strong>SMTP_USER</strong> = بريدك@gmail.com، <strong>SMTP_HOST</strong> = smtp.gmail.com، <strong>SMTP_PORT</strong> = 587.
          </Step>
          <Step n={7}>
            احفظ الإعدادات ثم اضغط "إرسال بريد اختبار" للتأكد.
          </Step>
          <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="inline-block size-4 align-text-bottom" />
            <span className="mr-1">ملاحظة أمنية:</span>
            لا تشارك App Password مع أحد، ولا تضعها في الكود. هذه اللوحة تحفظها في قاعدة البيانات فقط.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {n}
      </div>
      <p className="pt-0.5">{children}</p>
    </div>
  );
}

// ============================================================
//  ContentCheckTab — فحص آلي للمحتوى الرياضي
//  يستعمل المساعد الذكي لكشف الأخطا وأنواعها
// ============================================================

function ContentCheckTab() {
  const [scanning, setScanning] = React.useState(false);
  const [results, setResults] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [customContent, setCustomContent] = React.useState("");
  const [customResults, setCustomResults] = React.useState<any>(null);
  const [customLoading, setCustomLoading] = React.useState(false);

  async function handleFullScan() {
    setScanning(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/ai-content-check", {
        headers: { Authorization: `Bearer adli2024` },
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || "فشل الفحص");
      }
    } catch (err) {
      setError("تعذّر الاتصال بالخادم");
    }
    setScanning(false);
  }

  async function handleCustomCheck() {
    if (!customContent.trim()) return;
    setCustomLoading(true);
    setError(null);
    setCustomResults(null);
    try {
      const res = await fetch("/api/ai-content-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: customContent, fileType: "محتوى مخصص" }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomResults(data);
      } else {
        setError(data.error || "فشل الفحص");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم");
    }
    setCustomLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* رأس القسم */}
      <Card className="border-r-4 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            الفحص الآلي للمحتوى
          </CardTitle>
          <CardDescription>
            نظام ذكي يستعمل المساعد الذكي لفحص كل المحتوى الرياضي في المنصة وكشف الأخطا تلقائياً: أخطا LaTeX، أخطا رياضية، أخطا بيداغوجية، وأخطا التسميات.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleFullScan} disabled={scanning} size="lg" className="w-full gap-2">
            {scanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جارٍ فحص المحتوى...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                ابدأ الفحص الشامل
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* نتائج الفحص الشامل */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج الفحص الشامل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* إحصائيات */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{results.stats?.unitsChecked || 0}</div>
                <div className="text-xs text-muted-foreground">وحدات مفحوصة</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.stats?.errors || 0}</div>
                <div className="text-xs text-muted-foreground">أخطا</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{results.stats?.warnings || 0}</div>
                <div className="text-xs text-muted-foreground">تحذيرات</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.stats?.byType?.latex || 0}</div>
                <div className="text-xs text-muted-foreground">LaTeX</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{results.stats?.byType?.math || 0}</div>
                <div className="text-xs text-muted-foreground">رياضية</div>
              </div>
            </div>

            {/* تفاصيل الأخطا */}
            {results.results?.map((unitResult: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-bold text-sm">{unitResult.unit}</h3>
                {unitResult.issues.length === 0 ? (
                  <p className="text-xs text-green-600 pr-4">✅ لا أخطا</p>
                ) : (
                  unitResult.issues.map((issue: any, i: number) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-sm ${
                        issue.severity === "error"
                          ? "border-red-300 bg-red-50"
                          : "border-amber-300 bg-amber-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={
                            issue.severity === "error"
                              ? "text-red-700 border-red-400"
                              : "text-amber-700 border-amber-400"
                          }
                        >
                          {issue.severity === "error" ? "خطأ" : "تحذير"}
                        </Badge>
                        <Badge variant="outline">{issue.type}</Badge>
                      </div>
                      <p className="text-sm">{issue.description}</p>
                      {issue.suggestion && (
                        <p className="text-xs text-green-700 mt-1">
                          ✏️ التصحيح: {issue.suggestion}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* فحص مخصص */}
      <Card>
        <CardHeader>
          <CardTitle>فحص محتوى مخصص</CardTitle>
          <CardDescription>
            الصق أي محتوى رياضي (نص، معادلات، حلول) لفحصه آلياً.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            placeholder="الصق هنا المحتوى الذي تريد فحصه..."
            className="min-h-[200px] font-mono text-sm"
            dir="rtl"
          />
          <Button onClick={handleCustomCheck} disabled={customLoading || !customContent.trim()} className="w-full gap-2">
            {customLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جارٍ الفحص...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                افحص المحتوى
              </>
            )}
          </Button>

          {/* نتائج الفحص المخصص */}
          {customResults && (
            <div className="space-y-2 mt-4">
              <div className="text-sm font-bold">
                {customResults.stats?.total || 0} مشكلة مكتشفة
              </div>
              {customResults.issues?.map((issue: any, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border text-sm ${
                    issue.severity === "error"
                      ? "border-red-300 bg-red-50"
                      : issue.severity === "warning"
                      ? "border-amber-300 bg-amber-50"
                      : "border-blue-300 bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={
                      issue.severity === "error" ? "text-red-700 border-red-400" :
                      issue.severity === "warning" ? "text-amber-700 border-amber-400" :
                      "text-blue-700 border-blue-400"
                    }>
                      {issue.severity === "error" ? "خطأ" : issue.severity === "warning" ? "تحذير" : "معلومة"}
                    </Badge>
                    <Badge variant="outline">{issue.type}</Badge>
                  </div>
                  <p className="text-sm">{issue.description}</p>
                  {issue.suggestion && (
                    <p className="text-xs text-green-700 mt-1">✏️ {issue.suggestion}</p>
                  )}
                  {issue.snippet && (
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      "{issue.snippet.substring(0, 100)}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
