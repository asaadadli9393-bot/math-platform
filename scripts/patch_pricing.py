# -*- coding: utf-8 -*-
"""رقعة الأسعار: اشتراك واحد 1000 دج/سنة — subscription.ts + SubscribeView + HomeView."""
import io

def patch(path, pairs):
    s = io.open(path, encoding='utf-8').read()
    for old, new in pairs:
        assert old in s, f'NOT FOUND in {path}: {old[:60]!r}'
        s = s.replace(old, new, 1)
    io.open(path, 'w', encoding='utf-8').write(s)
    print('OK', path, f'({len(pairs)} edits)')

# ---------- 1) subscription.ts ----------
patch('/home/z/my-project/src/lib/subscription.ts', [
    (
        "Y1: { id: 'Y1', months: 12, label: 'الاشتراك السنوي', shortLabel: 'سنوي', priceDzd: 3000, note: 'أفضل قيمة — توفر 3000 دج' },",
        "Y1: { id: 'Y1', months: 12, label: 'الاشتراك السنوي', shortLabel: 'سنوي', priceDzd: 1000, note: 'سنة كاملة من كل المزايا — دفع مرة واحدة' },",
    ),
    (
        "/** الباقتان المعروضان في صفحة الاشتراك (النظام المزدوج) */\nexport const DUAL_PLANS: PlanInfo[] = [PLANS.M1, PLANS.Y1];",
        "/** الباقة المعروضة في صفحة الاشتراك — اشتراك واحد للجميع */\nexport const OFFERED_PLANS: PlanInfo[] = [PLANS.Y1];",
    ),
])

# ---------- 2) SubscribeView.tsx ----------
patch('/home/z/my-project/src/components/views/SubscribeView.tsx', [
    (
        "import {\n  ALL_PLANS,\n  DUAL_PLANS,",
        "import {\n  ALL_PLANS,\n  OFFERED_PLANS,",
    ),
    (
        "import { DEVOIR_PAPERS } from '@/data/devoir-pdfs';",
        "import { DEVOIR_PAPERS } from '@/data/devoir-pdfs';\nimport { DZEXAMS_CHAINS } from '@/data/chain-pdfs';",
    ),
    (
        "        <h1 className=\"mb-2 text-3xl font-black text-stone-900 md:text-4xl\">نظام الاشتراك المزدوج</h1>\n        <p className=\"mx-auto max-w-2xl leading-relaxed text-stone-500\">\n          باقتان للاختيار بينهما، ومسارَا تفعيل عبر البريد الإلكتروني: أرسل طلبك إلى الأستاذ\n          عدلي اسعد واستلم كود التفعيل في بريدك، أو فعّل فوراً بكود وصلك. المحتوى الأساسي\n          يبقى مجانياً للجميع.\n        </p>",
        "        <h1 className=\"mb-2 text-3xl font-black text-stone-900 md:text-4xl\">اشتراك واحد — كل المزايا لسنة كاملة</h1>\n        <p className=\"mx-auto max-w-2xl leading-relaxed text-stone-500\">\n          اشتراك واحد بثمن رمزي: 1000 دج تفتح لك كل المزايا المميزة لسنة كاملة. حوّل مباشرة\n          ببريدي موب أو CCP (التفاصيل أدناه)، أرسل الوصل مع طلبك، واستلم كود التفعيل في بريدك.\n          المحتوى الأساسي يبقى مجانياً للجميع.\n        </p>",
    ),
    (
        "      <div className=\"grid gap-5 md:grid-cols-2\">\n        {DUAL_PLANS.map((p, idx) => {\n          const popular = idx === 1;",
        "      <div className=\"mx-auto grid max-w-xl gap-5\">\n        {OFFERED_PLANS.map((p) => {\n          const popular = true;",
    ),
    (
        "                {p.id === 'Y1' && (\n                  <p className=\"text-[11px] font-black text-amber-600\">≈ 8 دج يومياً — أرخص من قطعة حلوى</p>\n                )}",
        "                {p.id === 'Y1' && (\n                  <p className=\"text-[11px] font-black text-amber-600\">≈ 2.7 دج يومياً — أرخص من قطعة حلوى</p>\n                )}",
    ),
    (
        "const PREMIUM_FEATURES = [\n  `مكتبة الأستاذ الكاملة: ${LIBRARY_CHAINS.length} وثيقة PDF منتقاة (سلاسل تمارين مع الحلول + مذكرات وملخصات)`,",
        "const PREMIUM_FEATURES = [\n  `مكتبة الأستاذ الكاملة: ${LIBRARY_CHAINS.length} وثيقة PDF منتقاة (سلاسل تمارين مع الحلول + مذكرات وملخصات)`,\n  `سلاسل الحلول المفصلة للسنة الأولى والثانية ثانوي (${DZEXAMS_CHAINS.length} سلسلة كاملة محلولة خطوة بخطوة)`,",
    ),
    (
        "  'قصص «أنمي الرياضيات» الجديدة فور صدورها (القصة الأولى مجانية للجميع)',",
        "  'قصص «أنمي الرياضيات» الجديدة فور صدورها (قصص المستويات مجانية للجميع)',",
    ),
])

# ---------- 3) HomeView.tsx ----------
patch('/home/z/my-project/src/components/views/HomeView.tsx', [
    (
        "      a: 'بريدي موب BaridiMob أو حساب بريدي CCP أو البطاقة الذهبية — ترسل طلبك من صفحة الاشتراك، يرد عليك الأستاذ بتفاصيل الدفع خلال 24 ساعة كأقصى حد، وبعد الدفع يصلك كود التفعيل في بريدك وتُفتح كل المزايا فوراً.',",
        "      a: 'بريدي موب BaridiMob أو حساب بريدي CCP — تفاصيل الحساب ظاهرة مباشرة في صفحة الاشتراك: حوّل المبلغ ثم أرسل طلبك مع صورة الوصل، وبعد تأكيد الدفع يصلك كود التفعيل في بريدك وتُفتح كل المزايا فوراً.',",
    ),
    (
        "                3000 دج <span className=\"text-sm font-bold text-stone-400\">/ سنة — أو 500 دج شهرياً</span>",
        "                1000 دج <span className=\"text-sm font-bold text-stone-400\">/ سنة — اشتراك واحد فقط</span>",
    ),
    (
        "                السنوي = أقل من 9 دج في اليوم — ثمن قطعة حلوى تفتح لك عاماً كاملاً من أرشيف الأستاذ.",
        "                اشتراك واحد = أقل من 3 دج في اليوم — ثمن قطعة حلوى تفتح لك عاماً كاملاً من أرشيف الأستاذ.",
    ),
    (
        "      desc: 'أول قسم من نوعه في المنصات الجزائرية: قصص أنمي تفاعلية قصيرة تحوّل أصعب الفصول إلى مغامرة مشوّقة — جرّب قصة «الأعداد المركبة: العالم الموازي» مجاناً الآن.',",
        "      desc: 'أول قسم من نوعه في المنصات الجزائرية: قصص أنمي تفاعلية قصيرة تحوّل أصعب الفصول إلى مغامرة مشوّقة — قصة مجانية لكل مستوى، جرّب قصة مستواك الآن.',",
    ),
])
