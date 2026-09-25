#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
full_qa.py — الفحص الشامل الدائم لمنصة تدرّج
الاستخدام: python3 scripts/full_qa.py [BASE_URL]
الافتراضي: http://localhost:3000

يفحص كل شاشة على 3 مقاسات (390/768/1366):
  1) تجاوز أفقي (scrollWidth > clientWidth)
  2) أخطاء الكونسول (console.error)
  3) استثناءات غير معالجة (pageerror)
  4) طلبات فاشلة (HTTP >= 400)
"""
import json, sys, time
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

# (view_id, نص زر سطح المكتب, نص زر الجوال, وقت تسوية إضافي)
VIEWS = [
    ("home",      None,            None,            0),
    ("aitutor",   "الذكي",         "المدرس الذكي",  1),
    ("curriculum","التدرج",        "التدرج السنوي", 1),
    ("chapters",  "الفصول",        "الفصول",        1),
    ("bank",      "التمارين",      "بنك التمارين",  2),
    ("exams",     "الاختبارات",    "الفروض والاختبارات", 2),
    ("chains",    "السلاسل",       "السلاسل",       2),
    ("courses",   "الدورات",       "الدورات",       2),
    ("graphing",  "الرسم",         "لوحة الرسم",    12),
    ("quiz",      "اختبار",        "اختبار",        2),
    ("dashboard", "تقدمي",         "تقدمي",         1),
    ("subscribe", "__subscribe__", "الاشتراك",      1),
    ("admin",     "__admin__",     "__admin__",     1),
]
WIDTHS = [390, 768, 1366]

results = []  # (view, width, ok, issues[])

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=[
            "--use-gl=swiftshader", "--enable-unsafe-swiftshader",
        ])
        for w in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": 860}, locale="ar")
            page = ctx.new_page()
            console_errors, page_errors, bad_responses = [], [], []

            page.on("console", lambda m: console_errors.append(m.text[:220])
                    if m.type == "error" else None)
            page.on("pageerror", lambda e: page_errors.append(str(e)[:220]))
            page.on("response", lambda r: bad_responses.append(f"{r.status} {r.url[:150]}")
                    if r.status >= 400 and "favicon" not in r.url else None)

            page.goto(BASE, timeout=45000, wait_until="domcontentloaded")
            page.wait_for_timeout(3500)

            for vid, desk, mob, settle in VIEWS:
                console_errors.clear(); page_errors.clear(); bad_responses.clear()
                ok, issues = True, []
                try:
                    if vid == "home":
                        pass
                    elif vid == "subscribe" and w >= 1280:
                        page.get_by_role("button", name="اشترك الآن").first.click(timeout=6000)
                    elif vid == "admin":
                        page.get_by_role("button", name="لوحة الأستاذ").click(timeout=6000)
                    elif w >= 1280:
                        page.locator('nav[aria-label="التنقل الرئيسي"]') \
                            .get_by_role("button", name=desk, exact=True).click(timeout=6000)
                    else:
                        page.locator('nav[aria-label="التنقل للهاتف"]') \
                            .get_by_role("button", name=mob, exact=True).click(timeout=6000)
                except Exception as e:
                    ok, issues = False, [f"تنقل: {str(e)[:160]}"]
                    results.append((vid, w, ok, issues)); continue

                page.wait_for_timeout(2500 + settle * 1000)

                # 1) تجاوز أفقي
                ov = page.evaluate(
                    "() => Math.max(document.documentElement.scrollWidth,"
                    " document.body.scrollWidth) - document.documentElement.clientWidth")
                if ov > 1:
                    ok = False
                    issues.append(f"تجاوز أفقي {ov}px")
                # 2+3) أخطاء
                if page_errors:
                    ok = False
                    issues += [f"pageerror: {e}" for e in page_errors[:3]]
                real_console = [c for c in console_errors
                                if "favicon" not in c and "net::ERR_FAILED" not in c]
                if real_console:
                    issues += [f"console: {c}" for c in real_console[:3]]
                # 4) طلبات فاشلة
                real_bad = [b for b in bad_responses if "geogebra" not in b.lower()]
                if real_bad:
                    ok = False
                    issues += [f"طلب فاشل: {b}" for b in real_bad[:3]]

                if issues and not ok:
                    page.screenshot(path=f"qa/fullqa-{vid}-{w}.png")
                elif issues:
                    pass  # تحذيرات فقط
                results.append((vid, w, ok, issues))

            ctx.close()
        browser.close()

run()

# ---------- التقرير ----------
fails = [(v, w, i) for v, w, ok, i in results if not ok]
warns = [(v, w, i) for v, w, ok, i in results if ok and i]
print("=" * 60)
print(f"نتائج الفحص الشامل على {BASE}")
print("=" * 60)
for v, w, i in fails:
    print(f"FAIL {v:11} @{w}: {i}")
if warns:
    print("--- تحذيرات (لا تُحسب فشلاً) ---")
    for v, w, i in warns:
        print(f"WARN {v:11} @{w}: {i}")
print("=" * 60)
total = len(results)
print(f"النتيجة: {total - len(fails)}/{total} PASS — فشل: {len(fails)}")
sys.exit(1 if fails else 0)
