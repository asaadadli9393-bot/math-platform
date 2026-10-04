/* ============================================================
   الشرح بالفيديو — دروس منتقاة من قنوات يوتيوب الجزائرية
   ------------------------------------------------------------
   - كل فيديو يُضمَّن عبر مشغل يوتيوب الرسمي (youtube-nocookie)
     ويبقى الفيديو ملكاً لقناته — نُنسب كل مقطع لصاحبه هنا.
   - لإضافة درس جديد: انسخ بنية عنصر واحد وغيّر ytId (المعرف
     الموجود في رابط يوتيوب بعد v=) والعنوان والقناة والمحور.
   - المحاور مواءمة مع فصول المنصة (chapterId) للربط المستقبلي.
   ============================================================ */

export type VideoLevel = '1as' | '2as' | '3as';

export interface VideoLesson {
  /** معرف يوتيوب — الحروف والأرقام بعد v= في الرابط */
  ytId: string;
  title: string;
  /** اسم القناة صاحبة الفيديو (نسبة الحقوق) */
  channel: string;
  level: VideoLevel;
  /** معرف الفصل المرتبط في المنصة (للربط المستقبلي) */
  chapterId?: string;
  /** وصف قصير بأسلوب «ماذا ستتعلم» */
  focus: string;
}

export interface VideoAxis {
  id: string;
  label: string;
  lessons: VideoLesson[];
}

export const VIDEO_AXES: VideoAxis[] = [
  {
    id: 'sequences',
    label: 'المتتاليات العددية',
    lessons: [
      {
        ytId: 'YAGvr0KYl_o',
        title: 'المتتاليات العددية من الألف إلى الياء — مع تطبيقات لكل عنصر',
        channel: 'الأستاذ نورالدين',
        level: '3as',
        chapterId: 'sequences',
        focus: 'درس كامل: التعريف، الاطراد، الحسابية والهندسية، التقارب — مع تطبيق بعد كل عنصر.',
      },
      {
        ytId: 'KaRflaTu1Rs',
        title: 'المتتاليات من الألف إلى الياء — مراجعة شاملة للبكالوريا',
        channel: 'infinity أنفينيتي',
        level: '3as',
        chapterId: 'sequences',
        focus: 'مراجعة مكثفة تجمع كل أفكار المتتاليات اللازمة لموضوع البكالوريا.',
      },
      {
        ytId: 'Knh40twckuQ',
        title: 'المتتالية الحسابية من الألف إلى الياء — شرح مفصل',
        channel: 'الأستاذ جوفر في الرياضيات',
        level: '3as',
        chapterId: 'sequences',
        focus: 'الحد العام، الخاصية التكرارية، مجموع الحدود — بأمثلة محلولة.',
      },
      {
        ytId: 'Hcrz7AkIZa4',
        title: 'المتتاليات — الدرس الأول: دراسة الاطراد',
        channel: 'رياضيات بكالوريا مع المدر',
        level: '3as',
        chapterId: 'sequences',
        focus: 'بداية ممتازة للتلميذ الذي يريد فهم الاطراد من الصفر.',
      },
    ],
  },
  {
    id: 'limits',
    label: 'الدوال العددية والنهايات',
    lessons: [
      {
        ytId: 'qF9CKQpvcSw',
        title: 'الدوال العددية من الألف إلى الياء — الحصة الأولى',
        channel: 'الأستاذ نورالدين',
        level: '3as',
        chapterId: 'limits',
        focus: 'مجموع الدوال، الضرب، الخارج، الدوال المركبة — أساس كل ما يأتي بعده.',
      },
      {
        ytId: 'oZnlxmqbSIM',
        title: 'حساب النهايات — فيديو شامل في الدوال العددية',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'limits',
        focus: 'كل تقنيات النهايات: الحالات المرجعية، الحدود غير المحددة، النهايات عند اللانهاية.',
      },
      {
        ytId: 'BIV1_Mm-eZI',
        title: 'حساب النهايات — الدرس 2 (بنك بكالوريا 2025)',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'limits',
        focus: 'تكملة النهايات بتمارين بنمط بكالوريا حديثة.',
      },
    ],
  },
  {
    id: 'deriv',
    label: 'الاشتقاقية',
    lessons: [
      {
        ytId: 'kNRqWehvOtE',
        title: 'درس الاشتقاقية من الألف إلى الياء — شرح مفصل',
        channel: 'الأستاذ جوفر في الرياضيات',
        level: '3as',
        chapterId: 'func-deriv',
        focus: 'العدد المشتق، الدوال المشتقة، الجدول الكامل — بتدرج بيداغوجي ممتاز.',
      },
      {
        ytId: 'HEgHtpRct-Q',
        title: 'الاشتقاقية من الألف إلى الياء — بكالوريا 2026',
        channel: 'الأستاذ نورالدين',
        level: '3as',
        chapterId: 'func-deriv',
        focus: 'درس محدث بأسئلة بنمط البكالوريا القادمة.',
      },
      {
        ytId: 'Yjkg4_3hQmE',
        title: 'الاشتقاقية وتفسيرها البياني — شرح مبسط',
        channel: 'الأستاذ نورالدين',
        level: '3as',
        chapterId: 'func-deriv',
        focus: 'المماس، الميل، العلاقة بين الاشتقاق ورسم المنحنى.',
      },
      {
        ytId: 'dB40VQYygJE',
        title: 'كل دروس وحدة الاشتقاقية في حصة واحدة',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'func-deriv',
        focus: 'حصة مركزة شاملة لمن يريد مراجعة الوحدة كاملة بسرعة.',
      },
      {
        ytId: 'sHYcTtqjImU',
        title: 'قابلية الاشتقاق — فهم حقيقي لا حفظ',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'func-deriv',
        focus: 'يبني الحدس الصحيح لقابلية الاشتقاق قبل الحفظ التقني.',
      },
    ],
  },
  {
    id: 'exp-log',
    label: 'الأسية واللوغاريتمية',
    lessons: [
      {
        ytId: 'mSLDJiQbD20',
        title: 'الدالة اللوغاريتمية من الألف إلى الياء',
        channel: 'infinity أنفينيتي',
        level: '3as',
        chapterId: 'exp-log',
        focus: 'المجال، الخواص، المعادلات والمتراجحات — درس كامل.',
      },
      {
        ytId: '_n-MY1HL7NY',
        title: 'الدالة اللوغاريتمية وخواصها — شرح شامل',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'exp-log',
        focus: 'بداية مثالية في اللوغاريتمية: من التعريف إلى التطبيقات.',
      },
      {
        ytId: 'ay9ks0Q9kr4',
        title: 'الدالة اللوغاريتمية — مراجعة كاملة',
        channel: 'infinity أنفينيتي',
        level: '3as',
        chapterId: 'exp-log',
        focus: 'مراجعة سريعة مركزة قبل الاختبارات والبكالوريا.',
      },
      {
        ytId: 'X-w3SV14dvg',
        title: 'الدوال الأسية من الصفر — الجزء الأول',
        channel: 'infinity أنفينيتي',
        level: '3as',
        chapterId: 'exp-log',
        focus: 'الأسية الطبيعية: خواصها ومشتقاتها وبناء منحناها.',
      },
      {
        ytId: 'Y1pujFIJydU',
        title: 'الدوال الأسية من الصفر — الجزء الثاني',
        channel: 'infinity أنفينيتي',
        level: '3as',
        chapterId: 'exp-log',
        focus: 'الأسية بأساس a والمعادلات الأسية — تكملة الجزء الأول.',
      },
    ],
  },
  {
    id: 'complex',
    label: 'الأعداد المركبة',
    lessons: [
      {
        ytId: '80_t7XeJoD8',
        title: 'الأعداد المركبة من الألف إلى الياء — الجزء الأول',
        channel: 'الأستاذ محمود',
        level: '3as',
        chapterId: 'complex',
        focus: 'الشكل الجبري والهندسي، العمليات، القيمة المطلقة والمرافق.',
      },
      {
        ytId: '2WTEF-oVUGk',
        title: 'الأعداد المركبة — كل ما تحتاجه للبكالوريا',
        channel: 'الأستاذ نورالدين',
        level: '3as',
        chapterId: 'complex',
        focus: 'الأشكال الثلاثة، التحويلات، تطبيقات البكالوريا المباشرة.',
      },
    ],
  },
  {
    id: 'probability',
    label: 'الاحتمالات',
    lessons: [
      {
        ytId: '41OrXw4KCls',
        title: 'الاحتمالات الشرطية والحوادث المستقلة — أقوى شرح',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'probability',
        focus: 'الاحتمال الشرطي، الاستقلال، البايز — بأمثلة من الحياة اليومية.',
      },
      {
        ytId: 'sMldeeYm5po',
        title: 'الاحتمالات — درس مفصل مع أمثلة تطبيقية',
        channel: 'الأستاذ مرنيز وليد',
        level: '3as',
        chapterId: 'probability',
        focus: 'درس متدرج يناسب من يفتتح هذا المحور لأول مرة.',
      },
      {
        ytId: 'GZ0KsopyJ7Y',
        title: 'شجرة الاحتمالات — تمارين بكالوريا للفهم والمراجعة',
        channel: 'اللّاز في الرياضيات',
        level: '3as',
        chapterId: 'probability',
        focus: 'تدريبات على شجرة الاحتمالات — أكثر نوع يُطرح في البكالوريا.',
      },
      {
        ytId: 'lyPvfyIUaj0',
        title: 'حل تمرين بكالوريا 2025 علوم تجريبية — شجرة واحتمال شرطي',
        channel: 'Prof-Ahmed Trir',
        level: '3as',
        chapterId: 'probability',
        focus: 'حل حي لنمط سؤال بكالوريا حديثة بالطريقة الصحيحة للتصحيح.',
      },
    ],
  },
  {
    id: 'space',
    label: 'الهندسة في الفضاء',
    lessons: [
      {
        ytId: '8QsBOx-BRTM',
        title: 'الهندسة في الفضاء — شرح مفصل للبكالوريا',
        channel: 'Noro Km',
        level: '3as',
        chapterId: 'space',
        focus: 'المتجهات، التمثيلات الوسيطية، التعامد — الجزء الأول مفصلاً.',
      },
      {
        ytId: 'GsBu9lGcCdg',
        title: 'ملخص الهندسة الفضائية — كل الشعب',
        channel: 'الأستاذ بوسيف',
        level: '3as',
        chapterId: 'space',
        focus: 'ملخص مركّز يصلح للمراجعة الليلية قبل الامتحان.',
      },
      {
        ytId: 'GuIgMYy10x0',
        title: 'التمثيل الوسيطي لمستقيم في الفضاء',
        channel: 'الأستاذ بوسيف',
        level: '3as',
        chapterId: 'space',
        focus: 'المهارة الأكثر تكراراً في أسئلة الهندسة الفضائية بالبكالوريا.',
      },
    ],
  },
  {
    id: 'integrals',
    label: 'التكامل',
    lessons: [
      {
        ytId: 'QKrUQ3vGcko',
        title: 'الدوال الأصلية والحساب التكاملي — شرح شامل',
        channel: 'infinity أنفينيتي',
        level: '3as',
        chapterId: 'integrals',
        focus: 'من الدالة الأصلية إلى حساب المساحات — الدرس الكامل.',
      },
      {
        ytId: 'uFIcpI5XLe8',
        title: 'التكامل وخواصه — شرح تفصيلي',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'integrals',
        focus: 'خواص الخطية والمحايد وحساب التكاملات المباشرة.',
      },
      {
        ytId: 'UxGi73L2LH8',
        title: 'التكامل بالتجزئة مع جميع أفكاره',
        channel: 'الأستاذ عبد الباسط',
        level: '3as',
        chapterId: 'integrals',
        focus: 'التقنية المهمة التي تظهر سنوياً في موضوع البكالوريا.',
      },
    ],
  },
];

export const VIDEO_TOTAL = VIDEO_AXES.reduce((n, a) => n + a.lessons.length, 0);
