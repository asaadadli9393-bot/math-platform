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

#### الطريقة السريعة (السكربت التفاعلي)

```bash
# شغّل المعالج التفاعلي
bash scripts/postgres-wizard.sh
```

سيقوم المعالج بـ:
- طلب `DATABASE_URL` منك بأمان
- إضافة `sslmode=require` تلقائيًا (مطلوب لـ Neon)
- حفظ القيمة في `.env`
- تبديل مزوّد Prisma إلى postgresql
- إنشاء الجداول في PostgreSQL
- ترحيل بيانات SQLite المحلي إن وُجدت (اختياري)
- زرع إعدادات المدير الافتراضية
- طباعة تقرير ملخّص

#### الطريقة اليدوية

1. اذهب إلى [neon.tech](https://neon.tech) أو [supabase.com](https://supabase.com)
2. أنشئ قاعدة بيانات جديدة (مجانية — region Frankfurt أو أي قريب)
3. انسخ `connection string` (يبدأ بـ `postgresql://`)
4. شغّل سكربت الإعداد:

```bash
# تهيئة كاملة + ترحيل البيانات
DATABASE_URL="postgresql://..." bun run scripts/setup-postgres.ts

# أو تخطّي الترحيل (إنشاء جداول جديدة فقط)
DATABASE_URL="postgresql://..." bun run scripts/setup-postgres.ts --skip-migrate
```

### الخطوة 2: النشر على Vercel

#### الطريقة 1: النشر البرمجي الكامل (مُوصى به — CI/CD تلقائي)

هذه الطريقة تُفعّل نشرًا تلقائيًا على Vercel عند كل `git push` عبر GitHub Actions.

**1. جهّز ملف `.env.production`:**

```bash
cp .env.production.example .env.production
nano .env.production
```

املأ القيم الفارغة:

| المتغير | كيف تحصل عليه |
|---------|---------------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens → Create Token (Full Account) |
| `GITHUB_TOKEN` | https://github.com/settings/tokens?type=beta → Generate (repo + Actions + Secrets) |
| `VERCEL_ORG_ID` | Vercel → Project → Settings → General (يظهر بعد أول ربط) |
| `VERCEL_PROJECT_ID` | Vercel → Project → Settings → General (يظهر بعد أول ربط) |
| `SMTP_PASS` | كلمة تطبيق Gmail (16 حرف) من myaccount.google.com/apppasswords |

`DATABASE_URL`, `ADMIN_KEY`, `ADMIN_EMAIL`, `NEXTAUTH_SECRET`, `SMTP_HOST/PORT/USER` — مُعبّأة مسبقًا.

**2. امزامنة الأسرار مع GitHub دفعة واحدة:**

```bash
bash scripts/sync-github-secrets.sh
```

سيقوم السكربت بـ:
- قراءة 11 متغيرًا من `.env.production`
- تشفيرها باستخدام `pynacl` (مفتاح تشفير المستودع العام)
- رفعها إلى GitHub عبر REST API
- التحقق النهائي من نجاح الرفع

بدائل:
```bash
bash scripts/sync-github-secrets.sh --verify    # طباعة حالة الأسرار فقط
bash scripts/sync-github-secrets.sh --delete    # حذف كل الأسرار
```

**3. امزامنة متغيرات البيئة مع Vercel:**

```bash
# استعمل نفس الملف
bash scripts/sync-vercel-env.sh
```

يرفع 8 متغيرات (DATABASE_URL, ADMIN_KEY, ADMIN_EMAIL, NEXTAUTH_SECRET, SMTP_*).*

**4. شغّل النشر الأول (مع ربط المشروع):**

```bash
bash scripts/deploy-vercel.sh --link
```

بعد النشر الأول، ستجد `VERCEL_ORG_ID` و `VERCEL_PROJECT_ID` في:
- Vercel → Project → Settings → General
- أو في ملف `.vercel/project.json` محليًا

**5. أعد تعبئة `.env.production` بالـ IDs الجديدة:**

```bash
nano .env.production
# فعّل VERCEL_ORG_ID و VERCEL_PROJECT_ID
# ثم أعد رفع الأسرار:
bash scripts/sync-github-secrets.sh
```

**6. النشر اللاحق (تلقائي عبر GitHub):**

```bash
git push origin main
# سيُطلق workflow النشر تلقائيًا
```

أو نشر يدوي من GitHub UI:
- اذهب إلى https://github.com/asaadadli9393-bot/math-platform/actions
- اختر workflow "🚀 Deploy to Vercel"
- اضغط "Run workflow"

#### الطريقة 2: النشر اليدوي عبر Dashboard

1. اذهب إلى [vercel.com](https://vercel.com) ← سجّل بـ GitHub
2. اختر المستودع `asaadadli9393-bot/math-platform`
3. أضف متغيرات البيئة يدويًا (في Settings → Environment Variables):

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | `postgresql://...` (من Neon، مع `?sslmode=require`) |
| `ADMIN_KEY` | `adli2024` |
| `ADMIN_EMAIL` | `asaadadli9393@gmail.com` |
| `NEXTAUTH_SECRET` | `math-platform-adli-2026-secure-secret-key` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `asaadadli9393@gmail.com` |
| `SMTP_PASS` | كلمة تطبيق Gmail (16 حرف) |

4. اضغط **Deploy** — Vercel سيقوم تلقائيًا بتبديل مزوّد Prisma عبر `set-prisma-provider.sh` في `vercel.json`

5. بعد أول نشر، تأكد من أن قاعدة البيانات جاهزة:

```bash
# إن لم تكن شغّلت سكربت الإعداد من قبل
DATABASE_URL=postgresql://... npx prisma db push --accept-data-loss
DATABASE_URL=postgresql://... bun run scripts/seed-admin-settings.ts
```

### الخطوة 3: استملاك منصة Vercel مؤقتة (مهم!)

إن نشرت دون تسجيل دخول (deploy temporary)، ستحصل على رابط استملاك مثل:
```
https://vercel.com/claim-deployment?code=xxxxx
```
افتحه فورًا واحفظ المنصة باسم مشروع رسمي قبل انتهاء المدة (60 دقيقة).

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
