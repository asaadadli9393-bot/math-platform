# -*- coding: utf-8 -*-
"""رقعة AnimeView: شارة مستوى ديناميكية + قصة مستواك أولاً + نصوص محدثة."""
import io, re

P = '/home/z/my-project/src/components/views/AnimeView.tsx'
s = io.open(P, encoding='utf-8').read()

# 1) خريطة مستويات + ترتيب القصص (قصة مستواك أولاً) + تحديث النص الترويسي
old1 = "import { ANIME_STORIES, ANIME_TEASERS, type AnimeStory } from '@/data/anime-stories';"
new1 = """import { ANIME_STORIES, ANIME_TEASERS, type AnimeStory } from '@/data/anime-stories';

const LEVEL_BADGE: Record<string, string> = {
  '1as': 'السنة الأولى ثانوي',
  '2as': 'السنة الثانية ثانوي',
  '3as': 'السنة الثالثة ثانوي',
  all: 'كل المستويات',
};"""
assert old1 in s
s = s.replace(old1, new1, 1)

# 2) التنبيه: فقط إن لم توجد قصة لمستوى المستخدم
old2 = """      {/* تنبيه المستوى */}
      {year !== '3as' ? ("""
new2 = """      {/* تنبيه المستوى — فقط إن لم توجد قصة لمستواه بعد */}
      {!ANIME_STORIES.some((st) => st.level === year) ? ("""
assert old2 in s
s = s.replace(old2, new2, 1)

old2b = """            القصة الحالية من منهج السنة الثالثة ثانوي — قصص مستواك قيد الإعداد، ويمكنك مشاهدتها
            لتفهم الفكرة قبل أن يأتي درسها."""
new2b = """            قصص مستواك قيد الإعداد حالياً — ويمكنك مشاهدة قصص المستويات الأخرى لتفهم الفكرة قبل
            أن يأتي درسها."""
assert old2b in s
s = s.replace(old2b, new2b, 1)

# 3) النص الترويسي: قصص المستويات
old3 = 'مشوّق، والرياضيات الحقيقية تظهر داخل الحكاية كما ستستعملها في الامتحان. قسم حصري على\n          المنصة — القصة الأولى مجانية للجميع.'
new3 = 'مشوّق، والرياضيات الحقيقية تظهر داخل الحكاية كما ستستعملها في الامتحان. قسم حصري على\n          المنصة — قصة لكل مستوى، مجانية للجميع.'
assert old3 in s
s = s.replace(old3, new3, 1)

# 4) ترتيب القصص: قصة مستوى المستخدم أولاً
old4 = """      {/* القصص المتاحة */}
      {ANIME_STORIES.map((story) => (
        <StoryCard key={story.id} story={story} onPlay={() => setPlayingStory(story)} />
      ))}"""
new4 = """      {/* القصص المتاحة — قصة مستواك أولاً */}
      {[...ANIME_STORIES]
        .sort((a, b) => (a.level === year ? -1 : 0) - (b.level === year ? -1 : 0))
        .map((story) => (
          <StoryCard key={story.id} story={story} onPlay={() => setPlayingStory(story)} />
        ))}"""
assert old4 in s
s = s.replace(old4, new4, 1)

# 5) شارة المستوى في البطاقة
old5 = """          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
            السنة الثالثة ثانوي
          </Badge>"""
new5 = """          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
            {LEVEL_BADGE[story.level] ?? story.level}
          </Badge>"""
assert old5 in s
s = s.replace(old5, new5, 1)

io.open(P, 'w', encoding='utf-8').write(s)
print('OK — AnimeView patched')
