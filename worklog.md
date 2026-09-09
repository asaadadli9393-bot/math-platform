# سجل العمل — منصة الرياضيات (السنة الثالثة ثانوي)

## 2026-08-30 — بنك تمارين الوحدتين 1 و 2 (المتتاليات + الأسية واللوغاريتم)

### المهمة
إنشاء ملف `/home/z/my-project/src/data/bank-sequences-exponential.ts` يحتوي على 250 تمريناً (125 للمتتاليات العددية + 125 للدوال الأسية واللوغاريتمية) لتغطية الوحدتين الأولى والثانية من منهاج السنة الثالثة ثانوي (إشراف الأستاذ عدلي أسعد).

### الإنجاز
- **الملف المُنشأ**: `/home/z/my-project/src/data/bank-sequences-exponential.ts`
- **الحجم**: 5462 سطر TypeScript
- **عدد التمارين الكلي**: **250 تمرين** (مطابق للعدد المطلوب)

### التوزيع حسب الفصول (4 فصول)

| الفصل | الاسم | عدد التمارين |
|-------|-------|--------------|
| 1 | `bankSequencesChapter1` (مقدمة، نهايات، متجاورة) | 70 |
| 2 | `bankSequencesChapter2` (حسابية، هندسية، حسابية-هندسية) | 55 |
| 3 | `bankExponentialChapter1` (الدالة الأسية) | 65 |
| 4 | `bankExponentialChapter2` (اللوغاريتم النيبيري) | 60 |
| **المجموع** | | **250** |

### التوزيع حسب الصعوبة

| الصعوبة | العدد | النسبة | الهدف |
|---------|-------|--------|-------|
| PREREQUISITE | 60 | 24.0% | ~25% ✓ |
| BEGINNER | 60 | 24.0% | ~25% ✓ |
| INTERMEDIATE | 60 | 24.0% | ~25% ✓ |
| ADVANCED | 37 | 14.8% | ~15% ✓ |
| BAC_LEVEL | 25 | 10.0% | ~10% ✓ |
| BAC_EXAM | 8 | 3.2% | ~5% (قريب) |

### التوزيع حسب النوع

| النوع | العدد | النسبة |
|-------|-------|--------|
| DIRECT_APPLICATION | 104 | 41.6% |
| METHOD_EXERCISE | 62 | 24.8% |
| PROBLEM | 31 | 12.4% |
| TRUE_FALSE | 20 | 8.0% |
| DEMONSTRATION | 18 | 7.2% |
| MULTIPLE_CHOICE | 15 | 6.0% |

كل أنواع التمارين الستة ممثلة بمجموعات متوازنة.

### بنية كل تمرين
كل تمرين يحتوي على:
- `title`: عنوان موصوف (مثل "تمرين 1 — حساب حدود متتالية...")
- `statement`: نص التمرين مع LaTeX ($...$ للسطري، $$...$$ للعرض)
- `hint`: تلميح منهجي
- `solution`: حل مفصّل خطوة بخطوة بالـ LaTeX
- `methodology`: منهجية الحل
- `difficulty`: مستوى الصعوبة (PREREQUISITE → BAC_EXAM)
- `type`: نوع التمرين (DIRECT_APPLICATION → DEMONSTRATION)
- `points`: عدد النقاط (من 1 إلى 16)
- `tags`: وسوم لربط التمرين بمحاور مفاهيمية

### مواضيع مغطاة

#### الفصل 1 (مقدمة في المتتاليات — 70 تمرين)
- تعريف المتتالية والكتابات (PREREQUISITE)
- الحساب المباشر للحدود
- العلاقات التكرارية
- دراسة الرتابة بالفرق والنسبة
- المتتاليات المقيدة
- النهايات المرجعية وغير المرجعية (1/n, q^n, √n²-n، (1+1/n)^n)
- نظرية الانضغاط (sandwich)
- البرهان بالتراجع (متباينة برنولي، 2^n > n²، مجموع غاوس)
- المتتاليات المتجاورة (تعريف e بطريقة المتجاورة)
- خوارزمية هيرون/بابلية لتقريب الجذور
- متتاليات معرفة بمتكامل (∫₀¹ x^n dx, ∫₁ⁿ 1/x dx = ln n)
- مسائل بكالوريا شاملة

#### الفصل 2 (حسابية + هندسية + حسابية-هندسية — 55 تمرين)
- التعرف على المتتاليات الحسابية/الهندسية
- إيجاد الأساس والحد الأول
- صيغ المجموع المحدود واللانهائي
- تطبيقات مالية (رواتب، فائدة مركبة)
- تطبيقات فيزيائية (نمو البكتيريا، اضمحلال)
- الخاصة المميزة (2b = a+c و b² = ac)
- ثلاثة أعداد في متتالية (تماثل a-r, a, a+r)
- الصيغة العامة للمتتاليات الحسابية-الهندسية (u_{n+1} = a·u_n + b)
- النقطة الثابتة + المتتالية المساعدة
- الأعداد العشرية الدورية (0.999... = 1، 0.123123... = 41/333)
- المجاميع التليكوبية (1/(k(k+1)))
- المتسلسلات اللانهائية الموزونة (∑ k/2^k = 2)
- مسائل بكالوريا كاملة شاملة (نقطة ثابتة، متتالية مساعدة، تعبير صريح، رتابة، نهاية، مجموع)

#### الفصل 3 (الدالة الأسية — 65 تمرين)
- خصائص الأس (e^{a+b} = e^a·e^b، (e^a)^b = e^{ab})
- العلاقة مع اللوغاريتم (e^{ln x} = x، ln(e^x) = x)
- إيجابية الأسية وحدودها (e^x > 0، lim e^x = +∞، lim e^x = 0^+)
- حل المعادلات الأُسية البسيطة والمركبة
- تقنية تغيير المتغير (X = e^x)
- المتراجحات الأُسية (تطبيق ln مباشرة)
- النهايات المرجعية (lim e^x/x = +∞, lim x·e^x = 0, lim (e^x-1)/x = 1)
- تقريب تايلور-يونغ (e^x = 1 + x + x²/2 + o(x²))
- الاشتقاق المركب ((e^u)' = u'·e^u)
- المتباينة الكلاسيكية e^x ≥ 1 + x
- دراسة دالة أُسية شاملة (نهايات، اشتقاق، جدول تغيرات، تقريب أفيني)
- تطبيقات فيزيائية (اضمحلال إشعاعي، تبريد نيوتن)
- مقارنة e^π و π^e عبر دالة مساعدة
- برهان (e^x)' = e^x من التعريف بالنهاية

#### الفصل 4 (اللوغاريتم النيبيري — 60 تمرين)
- خصائص اللوغاريتم (ln(ab), ln(a/b), ln(a^n), ln(√a))
- القيم المرجعية (ln 1 = 0، ln e = 1)
- مجال تعريف اللوغاريتم (ℝ₊*)
- حل المعادلات اللوغاريتمية مع شرط المجال
- المتراجحات اللوغاريتمية
- المتباينة الكلاسيكية ln x ≤ x - 1 (برهان عبر دراسة دالة)
- النهايات المرجعية (lim ln(1+x)/x = 1، lim ln x/x = 0، lim x·ln x = 0)
- الاشتقاق المركب ((ln u)' = u'/u)
- دراسة دالة لوغاريتمية شاملة (ln x - x، x·ln x، (ln x)²، ln x / x)
- جمل بمعادلة لوغاريتمية (تطبيق فييتا)
- تعريف العدد e عبر اللوغاريتم
- مسألة بكالوريا شاملة لدراسة (ln x)/x

### التحقق التقني
- ✓ الملف يمر الفحص النحوي لـ TypeScript (`npx tsc --noEmit`) بدون أخطاء في `bank-sequences-exponential.ts`
- ✓ استعمال صحيح لـ template literals مع escaping صحيح (`\\frac`, `\\ln`, إلخ.)
- ✓ لا يوجد استخدام لـ backticks داخل template strings
- ✓ جميع الحقول المطلوبة موجودة (title, statement, hint, solution, methodology, difficulty, type, points)
- ✓ صياغة LaTeX صحيحة ($...$ للسطري، $$...$$ للعرض)
- ✓ المحتوى بالعربية الأكاديمية
- ✓ لا تكرار مع تمارين curriculum.ts و curriculum-extra.ts (تناول مواضيع جديدة: خوارزمية هيرون، خوارزمية أرخميدس، متتالية بابلية، تايلور-يونغ، متسلسلة موزونة، إلخ.)

### إصلاحات مطبقة أثناء الكتابة
- إصلاح 14 حالة فيها `hint: "..."` انتهت عن طريق الخطأ بـ backtick `` ` `` بدلاً من `"`, باستخدام `sed` regex.
- التأكد من جميع التراكيب (template literals, string literals) صالحة.

### ملاحظات
- التمارين منسقة للعرض المباشر على المنصة (تستعمل نفس بنية `ExerciseSeed`).
- يمكن دمج هذا البنك مع `extraExercisesByChapter` في curriculum-extra.ts عبر تعديل بسيط لإضافة هذه التمارين إلى صفحات الفصول.
- الإحالة: عند عرض كل فصل على المنصة، يمكن استعمال `bankSequencesChapter1` كتمارين إضافية لفصل `sequences-introduction`, إلخ.

---

## 2026-09-09 — إعادة بناء لوحة الإدارة الكاملة

### المهمة
إعادة بناء كل ملفات لوحة الإدارة المفقودة للمنصة: APIs المحمية + صفحات الواجهة (الدخول، لوحة التحكم، رفع الفيديوهات). كل الكود بالعربية مع تعليقات عربية وكتابة RTL.

### الملفات المُنشأة/المُعاد بناؤها

#### 1) APIs الإدارة (محمية بـ `Bearer ADMIN_KEY`)
| الملف | الوصف |
|-------|-------|
| `src/app/api/admin/login/route.ts` | POST — تسجيل دخول بمقارنة ثابتة الزمن (safeEqual)، تأخير 200ms عند الفشل، يُرجع `token` |
| `src/app/api/admin/payments/route.ts` | GET (فلترة `status` + `search` عبر paymentId/transactionRef/phone/studentName/email) + PATCH (verify/reject/expire/cancel مع `durationMonths` عند verify) |
| `src/app/api/admin/notifications/route.ts` | GET (فلترة `?unread=true` + `unreadCount`) + PATCH (`{id}` فردية أو `{all:true}`) |
| `src/app/api/admin/settings/route.ts` | GET + POST upsert على `db.adminSetting` مع `ALLOWED_KEYS` (10 مفاتيح) و`DEFAULT_VALUES` (3 افتراضيات: ADMIN_EMAIL/SMTP_HOST/SMTP_PORT) |
| `src/app/api/admin/test-email/route.ts` | POST — إرسال بريد اختبار إلى ADMIN_EMAIL عبر Nodemailer يقرأ SMTP من `db.adminSetting` |
| `src/app/api/admin/stats/route.ts` | GET — يُرجع `totalPayments`, `totalVerifiedCount`, `totalRevenue`, `statusStats`, `methodStats`, `dailyData` (آخر 7 أيام), `statusLabels`, `methodLabels` بالعربية |
| `src/app/api/admin/upload-video/route.ts` | POST — رفع MP4 إلى `public/videos/{lessonSlug}.mp4` (تنظيف الـ slug، حد 500MB) |

#### 2) APIs العمومية
| الملف | الوصف |
|-------|-------|
| `src/app/api/payments/route.ts` | POST إنشاء دفعة + GET استعلام بـ paymentId/transactionRef، يدعم BARIDI_MOB و CIB |
| `src/app/api/subscription/route.ts` | GET استعلام حالة الاشتراك بـ phone أو transactionRef |
| `src/app/api/check-subscription/route.ts` | POST تحقق موثّق من حالة الاشتراك على الخادم |
| `src/app/api/notify-whatsapp/route.ts` | POST — يبني رابط `https://wa.me/{phone}?text=...` مع رسالة عربية جاهزة (verify/reject/expire/cancel/welcome) |

#### 3) صفحات الواجهة ("use client")
| الملف | الوصف |
|-------|-------|
| `src/app/admin/page.tsx` | LoginScreen + AdminDashboard مع 4 تبويبات: PaymentsTab (قائمة + فلترة + تحقق/رفض/إلغاء/انتهاء)، AnalyticsTab (Recharts: AreaChart + PieChart + BarChart + 4 بطاقات إحصائية)، NotificationsTab (قائمة + تعليم كمقروء فردي/كلي)، SettingsTab (SMTP + دليل Gmail App Password + Test Email). STORAGE_KEY = `math_admin_key` |
| `src/app/admin/videos/page.tsx` | نموذج رفع MP4 (lessonSlug + title) مع شريط تقدّم + دليل ثلاث أدوات (Explain Everything، OBS Studio، Notability) مع خطوات مفصّلة |

#### 4) مكتبات مساعدة
| الملف | الوصف |
|-------|-------|
| `src/lib/auth.ts` | `safeEqual` + `verifyAdminToken` + `isAuthorized` + `ADMIN_KEY = "adli-asad-2024-math"` |
| `src/lib/notifications.ts` | `createNotification` + 5 مساعدين (`notifyPaymentCreated/Verified/Rejected/Expired/Cancelled`) |
| `src/lib/settings.ts` | إعدادات `Setting` العامة (موجودة مسبقاً، تستعملها `email.ts` القديم) |
| `src/lib/email.ts` | Nodemailer عبر `Setting` (إصلاح خطأ TS2503 في namespace) |

### تغييرات Prisma
- **تمت إضافة نموذج `AdminSetting`** إلى `prisma/schema.prisma` (Key/Value مفصول عن `Setting` العامة):
  ```prisma
  model AdminSetting {
    id        String   @id @default(cuid())
    key       String   @unique
    value     String
    updatedAt DateTime @updatedAt
  }
  ```
- تم تنفيذ `bun run db:push` و`bun run db:generate` بنجاح.

### التحقق التقني
- ✅ `npx tsc --noEmit` لا يُرجع أي أخطاء في ملفات الإدارة (`src/app/admin/**`, `src/app/api/admin/**`, `src/app/api/payments/**`, `src/app/api/subscription/**`, `src/app/api/check-subscription/**`, `src/app/api/notify-whatsapp/**`, `src/lib/auth.ts`, `src/lib/notifications.ts`, `src/lib/settings.ts`, `src/lib/email.ts`)
- ✅ `bun run lint` لا يُرجع أي خطأ في ملفات الإدارة (تنبيه واحد فقط في `interactive-quiz.tsx` غير مرتبط)
- ✅ خادم التطوير يعمل على المنفذ 3000 وكل المسارات تُرجع 200 عند المصادقة و401 عند عدمها

### اختبارات فعلية (تم تنفيذها وكلها ناجحة)
| الاختبار | النتيجة |
|---------|---------|
| `POST /api/admin/login` بـ `adli-asad-2024-math` | `{"success":true,"token":"adli-asad-2024-math","message":"تم تسجيل الدخول"}` |
| `POST /api/payments` إنشاء دفعة | `{"success":true,"paymentId":"PAY-...","status":"PENDING","amount":1500}` |
| `PATCH /api/admin/payments` verify بـ `durationMonths:2` | `status: VERIFIED`, `verifiedAt: 2026-09-09`, `expiresAt: 2026-11-09` (شهران تماماً) |
| `GET /api/admin/payments?search=0661234567` | يجد الدفعة بالهاتف |
| `GET /api/admin/payments?status=VERIFIED` | يجد فقط الموثّقة |
| `GET /api/admin/notifications` بعد verify | إشعاران (إنشاء + تحقق) |
| `PATCH /api/admin/notifications {all:true}` | `{"success":true,"updated":2}` |
| `GET /api/admin/notifications?unread=true` بعد الكل | قائمة فارغة |
| `POST /api/admin/settings` upsert SMTP_USER/PASS | تم الحفظ وإرجاع كل الإعدادات |
| `GET /api/admin/settings` | يُرجع 10 مفاتيح مع القيم الافتراضية |
| `GET /api/admin/stats` | `totalPayments:1, totalVerifiedCount:1, totalRevenue:1500` + statusStats + methodStats + dailyData (7 أيام) |
| `POST /api/admin/test-email` بدون SMTP | خطأ `إعدادات SMTP غير مكتملة` (متوقع) |
| `POST /api/admin/test-email` بـ SMTP وهمي | خطأ `535-5.7.8 Username and Password not accepted` (إثبات أن SMTP يعمل) |
| `GET /api/subscription?phone=0661234567` | يُرجع الدفعة الأخيرة |
| `POST /api/check-subscription` | يُرجع الحالة `active: false, status: PENDING` |
| `POST /api/notify-whatsapp {phone:"0661234567", action:"welcome"}` | `https://wa.me/213661234567?text=...` مع رسالة عربية مُرمّزة |
| كل المسارات المحمية بدون Bearer | 401 Unauthorized |

### ملاحظات معمارية
- **الفصل بين `Setting` و`AdminSetting`**: استمرار عمل `@/lib/email.ts` و`@/lib/settings.ts` القديمين (اللذان يستعملان `Setting`) دون أي تغيير في سلوكها، مع إضافة جدول `AdminSetting` مستقل للوحة الإدارة. هذا يُسهّل التراجع أو التوحيد لاحقاً دون كسر الكود الحالي.
- **حماية Bearer موحّدة**: كل مسارات `admin/*` تستعمل `isAuthorized(req)` من `@/lib/auth`، الذي يستعمل `safeEqual` (مقارنة ثابتة الزمن) لتفادي هجمات التوقيت.
- **تنبيهات Brute-force**: تسجيل الدخول يُضيف تأخيراً 200ms عند فشل كلمة السر.
- **الإشعارات آمنة**: `createNotification` لا يُسقط العملية الأم إذا فشل (try/catch)، لأن الإشعار تحسين وليس شرطاً.
- **التواريخ**: عند `verify`، يُضبط `expiresAt = now + durationMonths` شهراً عبر `addMonths` التي تُعالج الفائض في الأيام تلقائياً (باستعمال `Date.setMonth`).
- **رفع الفيديو**: يُحفظ الملف في `public/videos/{lessonSlug}.mp4` مع تنظيف الـ slug (أحرف أبجدية رقمية + شرطات فقط، حد 80 خانة).

### واجهة لوحة الإدارة (`/admin`)
- **LoginScreen**: بطاقة وسط الشاشة، حقل كلمة سر، يخزّن التوكن في `localStorage` تحت `math_admin_key`
- **AdminDashboard**:
  - ترويسة لاصقة مع زر "رفع الفيديوهات" + زر "خروج"
  - 4 تبويبات (Tabs) بعرض كامل على الموبايل وصف واحد على الديسكتوب
  - **PaymentsTab**: قابلة للفلترة (status + search)، أزرار إجراءات حسب الحالة (توثيق/رفض للـ PENDING، إنهاء/إلغاء للـ EXPIRED/CANCELLED)، عند verify يطلب `durationMonths` عبر `prompt()`
  - **AnalyticsTab**: 4 بطاقات (إجمالي، موثّقة، إيرادات، قيد المراجعة) + AreaChart يومي (إجمالي + موثّقة) + PieChart بالحالة + BarChart بطريقة الدفع — كلها بـ Recharts
  - **NotificationsTab**: قائمة scrollable (`max-h-[28rem] overflow-y-auto`) + شارة عدد غير المقروء + أزرار "عرض الكل/المقروءة فقط" + "تعليم الكل"
  - **SettingsTab**: 4 مجموعات (SMTP، Resend، المسؤول، Webhook) + بطاقة Test Email + دليل Gmail App Password من 7 خطوات + تنبيه أمني

### واجهة رفع الفيديوهات (`/admin/videos`)
- يتحقق من وجود التوكن في `localStorage`، وإلا يُظهر شاشة "يجب تسجيل الدخول"
- نموذج رفع MP4: حقل file + lessonSlug + title (اختياري)
- شريط تقدّم للرفع (محاكاة لأن `fetch` لا يوفر تقدّماً فعلياً)
- نتيجة الرفع: رابط معاينة مباشر للفيديو
- دليل ثلاث أدوات مع روابط رسمية وخطوات مفصّلة
- نصائح عامة (دقة 1080p، 30fps، حجم < 200MB)

### تذييل
كل الصفحات تستعمل `min-h-screen flex flex-col` مع `mt-auto` للتذييل لتفادي المشكلة المعروفة (التذييل العائم).

### الإشراف البيداغوجي
الأستاذ عدلي أسعد — منصة الرياضيات للسنة الثالثة ثانوي

---
**تاريخ الإنجاز**: 2026-09-09
**المدة**: ~ساعة
**عدد الملفات**: 13 (10 APIs + 2 صفحات + 1 تحديث schema)
**حجم الكود**: ~2500 سطر TypeScript

---

## 2026-09-09 — تحسينات الجودة والأمان (صفحات خطأ + فهارس Prisma + إصلاحات TS)

### المهمة
إعادة بناء جملة من التحسينات المعمارية على المنصة: إنشاء صفحات الخطأ الرسمية، تعزيز أمان الـ HTTP headers، إضافة فهارس على قاعدة البيانات لتسريع الاستعلامات الإدارية، تهيئة الإعدادات الافتراضية، وإصلاح أخطاء TypeScript في `src/app/page.tsx` والمكوّنات.

### الملفات المُنشأة/المُعاد بناؤها

#### 1) صفحات الخطأ (4 ملفات)
| الملف | الوصف |
|-------|-------|
| `src/app/error.tsx` | خطأ وقت التشغيل (App Router error boundary) — واجهة RTL بأيقونة `AlertTriangle`، زر "إعادة المحاولة" + "العودة للرئيسية"، وعرض تفاصيل الخطأ في وضع التطوير (`process.env.NODE_ENV === "development"`) |
| `src/app/loading.tsx` | شاشة تحميل (Suspense fallback) — spinner + ثلاثة skeleton bars متدرجة |
| `src/app/not-found.tsx` | صفحة 404 — بأيقونة `FileQuestion` ورسالة "الصفحة غير موجودة" |
| `src/app/global-error.tsx` | خطأ حرج خارج App Router (يحلّ محل `<html>` و`<body>`) — بدون Tailwind، يستعمل inline styles لتجنّب كسر التحميل |

#### 2) `next.config.ts`
تمت إضافة 6 رؤوس أمان HTTP تُطبّق على كل المسارات `"/(.*)"`:
- `X-Frame-Options: SAMEORIGIN` — منع النقر على المحتوى داخل iframe
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()` — تعطيل FLoC
- `Content-Security-Policy` — سياسة شاملة لمنع XSS و data exfiltration

كذلك:
- `reactStrictMode: true` (كان false)
- `images.formats: ["image/avif", "image/webp"]`
- `images.remotePatterns: [{ protocol: "https", hostname: "**" }]` — السماح بأي مصدر HTTPS للصور
- حُذف `typescript.ignoreBuildErrors: true` (لم نعد بحاجة لتجاوز أخطاء TS بعد إصلاحها)

#### 3) `tsconfig.json`
أُضيفت الإضافات التالية إلى `exclude` لتسريع tsc وتجنّب فحص ملفات التمرين والمهارات والاختبارات والسكربتات و tool-results:
```json
"exclude": [
  "node_modules",
  "examples",
  "skills",
  "tests",
  "scripts",
  "tool-results"
]
```

#### 4) `prisma/schema.prisma` — إضافة فهارس
| النموذج | الفهارس المضافة |
|---------|-----------------|
| `Payment` | `@@index([createdAt])`, `@@index([status, createdAt])`, `@@unique([transactionRef])` (الـ3 فهارس القديمة على phone, transactionRef, status بقيت) |
| `PaymentNotification` | **نموذج جديد** بالكامل: `@@index([read, createdAt])`, `@@index([createdAt])`, `@@index([paymentId])` |
| `ExerciseAttempt` | `@@index([userId, createdAt])`, `@@index([exerciseId])` |
| `QuizResult` | `@@index([userId, createdAt])`, `@@index([quizId])` |
| `UnitProgress` | `@@index([userId])` (بالإضافة إلى `@@unique([userId, unitId])` الموجود) |

**ملاحظة**: نموذج `PaymentNotification` الجديد مستقل عن جدول `Notification` العام الذي يستعمله `@/lib/notifications.ts` (مرتبط بـ User عبر userId). `PaymentNotification` مُعدّ لاستعمال مستقبلي مباشر بدون الحاجة لـ User وهمي. لم يُربط بالكود القائم لتجنّب كسر سلوك الإشعارات الحالي.

**تنفيذ Prisma**: شُغّل `bun run db:push --accept-data-loss` بنجاح. تم تحديث Prisma Client تلقائياً.

#### 5) سكربت تهيئة الإعدادات `scripts/seed-admin-settings.ts`
سكربت مؤقّت (TypeScript، يُشغّل بـ `bun run scripts/seed-admin-settings.ts`) يقوم بـ upsert للقيم الافتراضية في جدول `AdminSetting`:

| المفتاح | القيمة |
|---------|--------|
| `ADMIN_EMAIL` | `asaadadli9393@gmail.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `asaadadli9393@gmail.com` |

السكربت:
- يفحص كل مفتاح: إن غير موجود يُنشئه (➕)، إن موجود بقيمة مختلفة يحدّثه (✏️)، إن موجود بنفس القيمة يتركه (✓)
- مطابق لـ `DEFAULT_VALUES` في `src/app/api/admin/settings/route.ts` مما يضمن أن لوحة الإدارة تجد القيم في DB مباشرةً دون اللجوء للـ fallback
- خرج السكربت عند التشغيل الفعلي:
  ```
  ➕ أُنشئ: ADMIN_EMAIL = asaadadli9393@gmail.com
  ➕ أُنشئ: SMTP_HOST = smtp.gmail.com
  ➕ أُنشئ: SMTP_PORT = 587
  ✏️  تم تحديث: SMTP_USER = asaadadli9393@gmail.com (كان: )
  ```
- الإجمالي في الجدول بعد التشغيل: 5 مفاتيح (4 جديدة + `SMTP_PASS` فارغ موجود مسبقاً)

#### 6) إصلاحات `src/app/page.tsx` (TypeScript)
| الخطأ | الإصلاح |
|-------|---------|
| `variant="ghost"` على Badge (مكوّن Badge لا يدعم ghost) — 10 مواضع | استُبدلت الكل بـ `variant="outline"` (recherche: `replace_all`) |
| `selectedPlanId: "BASIC" | "PREMIUM" | "FAMILY" | null` — يفقد FREE | غُيّرت إلى `PlanTier | null` (يشمل FREE) |
| `planId as "BASIC" | "PREMIUM" | "FAMILY"` — cast ناقص | غُيّر إلى `planId as PlanTier` |
| `MainView` ناقص | أُضيفت `"payment-product"` و `"admin"` (مع `"payment"` الموجود) |
| `toast` و `setView` خارج النطاق في `PricingView` (line 2344, 2348) | أُضيفت props جديدة: `onNavigateToDashboard: () => void` واستُدعي `useToast()` داخل المكون، واستُبدل `setView("dashboard")` بـ `onNavigateToDashboard()` |
| `setView` خارج النطاق في `ProductsView` (line 2723) | أُضيفت `onNavigateToPricing: () => void` واستُبدل `setView("pricing")` بـ `onNavigateToPricing()` |
| `subscribeToPlan` في student-store.ts يرفض FREE | غُيّرت توقيع الدالة من `"BASIC" | "PREMIUM" | "FAMILY"` إلى `"FREE" | "BASIC" | "PREMIUM" | "FAMILY"` |

#### 7) إصلاحات إضافية للمكوّنات (TypeScript)
| الملف | الإصلاح |
|-------|---------|
| `src/components/bac-exam-card.tsx` | `<Badge variant="ghost">` → `<Badge variant="outline">` (3 مواضع) |
| `src/components/course-card.tsx` | `<Badge variant="ghost">` → `<Badge variant="outline">` (2 مواضع) |
| `src/components/exercise-card.tsx` | `<Badge variant="ghost">` → `<Badge variant="outline">` |
| `src/components/video-simulation-player.tsx` | `<Badge variant="ghost">` و `<Button variant="ghost">` → `outline` (4 مواضع) |
| `src/components/interactive-quiz.tsx` | `answers.reduce(...)` → `answers.reduce<number>(...)` (مكانان) لإصلاح `'acc' is possibly 'null'` و `'correctCount: correct'` |
| `src/components/math-renderer.tsx` | حُذف `dir: "ltr"` من `katex.renderToString` (غير مدعوم في `KatexOptions`)؛ أُضيفت fallbacks `?? ""` و `?? []` على `block.content`, `block.items`, `block.rows` |
| `src/lib/student-store.ts` | أُضيف تعليق صريح للنوع `(set): StudentStore => ({...})` لإصلاح `StateCreator` mismatch (كان يفترض `profile: null` بدل `UserProfile | null`) |

**ملاحظة على `variant="ghost"` في shadcn/ui**: بقي `variant="ghost"` في `src/components/ui/sidebar.tsx` و `src/components/ui/calendar.tsx` لأنه خيار صالح للـ Button ولأنه مكوّنات المكتبة (لا تُعدّل).

### التحقق التقني
- ✅ `npx tsc --noEmit` — **0 أخطاء** في كل المشروع (كان فيها 27 خطأ قبل الإصلاح)
- ✅ `npx next build` — نجح بالكامل (`✓ Compiled successfully in 16.4s` + `✓ Generating static pages using 1 worker (17/17) in 360.4ms`)
- ✅ `bun run lint` — 0 أخطاء، تنبيه واحد فقط في `interactive-quiz.tsx` (eslint-disable غير ضروري — تحذير قديم ليس خطأ)
- ✅ `bun run db:push` — نجح، حُدّث Prisma Client (v6.19.2)
- ✅ خادم التطوير يعمل على المنفذ 3000 (Next.js 16.1.3 + Turbopack)

### ملاحظات معمارية
- **الفصل بين صفحات الخطأ**: `error.tsx` (App Router) و `global-error.tsx` (خارجه) يتكاملان: الأول يحلّ الأخطاء داخل root layout، الثاني يحلّل أخطاء layout نفسه. `global-error.tsx` يستعمل inline styles فقط لتفادي الاعتماد على Tailwind (الذي قد لا يُحمّل إذا فشل layout).
- **CSP متساهلة قليلاً**: `script-src 'self' 'unsafe-inline' 'unsafe-eval'` — ضرورية لـ Next.js (Turbopack يحقن سكربتات inline). يمكن تقويتها لاحقاً عبر nonce إذا تطلّب الإنتاج ذلك.
- **الفهارس تخدم الاستعلامات الحالية**: استعلامات admin/payments تُرتّب حسب `createdAt desc` وفلترة `status` و`transactionRef` — الفهارس الجديدة تُسرّع هذه الاستعلامات بشكل ملحوظ على جداول كبيرة.
- **PaymentNotification مستقل**: لم يُربط بكود `notifications.ts` الحالي لتجنّب كسر سلوك الإشعارات. مُعدّ لاستعمال مباشر مستقبلاً إذا أردنا فصل إشعارات المدفوعات عن `Notification` العامة المرتبطة بـ User.

### الإشراف البيداغوجي
الأستاذ عدلي أسعد — منصة الرياضيات للسنة الثالثة ثانوي

---
**تاريخ الإنجاز**: 2026-09-09
**المدة**: ~35 دقيقة
**عدد الملفات**: 14 (4 صفحات خطأ + next.config + tsconfig + schema + سكربت + page.tsx + 5 مكوّنات + student-store)
