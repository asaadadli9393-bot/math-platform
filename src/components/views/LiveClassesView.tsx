'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Lock, Mail, ShieldCheck, Trophy, Video } from 'lucide-react';

// ============================================================
//  LiveClassesView — حصص Zoom المباشرة
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================
function LiveClassesView({ isPremium = false, onSubscribe }: { isPremium?: boolean; onSubscribe?: () => void }) {
  const [copied, setCopied] = React.useState<string | null>(null);

  // جدول الحصص الأسبوعي
  const schedule = [
    { day: "السبت", time: "19:00", topic: "دراسة الدوال والنهايات", level: "3AS", zoomId: "123 456 7890", password: "math2026" },
    { day: "الأحد", time: "18:00", topic: "الاشتقاق والتكامل", level: "3AS", zoomId: "234 567 8901", password: "math2026" },
    { day: "الثلاثاء", time: "19:00", topic: "المتتاليات والأعداد المركبة", level: "3AS", zoomId: "345 678 9012", password: "math2026" },
    { day: "الأربعاء", time: "18:00", topic: "الدوال والنهايات", level: "2AS", zoomId: "456 789 0123", password: "math2026" },
    { day: "الخميس", time: "19:00", topic: "الجبر والهندسة", level: "1AS", zoomId: "567 890 1234", password: "math2026" },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* رأس الصفحة */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <Video className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold">حصص Zoom المباشرة</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          انضم إلى الحصص المباشرة مع الأستاذ عدلي أسعد. الحصص تُبثّ مباشرة عبر تطبيق Zoom،
          وتُسجّل ليعود إليها الطلاب متى شاؤوا.
        </p>
      </div>

      {/* بطاقات إحصائية */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Video className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">حصص أسبوعيًا</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <div className="text-2xl font-bold">60-90</div>
            <div className="text-xs text-muted-foreground">دقيقة/حصة</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Calendar className="w-8 h-8 mx-auto text-amber-600 mb-2" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-muted-foreground">سنوات ثانوي</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <Trophy className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold">+500</div>
            <div className="text-xs text-muted-foreground">طالب منتظم</div>
          </CardContent>
        </Card>
      </div>

      {/* جدول الحصص */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            جدول الحصص الأسبوعي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((session, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* اليوم والوقت */}
                <div className="flex items-center gap-3 md:w-32">
                  <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-center min-w-16">
                    <div className="text-sm font-bold">{session.day}</div>
                    <div className="text-xs opacity-90" dir="ltr">{session.time}</div>
                  </div>
                </div>

                {/* الموضوع */}
                <div className="flex-1">
                  <div className="font-semibold">{session.topic}</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {session.level}
                  </Badge>
                </div>

                {/* معلومات Zoom — متاحة للمشتركين فقط */}
                {isPremium ? (
                  <div className="flex flex-col gap-1 md:w-64 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">معرّف:</span>
                      <code className="bg-muted px-2 py-0.5 rounded text-xs" dir="ltr">{session.zoomId}</code>
                      <button
                        onClick={() => copyToClipboard(session.zoomId, `id-${idx}`)}
                        className="text-xs text-primary hover:underline"
                      >
                        {copied === `id-${idx}` ? "✓ نُسخ" : "نسخ"}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">الرمز:</span>
                      <code className="bg-muted px-2 py-0.5 rounded text-xs" dir="ltr">{session.password}</code>
                      <button
                        onClick={() => copyToClipboard(session.password, `pwd-${idx}`)}
                        className="text-xs text-primary hover:underline"
                      >
                        {copied === `pwd-${idx}` ? "✓ نُسخ" : "نسخ"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 md:w-64 text-sm font-bold text-amber-700">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>المعرّف والرمز متاحان للمشتركين</span>
                  </div>
                )}

                {/* زر الانضمام */}
                {isPremium ? (
                  <a
                    href="https://zoom.us/join"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    انضمام
                  </a>
                ) : (
                  <button
                    onClick={onSubscribe}
                    className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    اشترك للانضمام
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* تعليمات الانضمام */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <ShieldCheck className="w-5 h-5" />
            تعليمات الانضمام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
          <div className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>حمّل تطبيق Zoom من <a href="https://zoom.us/download" target="_blank" rel="noopener noreferrer" className="underline font-semibold">zoom.us/download</a></span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>اضغط على "انضمام" قبل 5 دقائق من موعد الحصة</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>أدخل معرّف الاجتماع والرمز (يمكن نسخهما من الجدول أعلاه)</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>اكتب اسمك الكامل عند الدخول (مثال: "أحمد - 3AS علوم)</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">5.</span>
            <span>أطفئ الميكروفون والكاميرا عند الدخول، وافتحهما فقط عند السؤال</span>
          </div>
        </CardContent>
      </Card>

      {/* تنبيه الاشتراك */}
      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <strong className="block mb-1">حصص Zoom حصرية للمشتركين</strong>
              الاشتراك في الباقة المميزة يتيح لك:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>الانضمام لكل الحصص المباشرة</li>
                <li>الوصول لتسجيلات الحصص السابقة</li>
                <li>طرح الأسئلة المباشرة على الأستاذ</li>
                <li>متابعة شخصية لتقدمك</li>
              </ul>
              <button
                onClick={onSubscribe}
                className="inline-block mt-3 text-amber-700 dark:text-amber-300 font-semibold underline"
              >
                اشترك الآن ←
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تواصل */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              للاستفسار عن الحصص أو المشاكل التقنية:
            </p>
            <a
              href="mailto:asaadadli9393@gmail.com?subject=استفسار عن حصص Zoom"
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
