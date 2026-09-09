# 🚀 دليل نشر منصة الرياضيات على Vercel

## الخطوة 1: إنشاء حساب GitHub
1. اذهب إلى https://github.com → سجّل حساباً مجانياً
2. أنشئ مستودعاً جديداً (New Repository):
   - الاسم: `math-platform`
   - النوع: Private (أو Public)

## الخطوة 2: رفع المشروع على GitHub
من جهازك الشخصي، نزّل الحزمة من download/math-platform-final.tar.gz ثم:
```bash
# فك الضغط
tar -xzf math-platform-final.tar.gz
cd math-platform

# تهيئة git
git init
git add -A
git commit -m "منصة الرياضيات — النسخة الكاملة"

# اربط بـ GitHub (استبدل USERNAME باسمك)
git remote add origin https://github.com/USERNAME/math-platform.git
git push -u origin main
```

## الخطوة 3: النشر على Vercel
1. اذهب إلى https://vercel.com → سجّل بـ GitHub
2. اضغط "New Project" → اختر مستودع `math-platform`
3. إعدادات:
   - Framework: Next.js
   - Build Command: `next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/`
   - Output Directory: `.next/standalone`
4. متغيرات البيئة (Environment Variables):
   - `DATABASE_URL` = `file:./db/custom.db` (أو PostgreSQL URL)
   - `ADMIN_KEY` = `adli-asad-2024-math`
5. اضغط "Deploy" → المنصة تعمل على `https://math-platform.vercel.app`

## الخطوة 4: تهيئة قاعدة البيانات
بعد النشر، اذهب إلى Terminal في Vercel أو شغّل محلياً:
```bash
npx prisma db push
```

## ✅ النتيجة
- المنصة تعمل 24/7 على Vercel (مجاني)
- كل push على GitHub يُحدّث المنصة تلقائياً
- التحسينات محفوظة بشكل دائم

## 📋 المميزات المحفوظة
1. نظام الاشتراك (500 دج — عرض واحد)
2. القفل على الدورات المميزة فقط
3. 5 دورات مميزة (48 تمرين + حلول)
4. المساعد الذكي (AI)
5. أداة رسم الدوال التفاعلية
6. لوحة الإدارة (4 تبويبات)
7. الرسوم البيانية للتمارين
8. صور الأنمي
9. صفحات الخطأ
10. security headers

## 🔑 كلمة سر المشرف
```
adli-asad-2024-math
```
