// جرد حقيقي للمحتوى — يشغَّل بـ bun
import { EXERCISES, EXERCISE_COUNT } from '../src/data/exercises';
import { EXAMS, examsOfYear } from '../src/data/exams';
import { CHAINS, CHAINS_COUNT, CHAIN_EXERCISES_COUNT } from '../src/data/chains';
import { CHAIN_PDFS, BAC_COMPILATIONS } from '../src/data/chain-pdfs';
import { DEVOIR_PAPERS } from '../src/data/devoir-pdfs';
import { LIBRARY_CHAINS } from '../src/data/library-chains';
import { BAC_SOLUTION_CHAINS, BAC_SOLUTION_STATS } from '../src/data/bac-solutions';
import { BAC_OFFICIAL_CHAINS, BAC_OFFICIAL_STATS } from '../src/data/bac-official';
import { courses as COURSES } from '../src/data/courses';
import { premiumCourses as PREMIUM_COURSES } from '../src/data/premium-courses';
import { INTERACTIVE_CHAINS } from '../src/data/interactive-chains';

console.log('=== إجماليات المحتوى الحقيقية ===');
console.log('تمارين بنك التمارين:', EXERCISE_COUNT);
console.log('أوراق فرض واختبارات (EXAMS):', EXAMS.length);
console.log('سلاسل تفاعلية (CHAINS):', CHAINS_COUNT, 'بتمارين:', CHAIN_EXERCISES_COUNT);
console.log('سلاسل PDF (CHAIN_PDFS):', CHAIN_PDFS.length, '| منها premium:', CHAIN_PDFS.filter((p) => p.premium).length);
console.log('تجميعيات البكالوريا:', BAC_COMPILATIONS.length, '| premium:', BAC_COMPILATIONS.filter((p) => p.premium).length);
console.log('أرشيف الفروض PDF (DEVOIRS):', DEVOIR_PAPERS.length, '| مع تصحيح:', DEVOIR_PAPERS.filter((d) => d.hasCorrection).length);
console.log('مكتبة الأستاذ (LIBRARY):', LIBRARY_CHAINS.length, '(كلها premium)');
console.log('سلاسل حلول البكالوريا:', BAC_SOLUTION_CHAINS.length, '| تمارين محلولة:', BAC_SOLUTION_STATS);
console.log('مواضيع بكالوريا رسمية:', BAC_OFFICIAL_STATS);
console.log('دورات مجانية:', COURSES.length, '| دورات مميزة:', PREMIUM_COURSES.length);
console.log('سلاسل تفاعلية متقدمة:', INTERACTIVE_CHAINS.length);
console.log('3as exams:', examsOfYear('3as').length, '| 2as:', examsOfYear('2as').length, '| 1as:', examsOfYear('1as').length);
