// ============================================================
//  مولّد PDF للحلول النموذجية — عبر Playwright + KaTeX
// ============================================================
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { premiumCourses } = require("../src/data/premium-courses.ts");

const outputDir = path.join(__dirname, "..", "public", "courses", "solutions");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function processContent(text) {
  if (!text) return "";
  let html = text;
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br/>');
  return '<p>' + html + '</p>';
}

function generateHTML(course) {
  let solutions = [];
  let num = 0;
  course.modules.forEach((mod) => {
    solutions.push(`<div class="module-banner"><span class="module-number">الوحدة ${mod.order}</span><h2>${mod.title}</h2><p>${mod.description}</p></div>`);
    mod.exercises.forEach((ex) => {
      num++;
      solutions.push(`<div class="exercise-card"><div class="exercise-header"><span>📝 التمرين ${num}</span></div><div class="exercise-statement">${processContent(ex.statement)}</div>${ex.hint ? `<div class="hint-box">💡 ${processContent(ex.hint)}</div>` : ''}<div class="solution-box"><div class="solution-label">✅ الحل النموذجي:</div><div class="solution-content">${processContent(ex.solution)}</div></div></div>`);
    });
  });
  return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>حلول ${course.title}</title><link rel="stylesheet" href="/katex/katex.min.css"><script src="/katex/katex.min.js"></script><script src="/katex/auto-render.min.js"></script><style>@page{size:A4;margin:1.5cm} *{box-sizing:border-box;margin:0;padding:0} body{font-family:'Cairo',Tahoma,Arial,sans-serif;direction:rtl;max-width:210mm;margin:0 auto;padding:25px;color:#1a1a2e;line-height:1.9;font-size:14px} .cover{text-align:center;padding:40px;background:linear-gradient(135deg,#A4133C,#7a0e2c);border-radius:16px;color:white;margin-bottom:30px;page-break-after:always} .cover h1{font-size:28px;font-weight:900} .cover .stats{display:flex;justify-content:center;gap:30px;margin-top:25px} .cover .stat-num{font-size:32px;font-weight:900} .module-banner{background:linear-gradient(135deg,#A4133C,#c0392b);color:white;padding:18px 25px;border-radius:12px 12px 0 0;margin-bottom:15px} .module-banner h2{font-size:20px;margin:5px 0} .exercise-card{background:white;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;margin-bottom:20px;page-break-inside:avoid;box-shadow:0 2px 8px rgba(0,0,0,0.06)} .exercise-header{background:#fef3f2;padding:12px 20px;border-bottom:2px solid #f59e0b;font-weight:700;color:#d97706} .exercise-statement{padding:20px 25px;background:#fffbeb;border-right:5px solid #f59e0b;line-height:2} .hint-box{padding:12px 25px;background:#f0f9ff;border-right:5px solid #0ea5e9;font-size:13px;color:#0c4a6e} .solution-box{padding:20px 25px;background:#f0fdf4;border-right:5px solid #10b981} .solution-label{font-weight:700;color:#047857;font-size:15px;margin-bottom:12px} .solution-content{line-height:2.1} .solution-content strong{color:#047857} .footer{text-align:center;margin-top:40px;padding:25px;background:#1a1a2e;border-radius:12px;color:white} .footer h3{color:#A4133C;font-size:18px} .katex{font-size:1.05em} .katex-display{margin:12px 0;text-align:center}</style></head><body><div class="cover"><div style="font-size:48px">∑</div><h1>حلول سلسلة ${course.title}</h1><div style="opacity:0.9;margin:10px 0">${course.subtitle}</div><div class="stats"><div><div class="stat-num">${num}</div><div>تمرين محلول</div></div><div><div class="stat-num">${course.modulesCount}</div><div>وحدات</div></div><div><div class="stat-num">${Math.round(course.totalDurationMin/60)}</div><div>ساعات</div></div></div><div style="font-size:18px;font-weight:700;margin-top:20px">الأستاذ عدلي أسعد</div><div style="font-size:13px;opacity:0.8">المشرف البيداغوجي — منصة الرياضيات</div></div>${solutions.join('')}<div class="footer"><h3>منصة الرياضيات</h3><p>منصة تعليمية لطلبة السنة الثالثة ثانوي — الجزائر 🇩🇿</p><p>📧 asaadadli9393@gmail.com | 500 دج للاشتراك</p></div><script>document.addEventListener('DOMContentLoaded',function(){renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})})</script></body></html>`;
}

async function main() {
  console.log("🚀 توليد صفحات الحلول...");
  for (const course of premiumCourses) {
    const html = generateHTML(course);
    const htmlFile = path.join(outputDir, `${course.slug}-solutions.html`);
    fs.writeFileSync(htmlFile, html, "utf-8");
    console.log(`✅ ${course.slug}-solutions.html`);
  }
  console.log("\n📄 توليد PDF عبر Playwright...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const course of premiumCourses) {
    const url = `http://localhost:3000/courses/solutions/${course.slug}-solutions.html`;
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const pdfFile = path.join(outputDir, `${course.slug}-solutions.pdf`);
    await page.pdf({ path: pdfFile, format: 'A4', printBackground: true, margin: { top: '1.5cm', bottom: '1.5cm', left: '1.5cm', right: '1.5cm' } });
    console.log(`✅ ${course.slug}-solutions.pdf`);
  }
  await browser.close();
  console.log("\n🎉 تم!");
}
main().catch(console.error);
