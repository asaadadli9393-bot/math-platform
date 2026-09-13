"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Clock, Calendar, Users, Plus, VideoIcon, ExternalLink, Copy } from "lucide-react";

// ============================================================
//  LiveClasses — الحصص المباشرة عبر Zoom
//  منصة الرياضيات | الأستاذ عدلي أسعد
// ============================================================

interface ZoomClass {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  zoomLink: string;
  zoomId: string;
  password: string;
  status: "upcoming" | "live" | "ended";
  participants: number;
  isPremium: boolean;
}

const sampleClasses: ZoomClass[] = [
  {
    id: "zoom-1",
    title: "مراجعة شاملة: الدوال و النهايات",
    description: "حصة مراجعة شاملة لمحاور الفصل الأول: مجال التعريف، النهايات، الاشتقاق، التغيرات.",
    date: "2026-09-15",
    time: "18:00",
    duration: "ساعة ونصف",
    zoomLink: "https://zoom.us/j/1234567890",
    zoomId: "123 456 7890",
    password: "math2026",
    status: "upcoming",
    participants: 45,
    isPremium: false,
  },
  {
    id: "zoom-2",
    title: "حصة مكثفة: الأعداد المركبة",
    description: "شرح مفصل للأعداد المركبة + حل تمارين بكالوريا.",
    date: "2026-09-18",
    time: "20:00",
    duration: "ساعتان",
    zoomLink: "https://zoom.us/j/9876543210",
    zoomId: "987 654 3210",
    password: "complex2026",
    status: "upcoming",
    participants: 32,
    isPremium: true,
  },
];

export function LiveClasses() {
  const [classes, setClasses] = React.useState<ZoomClass[]>(sampleClasses);
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusBadge = (status: ZoomClass["status"]) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500 text-white animate-pulse">🔴 مباشر الآن</Badge>;
      case "upcoming":
        return <Badge className="bg-emerald-500 text-white">قادمة</Badge>;
      case "ended":
        return <Badge variant="outline">منتهية</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 mb-3">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          الحصص المباشرة عبر Zoom
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          انضم إلى الحصص المباشرة مع الأستاذ عدلي أسعد عبر Zoom. مراجعة شاملة، حل تمارين،
          أسئلة وأجوبة في الوقت الحقيقي.
        </p>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <Video className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{classes.filter(c => c.status === "upcoming").length}</div>
            <div className="text-xs text-muted-foreground">حصص قادمة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{classes.reduce((a, c) => a + c.participants, 0)}</div>
            <div className="text-xs text-muted-foreground">مسجل</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{classes.length}</div>
            <div className="text-xs text-muted-foreground">إجمالي الحصص</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <VideoIcon className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">Zoom</div>
            <div className="text-xs text-muted-foreground">منصة البث</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الحصص */}
      <div className="space-y-4">
        {classes.map((cls) => (
          <Card key={cls.id} className={`overflow-hidden ${cls.status === "live" ? "border-red-300 ring-2 ring-red-200" : "border-2"}`}>
            <CardHeader className={`${cls.status === "live" ? "bg-red-50" : "bg-gradient-to-l from-blue-50 to-transparent"}`}>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {getStatusBadge(cls.status)}
                    {cls.isPremium && (
                      <Badge variant="outline" className="text-amber-700 border-amber-300">
                        🔒 للمشتركين
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 ml-1" />
                      {cls.date}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 ml-1" />
                      {cls.time} — {cls.duration}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 ml-1" />
                      {cls.participants} مسجل
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-1">{cls.title}</CardTitle>
                  <CardDescription>{cls.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {/* معلومات Zoom */}
              <div className="grid md:grid-cols-3 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <Label className="text-xs text-muted-foreground">معرّف الاجتماع</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm font-mono flex-1">{cls.zoomId}</code>
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(cls.zoomId, `${cls.id}-id`)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    {copied === `${cls.id}-id` && <span className="text-xs text-emerald-600">✓</span>}
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <Label className="text-xs text-muted-foreground">كلمة السر</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm font-mono flex-1">{cls.password}</code>
                    <Button size="icon" variant="ghost" onClick={() => handleCopy(cls.password, `${cls.id}-pass`)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                    {copied === `${cls.id}-pass` && <span className="text-xs text-emerald-600">✓</span>}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <a href={cls.zoomLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="w-full gap-2" size="lg">
                      <Video className="w-5 h-5" />
                      {cls.status === "live" ? "انضم الآن" : "انضم للحصة"}
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </div>

              {/* ملاحظة */}
              {cls.isPremium && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  ⚠️ هذه الحصة مخصصة للمشتركين فقط. إذا لم تكن مشتركاً، توجه إلى تبويب "الباقات" للاشتراك.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* دعوة للانضمام */}
      <Card className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white">
        <CardContent className="pt-6 text-center">
          <Video className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">انضم إلى مجتمعنا على Zoom!</h3>
          <p className="text-white/90 mb-4 max-w-xl mx-auto">
            احصل على حصص مباشرة أسبوعياً مع الأستاذ عدلي أسعد. مراجعة، تمارين، أسئلة وأجوبة.
            المقاعد محدودة!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              سجّل في الحصة القادمة
            </Button>
            <Button variant="outline" size="lg" className="gap-2 text-white border-white/30 hover:bg-white/10">
              <VideoIcon className="w-5 h-5" />
              تحميل تطبيق Zoom
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* كيفية الانضمام */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">كيفية الانضمام للحصة</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
              <span>حمّل تطبيق Zoom على جهازك (هاتف، حاسوب، أو لوحي).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
              <span>اضغط "انضم للحصة" قبل 5 دقائق من موعد الحصة.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
              <span>أدخل معرّف الاجتماع وكلمة السر المعروضين أعلاه.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
              <span>فعّل الكاميرا و الميكروفون للمشاركة في الأسئلة.</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
