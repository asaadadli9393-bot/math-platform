// ===================================================
//  PricingView المبسّطة + SimplePaymentView
//  عرض واحد فقط بـ 500 دج + نموذج 3 حقول
// ===================================================

function PricingView({ onSelectPlan, onNavigateToDashboard }: { onSelectPlan: (planId: PlanTier) => void; onNavigateToDashboard: () => void }) {
  const subscriptionTier = useStudentStore((s) => s.getSubscriptionTier());
  const profile = useStudentStore((s) => s.profile);
  const updateProfile = useStudentStore((s) => s.updateProfile);
  const { toast } = useToast();

  const BARIDI_MOB_ACCOUNT = "00799999000928218135";
  const [copied, setCopied] = React.useState(false);
  const [step, setStep] = React.useState<"form" | "submitted">(profile?.pendingPaymentId ? "submitted" : "form");
  const [studentName, setStudentName] = React.useState(profile?.name ?? "");
  const [studentPhone, setStudentPhone] = React.useState(profile?.phone ?? "");
  const [transactionRef, setTransactionRef] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BARIDI_MOB_ACCOUNT);
      setCopied(true);
      toast({ title: "✅ تم النسخ", description: "رقم الحساب في الحافظة — الصقه في تطبيق بريدي موب" });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({ title: "انسخ يدوياً", description: BARIDI_MOB_ACCOUNT });
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!studentName.trim()) { setError("أدخل اسمك الكامل"); return; }
    if (!studentPhone.trim() || !/^\d{10}$/.test(studentPhone.trim()) || !studentPhone.trim().startsWith("0")) {
      setError("رقم هاتفك يجب أن يكون 10 أرقام تبدأ بـ 0"); return;
    }
    if (!transactionRef.trim()) { setError("أدخل رقم العملية من رسالة بريدي موب"); return; }

    setSubmitting(true);
    updateProfile({ name: studentName.trim(), phone: studentPhone.trim() });

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: "FULL",
          planName: "الاستفادة الكاملة",
          amount: 500,
          durationMonths: 12,
          transactionRef: transactionRef.trim(),
          method: "BARIDI_MOB",
          studentName: studentName.trim(),
          studentPhone: studentPhone.trim(),
          studentEmail: profile?.email,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "فشل إرسال الطلب. حاول مرة أخرى.");
        setSubmitting(false);
        return;
      }
      useStudentStore.getState().setPendingPayment(data.paymentId, data.transactionRef);
      setStep("submitted");
      setSubmitting(false);
      toast({
        title: "✅ تم إرسال طلبك",
        description: "وصل إشعار للإدارة. سيتم تفعيل اشتراكك خلال 24 ساعة.",
      });
    } catch {
      setError("تعذّر الاتصال. تحقق من الإنترنت وأعد المحاولة.");
      setSubmitting(false);
    }
  };

  // ✅ حالة "submitted" — بسيطة جداً
  if (step === "submitted") {
    const whatsappMessage = `📋 طلب اشتراك جديد — منصة الرياضيات
الاسم: ${profile?.name}
الهاتف: ${profile?.phone}
رقم العملية: ${useStudentStore.getState().profile?.pendingTransactionRef}
المبلغ: 500 دج (بريدي موب)`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-600" />
            <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              ✅ تم إرسال طلبك بنجاح!
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              وصل إشعار للإدارة بطلبك. سيتم التحقق من عملية الدفع وتفعيل اشتراكك خلال 24 ساعة.
              <br />
              <strong>لا حاجة لأي خطوة أخرى</strong> — ستُفعّل تلقائياً على هذا المتصفح.
            </p>
            <div className="bg-white dark:bg-emerald-950/40 rounded-md p-4 text-sm space-y-1 text-right">
              <div className="flex justify-between"><span className="text-muted-foreground">الاسم:</span><strong>{profile?.name}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">الهاتف:</span><strong>{profile?.phone}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">رقم العملية:</span><strong className="font-mono">{useStudentStore.getState().profile?.pendingTransactionRef}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">المبلغ:</span><strong>500 دج</strong></div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              أرسل إشعار WhatsApp للأستاذ (اختياري)
            </a>
            <Button variant="outline" className="gap-2" onClick={() => { setStep("form"); setTransactionRef(""); }}>
              <RefreshCw className="w-4 h-4" />
              إرسال طلب آخر
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ الحالة "form" — نموذج بسيط جداً
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* الرأس */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-3">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 academic-divider mx-auto">
          اشترك بـ 500 دج فقط
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          خطوة واحدة فقط: حوّل 500 دج لرقم بريدي موب، أدخل اسمك + هاتفك + رقم العملية.
          سيُفعّل اشتراكك خلال 24 ساعة.
        </p>
      </div>

      {subscriptionTier === "FULL" && (
        <Card className="border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
            <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              أنت مشترك بالفعل — استمتع بكل المحتوى! 🎉
            </h2>
          </CardContent>
        </Card>
      )}

      {/* خطوة 1: التحويل لبريدي موب */}
      <Card className="border-2 border-blue-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">1</span>
            حوّل 500 دج إلى رقم بريدي موب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted/50 rounded-md p-4">
            <div className="text-sm text-muted-foreground mb-1">رقم حساب الأستاذ عدلي أسعد:</div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-lg font-mono font-bold tracking-wider text-primary" dir="ltr">{BARIDI_MOB_ACCOUNT}</code>
              <Button size="sm" variant={copied ? "default" : "outline"} onClick={handleCopyAccount} className="gap-1">
                {copied ? <><Check className="w-4 h-4" />تم</> : <><Copy className="w-4 h-4" />نسخ</>}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            📱 افتح تطبيق بريدي موب ← تحويل ← الصق الرقم ← أدخل 500 دج ← أرسل.
            <br />
            ستستلم رسالة SMS فيها <strong>رقم العملية</strong> — احتفظ به للخطوة التالية.
          </p>
        </CardContent>
      </Card>

      {/* خطوة 2: النموذج */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">2</span>
            أدخل بياناتك + رقم العملية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="s-name" className="block mb-1.5 font-bold">اسمك الكامل *</Label>
            <Input id="s-name" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="مثال: أحمد بن علي" />
          </div>
          <div>
            <Label htmlFor="s-phone" className="block mb-1.5 font-bold">رقم هاتفك (10 أرقام تبدأ بـ 0) *</Label>
            <Input id="s-phone" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} placeholder="مثال: 0551234567" className="font-mono text-left" dir="ltr" inputMode="numeric" maxLength={10} />
          </div>
          <div>
            <Label htmlFor="s-ref" className="block mb-1.5 font-bold">رقم العملية من رسالة بريدي موب *</Label>
            <Input id="s-ref" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="8-20 رقماً من رسالة SMS" className="font-mono text-left text-lg" dir="ltr" inputMode="numeric" />
            <p className="text-xs text-muted-foreground mt-1">تجده في رسالة SMS التي يرسلها بريدي موب بعد التحويل</p>
          </div>

          {error && (
            <div className="rounded-md border-r-4 border-red-500 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button size="lg" className="w-full gap-2 text-lg py-6 bg-primary hover:bg-primary/90" disabled={submitting} onClick={handleSubmit}>
            {submitting ? <><RefreshCw className="w-5 h-5 animate-spin" />جارٍ الإرسال...</> : <><CheckCircle2 className="w-5 h-5" />أرسل طلب الاشتراك</>}
          </Button>

          <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            سيُفعّل اشتراكك خلال 24 ساعة بعد التحقق
          </p>
        </CardContent>
      </Card>

      {/* ماذا ستحصل عليه */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            ماذا ستحصل عليه بـ 500 دج؟
          </h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />1000+ تمرين مع حل مفصل</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />9 دورات شاملة</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />6 مواضيع بكالوريا سابقة</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />20 فيديو تعليمي بالعربي</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />المساعد الذكي (AI)</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />أداة رسم الدوال التفاعلية</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

