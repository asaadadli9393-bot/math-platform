# 🎓 منصة الرياضيات — الأستاذ عدلي أسعد

منصة تعليمية تفاعلية لطلبة السنة الثالثة ثانوي (الشعب العلمية) في الجزائر،
متوافقة كلياً مع المنهاج الرسمي لوزارة التربية الوطنية.

## ✨ المميزات

### المحتوى التعليمي
- 📚 **5 دورات مميزة** مع 61 تمرين وحلول نموذجية
- 📄 **سلاسل الأستاذ عدلي أسعد** (PDF قابلة للتحميل)
- ✅ **حلول نموذجية مفصلة** (PDF مع معادلات LaTeX)
- 📜 **9 مواضيع بكالوريا** سابقة

### الأدوات التفاعلية
- 🤖 **مساعد ذكي** يجيب على أسئلة الرياضيات بالعربية
- 📈 **أداة رسم الدوال التفاعلية** (Canvas)
- 🎓 **امتحان تجريبي عشوائي** (مؤقّت + تصحيح فوري)
- ✏️ **رسم بياني للتمارين** في الدورات المميزة

### النظام التعليمي
- 🔐 **تسجيل دخول/حساب جديد** (JWT + كلمة سر مُجزّأة بـ scrypt)
- 📊 **تتبع التقدم** (نسبة الإنجاز + شارات إنجاز)
- 🎯 **حفظ المحاولات** (تمارين + اختبارات) في قاعدة البيانات
- 🏆 **10 شارات** (الخطوة الأولى، مجتهد، بطل، ملك الاختبارات...)

### النظام التجاري
- 🔒 **نظام اشتراك بسيط** (500 دج فقط)
- 💳 **دفع بالبطاقة الذهبية** أو بريدي موب
- 📧 **إشعارات بالبريد** عند الاشتراك (Gmail SMTP)
- 👨‍👩‍👧 **فضاء ولي الأمر**

### الوسائط
- 🎌 **شخصيات أنمي** (الأستاذ على شكل فيغابانغ)
- 🎬 **محاكاة فيديو تعليمي** بصوت عربي (TTS)
- 📹 **رفع فيديوهات حقيقية** (MP4) عبر لوحة الإدارة

## 🚀 التشغيل المحلي

```bash
# 1) تثبيت الاعتماديات
npm install

# 2) إعداد متغيرات البيئة
cp .env.example .env.local
# عدّل قيم .env.local (خصوصاً DATABASE_URL و SMTP_PASS)

# 3) تهيئة قاعدة البيانات
npm run db:push

# 4) تشغيل خادم التطوير
npm run dev
# → http://localhost:3000
```

## 🌐 النشر على Vercel (إنتاج)

### الخطوة 1: قاعدة بيانات PostgreSQL مجانية
1. اذهب إلى [neon.tech](https://neon.tech) أو [supabase.com](https://supabase.com)
2. أنشئ قاعدة بيانات جديدة (مجانية)
3. انسخ `connection string` (يبدأ بـ `postgresql://`)

### الخطوة 2: النشر على Vercel
1. اذهب إلى [vercel.com](https://vercel.com) ← سجّل بـ GitHub
2. اختر المستودع `asaadadli9393-bot/math-platform`
3. أضف متغيرات البيئة التالية:

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | `postgresql://...` (من Neon/Supabase) |
| `ADMIN_KEY` | `adli2024` |
| `ADMIN_EMAIL` | `asaadadli9393@gmail.com` |
| `NEXTAUTH_SECRET` | (أي سلسلة عشوائية 32+ حرف) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `asaadadli9393@gmail.com` |
| `SMTP_PASS` | كلمة تطبيق Gmail (16 حرف) |

4. اضغط **Deploy** — سيقوم Vercel تلقائياً بـ:
   - تبديل مزوّد Prisma إلى PostgreSQL (script: `set-prisma-provider.sh`)
   - توليد Prisma Client
   - بناء Next.js

5. بعد أول نشر، شغّل على جهازك:
```bash
# تهيئة قاعدة البيانات على PostgreSQL
DATABASE_URL=postgresql://... npx prisma db push --accept-data-loss
# زرع إعدادات المدير الافتراضية
DATABASE_URL=postgresql://... bun run scripts/seed-admin-settings.ts
```

## 🔑 كلمات السر

| النوع | القيمة |
|------|--------|
| لوحة الإدارة | `adli2024` |
| تفعيل المشرف (الدورات المميزة) | `adli2024` |

## 📧 إعداد إشعارات Gmail

1. اذهب إلى [myaccount.google.com/security](https://myaccount.google.com/security)
2. فعّل **التحقق بخطوتين**
3. أنشئ **كلمة تطبيق** (App Password) → احصل على 16 حرف
4. من لوحة الإدارة: تبويب "الإعدادات" → أدخل كلمة التطبيق في `SMTP_PASS`
5. اختبر الإرسال عبر زر "اختبار البريد" في نفس الصفحة

## 📂 بنية المشروع

```
src/
├── app/
│   ├── api/              # 23 API route
│   │   ├── auth/         # تسجيل/دخول/حسابي
│   │   ├── admin/        # لوحة الإدارة (8 endpoints)
│   │   ├── exercises/grade/   # حفظ + تصحيح التمارين
│   │   ├── progress/     # تتبع التقدم + الشارات
│   │   └── mock-exam/    # امتحان تجريبي عشوائي
│   ├── page.tsx          # الصفحة الرئيسية (3000+ سطر)
│   └── admin/            # صفحات لوحة الإدارة
├── components/           # 30+ مكوّن
├── data/                 # المنهاج + الدورات + الاختبارات
└── lib/                  # أدوات (db, auth, jwt, password, etc.)
public/
├── courses/              # 9 PDF سلاسل + 5 PDF حلول
├── anime/                # 5 صور أنمي
└── katex/                # مكتبة KaTeX محلية
prisma/
└── schema.prisma         # مخطط قاعدة البيانات (SQLite/PostgreSQL)
```

## 📊 قاعدة البيانات (Prisma)

المخطط يشمل:
- **User** (مستخدمون بأدوار: طالب، ولي أمر، أستاذ، مشرف، مدير)
- **Unit/Chapter/Lesson/Exercise** (شجرة المحتوى المعرفي)
- **Quiz/QuizQuestion/QuizResult** (اختبارات تفاعلية)
- **ExerciseAttempt** (محاولات الطلاب على التمارين)
- **UnitProgress/ProgressRecord** (تتبع التقدم اليومي)
- **Payment/PaymentNotification** (المدفوعات والإشعارات)
- **Notification** (إشعارات المستخدمين)
- **Video** (الفيديوهات المرفوعة)
- **Setting/AdminSetting** (إعدادات Key/Value)

## 📦 المحتوى

- **5** دورات مميزة + **61** تمرين + **61** حل نموذجي
- **9** سلاسل الأستاذ عدلي (PDF)
- **11** بكالوريا سابقة
- **9** رسوم بيانية تفاعلية
- **10** شارات إنجاز
- **23** API route

## 🛠️ التقنيات

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui, Recharts, KaTeX
- **Backend**: Next.js API Routes, Prisma 6, jose (JWT), Node crypto (scrypt)
- **State**: Zustand (client-side), React Query (server-side)
- **Database**: SQLite (dev) / PostgreSQL (prod — Neon/Supabase)
- **Auth**: JWT + Bearer token (hs256)
- **Email**: Nodemailer (Gmail SMTP)
- **PDF**: Playwright + KaTeX
- **AI**: z-ai-web-dev-sdk (TTS + Chat)
- **Voice**: ZAI TTS (voice: kazi)
- **Images**: 5 صور أنمي (One Piece)

© 2026 منصة الرياضيات — الأستاذ عدلي أسعد
asaadadli9393@gmail.com
