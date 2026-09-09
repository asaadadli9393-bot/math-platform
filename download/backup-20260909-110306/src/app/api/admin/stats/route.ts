// ============================================================
//  /api/admin/stats — إحصائيات للرسوم البيانية
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  GET : يُرجع:
//    - totalPayments: عدد المدفوعات الكلي
//    - totalVerifiedCount: عدد المدفوعات الموثّقة
//    - totalRevenue: مجموع الإيرادات (من المدفوعات الموثّقة) بالدينار
//    - statusStats: توزيع المدفوعات حسب الحالة (groupBy status)
//    - methodStats: توزيع المدفوعات حسب طريقة الدفع (groupBy method)
//    - dailyData: المدفوعات آخر 7 أيام (تاريخ + عدد + إيرادات)
//    - statusLabels: تسميات الحالات بالعربية
//    - methodLabels: تسميات طرق الدفع بالعربية
//  محمي بـ Authorization: Bearer ADMIN_KEY
// ============================================================

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

// تسميات عربية للحقول المختلفة
const STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  VERIFIED: "موثّقة",
  REJECTED: "مرفوضة",
  EXPIRED: "منتهية",
  CANCELLED: "ملغاة",
};

const METHOD_LABELS: Record<string, string> = {
  CIB: "CIB",
  BARIDI_MOB: "بريدي موب",
  CCP: "CCP",
  BANK_TRANSFER: "تحويل بنكي",
};

const ALL_STATUSES = ["PENDING", "VERIFIED", "REJECTED", "EXPIRED", "CANCELLED"];
const ALL_METHODS = ["CIB", "BARIDI_MOB", "CCP", "BANK_TRANSFER"];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — Bearer ADMIN_KEY مطلوب" },
      { status: 401 }
    );
  }

  try {
    const payments = await db.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5000,
    });

    // ----- بطاقات الإحصاء الكلية -----
    const totalPayments = payments.length;
    const totalVerifiedCount = payments.filter((p) => p.status === "VERIFIED").length;
    const totalRevenue = payments
      .filter((p) => p.status === "VERIFIED")
      .reduce((acc, p) => acc + p.amount, 0);

    // ----- statusStats: توزيع المدفوعات حسب الحالة -----
    const statusCounts: Record<string, number> = {};
    for (const s of ALL_STATUSES) statusCounts[s] = 0;
    for (const p of payments) {
      statusCounts[p.status] = (statusCounts[p.status] ?? 0) + 1;
    }
    const statusStats = ALL_STATUSES.map((k) => ({
      key: k,
      name: STATUS_LABELS[k] ?? k,
      count: statusCounts[k] ?? 0,
    }));

    // ----- methodStats: توزيع المدفوعات حسب طريقة الدفع -----
    const methodCounts: Record<string, number> = {};
    for (const m of ALL_METHODS) methodCounts[m] = 0;
    for (const p of payments) {
      methodCounts[p.method] = (methodCounts[p.method] ?? 0) + 1;
    }
    const methodStats = ALL_METHODS.map((k) => ({
      key: k,
      name: METHOD_LABELS[k] ?? k,
      count: methodCounts[k] ?? 0,
    }));

    // ----- dailyData: آخر 7 أيام -----
    const dailyData: {
      date: string;
      label: string;
      count: number;
      verifiedCount: number;
      revenue: number;
    }[] = [];
    const today = startOfDay(new Date());
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today.getTime() - i * 24 * 3600 * 1000);
      const dayEnd = new Date(dayStart.getTime() + 24 * 3600 * 1000);
      const dayPayments = payments.filter((p) => {
        const c = new Date(p.createdAt);
        return c >= dayStart && c < dayEnd;
      });
      const verified = dayPayments.filter((p) => p.status === "VERIFIED");
      const label = `${dayStart.getDate()}/${dayStart.getMonth() + 1}`;
      dailyData.push({
        date: dateKey(dayStart),
        label,
        count: dayPayments.length,
        verifiedCount: verified.length,
        revenue: verified.reduce((acc, p) => acc + p.amount, 0),
      });
    }

    return NextResponse.json({
      success: true,
      totalPayments,
      totalVerifiedCount,
      totalRevenue,
      statusStats,
      methodStats,
      dailyData,
      statusLabels: STATUS_LABELS,
      methodLabels: METHOD_LABELS,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "DB error", detail: msg },
      { status: 500 }
    );
  }
}
