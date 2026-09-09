// ============================================================
//  @/lib/notifications.ts — مركز الإشعارات للوحة الإدارة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
//  يُنشئ إشعارات داخل قاعدة البيانات (جدول Notification) عند:
//   - إنشاء دفعة جديدة (PENDING)
//   - التحقق من دفعة (VERIFIED)
//   - رفض دفعة (REJECTED)
//   - انتهاء صلاحية دفعة (EXPIRED)
//   - إلغاء دفعة (CANCELLED)
//
//  ملاحظة: نستعمل userId "admin" وهمي لإشعارات لوحة الإدارة
//  لأن النموذج يتطلب userId. نضمن وجوده قبل الاستعمال.
// ============================================================

import { db } from "@/lib/db";

// معرّف مستخدم وهمي ثابت لإشعارات لوحة الإدارة (لن يُحذف)
const ADMIN_USER_ID = "admin-notifications";
const ADMIN_USER_EMAIL = "admin@local";
const ADMIN_USER_NAME = "Admin";

export type NotificationType = "info" | "success" | "warning" | "alert";

export interface CreateNotificationInput {
  title: string;
  body: string;
  type?: NotificationType;
}

/**
 * يضمن وجود مستخدم وهمي "admin-notifications" في جدول User
 * لنتمكن من ربط الإشعارات به. (النموذج يفرض userId غير فارغ.)
 */
async function ensureAdminUser(): Promise<void> {
  try {
    const existing = await db.user.findUnique({
      where: { id: ADMIN_USER_ID },
      select: { id: true },
    });
    if (!existing) {
      await db.user.create({
        data: {
          id: ADMIN_USER_ID,
          email: ADMIN_USER_EMAIL,
          name: ADMIN_USER_NAME,
          passwordHash: "x-admin-notifications-only-x",
          role: "ADMIN",
        },
      });
    }
  } catch {
    // قد يفشل عند أول استدعاء إذا كان الإيميل مستعملاً — نحاول الاستعادة
    try {
      await db.user.upsert({
        where: { id: ADMIN_USER_ID },
        update: {},
        create: {
          id: ADMIN_USER_ID,
          email: ADMIN_USER_EMAIL,
          name: ADMIN_USER_NAME,
          passwordHash: "x-admin-notifications-only-x",
          role: "ADMIN",
        },
      });
    } catch {
      // تجاهل — الإشعار ليس جزءاً حاسماً من الدفعة
    }
  }
}

/**
 * يُنشئ إشعاراً جديداً في قاعدة البيانات.
 * آمن: لا يُسقط العملية الأم إذا فشل الإنشاء.
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<void> {
  try {
    await ensureAdminUser();
    await db.notification.create({
      data: {
        userId: ADMIN_USER_ID,
        title: input.title,
        body: input.body,
        type: input.type ?? "info",
        read: false,
      },
    });
  } catch {
    // لا نُسقط العملية الأم — الإشعار تحسين وليس شرطاً
  }
}

// ============================================================
//  مساعدون جاهزون لمختلف أحداث الدفع
// ============================================================

export async function notifyPaymentCreated(p: {
  paymentId: string;
  plan: string;
  amount: number;
  phone: string;
}): Promise<void> {
  await createNotification({
    title: "دفعة جديدة قيد المراجعة",
    body: `دفعة #${p.paymentId} (${p.plan}) بقيمة ${p.amount} دج — هاتف: ${p.phone}`,
    type: "info",
  });
}

export async function notifyPaymentVerified(p: {
  paymentId: string;
  phone: string;
}): Promise<void> {
  await createNotification({
    title: "تم التحقق من دفعة",
    body: `دفعة #${p.paymentId} مُوثّقة — هاتف: ${p.phone}`,
    type: "success",
  });
}

export async function notifyPaymentRejected(p: {
  paymentId: string;
  phone: string;
}): Promise<void> {
  await createNotification({
    title: "تم رفض دفعة",
    body: `دفعة #${p.paymentId} مرفوضة — هاتف: ${p.phone}`,
    type: "warning",
  });
}

export async function notifyPaymentExpired(p: {
  paymentId: string;
  phone: string;
}): Promise<void> {
  await createNotification({
    title: "انتهت صلاحية دفعة",
    body: `دفعة #${p.paymentId} انتهت صلاحيتها — هاتف: ${p.phone}`,
    type: "alert",
  });
}

export async function notifyPaymentCancelled(p: {
  paymentId: string;
  phone: string;
}): Promise<void> {
  await createNotification({
    title: "تم إلغاء دفعة",
    body: `دفعة #${p.paymentId} مُلغاة — هاتف: ${p.phone}`,
    type: "warning",
  });
}
