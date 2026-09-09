# 📚 دليل استرجاع منصة الرياضيات — التحسينات الكاملة

## 🚀 الاسترجاع السريع (دقيقة واحدة)

```bash
# 1. فك ضغط النسخة الاحتياطية
tar -xzf math-platform-backup-*.tar.gz

# 2. انسخ المحتويات إلى مشروع Next.js
cp -r backup-*/src ./
cp -r backup-*/public ./
cp -r backup-*/prisma ./
cp backup-*/package.json ./
cp backup-*/tsconfig.json ./
cp backup-*/next.config.ts ./
cp backup-*/tailwind.config.ts ./
cp backup-*/postcss.config.mjs ./
cp backup-*/components.json ./
cp backup-*/.gitignore ./
cp -r backup-*/db ./
cp -r backup-*/scripts ./

# 3. ثبّت الحزم
npm install

# 4. أنشئ قاعدة البيانات
npx prisma db push

# 5. شغّل المنصة
npm run dev
```

---

## ✅ التحسينات المحفوظة في هذه النسخة

### 1️⃣ نظام الاشتراك الأمن البسيط
- **عرض واحد فقط**: `FULL = 500 دج`
- `isSubscriptionActive()` يفحص `FULL` + تاريخ الانتهاء
- القفل على: المواضيع + المتجر + المساعد الذكي
- `LockedContent` component

### 2️⃣ الدورات المميزة (5 دورات)
- `src/data/premium-courses.ts`:
  1. المتتاليات العددية
  2. الدالة الأسية
  3. اللوغاريتم النيبيري
  4. الأعداد المركبة
  5. الاحتمالات
- `isPremium` + `pdfUrl` في `Course` interface

### 3️⃣ المساعد الذكي
- `/api/ai-assistant` (z-ai-web-dev-sdk)
- `src/components/ai-assistant.tsx` (chat interface بالعربية)
- 6 أسئلة مقترحة + LaTeX rendering
- مقفل للمشتركين فقط

### 4️⃣ أداة رسم الدوال التفاعلية
- `src/components/function-plot.tsx` (Canvas-based)
- `FunctionPlotter` في `page.tsx`
- 7 أمثلة جاهزة + 6 ألوان

### 5️⃣ لوحة الإدارة الكاملة
- `/admin` — 4 تبويبات:
  - المدفوعات (verify/reject)
  - التحليلات (Recharts: Area + Pie + Bar)
  - الإشعارات
  - الإعدادات (SMTP + Gmail App Password)
- `/admin/videos` — رفع فيديوهات MP4
- `/api/admin/login` — دخول آمن (safeEqual)
- `/api/admin/payments` — إدارة المدفوعات
- `/api/admin/notifications` — الإشعارات
- `/api/admin/settings` — الإعدادات
- `/api/admin/stats` — إحصائيات
- `/api/admin/test-email` — اختبار البريد
- `/api/admin/upload-video` — رفع فيديو
- `/api/payments` — إنشاء دفعة
- `/api/subscription` — حالة الاشتراك
- `/api/check-subscription` — التحقق
- `/api/notify-whatsapp` — إشعار WhatsApp

### 6️⃣ صفحات الخطأ
- `error.tsx` — Error boundary
- `loading.tsx` — Skeleton
- `not-found.tsx` — 404
- `global-error.tsx` — خطأ حرج

### 7️⃣ الأمان
- `next.config.ts`: 6 headers (X-Frame-Options, CSP, etc.)
- `reactStrictMode: true`
- `ignoreBuildErrors` محذوف
- فهارس Prisma على Payment + PaymentNotification
- `/api/admin/login`: مقارنة ثابتة الزمن + تأخير brute-force

### 8️⃣ صور الأنمي
- `public/anime/`:
  - teacher-fujitora.png (الأستاذ — فيغابانغ)
  - classroom-bg.png (فصل دراسي)
  - student-luffy.png (لوفي)
  - student-sniper.png (القناص)
  - student-zoro.png (زورو)

### 9️⃣ الرسوم البيانية للتمارين
- `function-plot.tsx` يُستعمل في:
  - `bac-exam-card.tsx` (رسوم للدوال)
  - `course-card.tsx` (رسوم لتمارين premium)

---

## 🔑 كلمة سر المشرف
```
adli-asad-2024-math
```

## 📧 البريد الإلكتروني للمشرف
```
asaadadli9393@gmail.com
```

---

## 🔄 رفع المشروع على GitHub (للدوام الدائم)

```bash
# 1. أنشئ مستودع على GitHub (private أو public)
# 2. من داخل المشروع:
git remote add origin https://github.com/USERNAME/math-platform.git
git push -u origin main

# 3. للاسترجاع في أي وقت:
git clone https://github.com/USERNAME/math-platform.git
cd math-platform
npm install
npx prisma db push
npm run dev
```

---

## 🌐 النشر على Vercel (للاستخدام الحيّ)

```bash
# 1. اpush إلى GitHub أولاً
# 2. اذهب إلى vercel.com ← سجّل بـ GitHub
# 3. اختر المستودع ← Deploy
# 4. المنصة تعمل على vercel.app بصفة دائمة
```

---

## 📝 ملاحظات مهمة

- **قاعدة البيانات**: SQLite في `db/custom.db` — تكفي للتطوير
- **للإنتاج**: استبدل بقاعدة PostgreSQL (Neon, Supabase)
- **الصوت العربي**: `/api/tts` يستعمل z-ai-web-dev-sdk بصوت `kazi`
- **المساعد الذكي**: `/api/ai-assistant` يستعمل z-ai-web-dev-sdk
- **صور الأنمي**: مولّدة عبر `z-ai image` CLI
