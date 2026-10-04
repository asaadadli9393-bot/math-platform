'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, CalendarClock, CheckCircle2, Mail, Sparkles, Video } from 'lucide-react';

// ============================================================
//  LiveClassesView — الحصص المباشرة (قيد الإعداد — نسخة صادقة)
//  منصة الرياضيات | الأستاذ عدلي أسعد
//  لا تُعرض مواعيد أو معرّفات Zoom إلا عند توفر حصص فعلية.
// ============================================================
function LiveClassesView({ isPremium = false, onSubscribe }: { isPremium?: boolean; onSubscribe?: () => void }) {
  const [requested, setRequested] = React.useState(false);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* رأس الصفحة */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Video className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">الحصص المباشرة مع الأستاذ</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          نُعِدّ حالياً حصصاً مباشرة عبر Zoom لمراجعة أهم محاور البكالوريا مع الأستاذ عدلي أسعد.
          عند اكتمال الجدول ستُعلن المواعيد هنا وتُرسل روابط الانضمام للمشتركين مباشرة.
        </p>
      </div>

      {/* بطاقة الحالة */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <CalendarClock className="h-4 w-4" />
            قريباً — قيد الإعداد
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            نفضّل أن نعلن مواعيد حقيقية مضمونة بدلاً من وعود لا نضمنها.
            الحصص ستغطي: المتتاليات، الدوال والنهايات، الاشتقاقية، الأسية واللوغاريتمية،
            الاحتمالات، والأعداد المركبة — حسب المستويات.
          </p>
          {requested ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              تم فتح بريدك — أرسل الرسالة وسنضمّك لقائمة الإعلان
            </div>
          ) : (
            <a
              href="mailto:asaadadli9393@gmail.com?subject=%D8%A5%D8%B9%D9%84%D8%A7%D9%86%20%D8%AD%D8%B5%D8%B5%20%D8%A7%D9%84%D9%80%20Zoom%20%D8%B9%D9%86%D8%AF%20%D8%A5%D8%B7%D9%84%D8%A7%D9%82%D9%87%D8%A7&body=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%0A%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A3%D9%86%20%D9%8A%D8%B5%D9%84%D9%86%D9%8A%20%D8%A5%D8%B9%D9%84%D8%A7%D9%86%20%D8%A8%D9%85%D9%88%D8%A7%D8%B9%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D8%B5%20%D8%A7%D9%84%D9%85%D8%A8%D8%A7%D8%B4%D8%B1%D8%A9%20%D8%B9%D9%86%D8%AF%20%D8%A5%D8%B7%D9%84%D8%A7%D9%82%D9%87%D8%A7.%0A%D8%A7%D9%84%D8%A7%D8%B3%D9%85%3A%20%0A%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%88%D9%89%3A%20"
              onClick={() => setRequested(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              <Bell className="h-4 w-4" />
              أعلمني عند إطلاق الحصص
            </a>
          )}
        </CardContent>
      </Card>

      {/* ما الذي يمكن مراجعته الآن بدل الانتظار */}
      <Card>
        <CardContent className="space-y-3 py-6">
          <div className="flex items-center gap-2 text-base font-bold">
            <Sparkles className="h-4 w-4 text-amber-500" />
            بينما نُجهّز الحصص — هذا متاح لك الآن فوراً
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              حلول نموذجية تفاعلية مفصلة لأنماط تمارين البكالوريا 2008–2026 حسب المحاور
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              بنك تمارين ضخم بحلول خطوة بخطوة مع تلميحات ووسم التقدم
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              المدرّس الذكي «تدرّج AI» للإجابة عن أسئلتك في الرياضيات في أي وقت
            </li>
          </ul>
          {!isPremium && (
            <button
              onClick={onSubscribe}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-emerald-950 transition-colors hover:bg-amber-300"
            >
              اكتشف الباقة المميزة
            </button>
          )}
        </CardContent>
      </Card>

      {/* تواصل */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">للاستفسار عن الحصص القادمة:</p>
            <a
              href="mailto:asaadadli9393@gmail.com?subject=استفسار عن الحصص المباشرة"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Mail className="w-4 h-4" />
              asaadadli9393@gmail.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LiveClassesView;
