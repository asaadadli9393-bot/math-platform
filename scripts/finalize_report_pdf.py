#!/usr/bin/env python3
"""Set PDF metadata + stamp page numbers (skip cover, Arabic numerals start at 1 on page 2)."""
import io
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor

SRC = "/home/z/my-project/download/math-adli-review-report.pdf"
OUT = "/home/z/my-project/download/math-adli-review-report.pdf"
PAGE_W, PAGE_H = 595.5, 842.25  # 794x1123 px at 96dpi -> pt (72/96 scale)

reader = PdfReader(SRC)
writer = PdfWriter()

for i, page in enumerate(reader.pages):
    w = float(page.mediabox.width)
    h = float(page.mediabox.height)
    if i > 0:  # skip cover
        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=(w, h))
        c.setFont("Helvetica", 9)
        c.setFillColor(HexColor("#8a938e"))
        c.drawCentredString(w / 2, 22, str(i))
        c.save()
        buf.seek(0)
        overlay = PdfReader(buf).pages[0]
        page.merge_page(overlay)
    writer.add_page(page)

writer.add_metadata({
    "/Title": "تقرير تحليل ومراجعة منصة الرياضيات — math-adli.vercel.app",
    "/Author": "Z.ai",
    "/Creator": "Z.ai",
    "/Subject": "مراجعة تقنية شاملة: تجربة المستخدم، المحتوى التعليمي، الأداء، SEO، وسجل الأخطاء مع خارطة طريق التطوير",
    "/Keywords": "math-adli, منصة الرياضيات, تقرير مراجعة, Next.js, تعليم, الجزائر",
})

with open(OUT, "wb") as f:
    writer.write(f)

print("metadata + page numbers done; pages:", len(writer.pages))
