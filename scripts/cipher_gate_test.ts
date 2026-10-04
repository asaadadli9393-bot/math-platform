import * as fs from 'fs';
import { cleanDocText, isCipherLine, docCipherRatio } from '/home/z/my-project/src/lib/reader-math';

const targets = [
  'devoirs_3as_d-3as-022_pdf.json',   // مشفرة بالكامل تقريباً
  'chains_library_lib-3as-func-deriv-1_pdf.json', // مشفرة جزئياً
  'chains_library_lib2-3as-func-deriv-9_pdf.json', // سليمة
  'chains_suite2027_pdf.json',        // سلسلة أستاذ سليمة
  'chains_library_lib2-2as-c2-func-7_pdf.json', // أسوأ PUA (86)
];
for (const t of targets) {
  const d = JSON.parse(fs.readFileSync('public/formatted/' + t, 'utf8'));
  const r = docCipherRatio(d.blocks);
  console.log(`${t.slice(0, 48).padEnd(50)} ratio=${r.toFixed(2)} → ${r > 0.45 ? 'بطاقة «افتح PDF»' : 'قراءة ذكية عادية'}`);
}
// عينات isCipherLine
const samples = [
  'f íÖ]‚Ö] F íé×‘ù]<íÖ]‚Ö] [<F àéfl Â<Ví×nÚ_',
  '@@âb\uf26ey@ï¦bß@Z‡bn\uf26dþa@Éº@@@@@@@',
  '< <J<<<<<<<<<<<<<<<<<< f (x)=',
  'x = 0.7 et α ∈ ]0.8;+∞[',   // رياضيات سليمة يجب ألا تُكشف
  'P(A∩B) = 0.42',
  '2x^{2} + 3x − 5 = 0',
  'f (x )dx = F (x ) b = F (b)−F (a)',
];
for (const s of samples) console.log(`isCipher(${s.slice(0, 40)}) = ${isCipherLine(cleanDocText(s))}`);
