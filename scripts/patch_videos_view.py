# -*- coding: utf-8 -*-
"""رقعة VideosView: مرشح المستوى + إزالة التنبيه القديم + حالة فارغة."""
import io, re, sys

P = '/home/z/my-project/src/components/views/VideosView.tsx'
s = io.open(P, encoding='utf-8').read()
orig = s

# 1) إضافة حالة المستوى + مزامنة + فلترة المحاور
old1 = """export default function VideosView({ year, onOpenBank }: { year: string; onOpenBank?: () => void }) {
  const [axisId, setAxisId] = React.useState<string>('all');
  const [playing, setPlaying] = React.useState<string | null>(null);

  const axes = React.useMemo(
    () => VIDEO_AXES.filter((a) => axisId === 'all' || a.id === axisId),
    [axisId]
  );
"""
new1 = """const LEVEL_LABELS: Record<string, string> = {
  '1as': 'الأولى ثانوي',
  '2as': 'الثانية ثانوي',
  '3as': 'الثالثة ثانوي',
};

export default function VideosView({ year, onOpenBank }: { year: string; onOpenBank?: () => void }) {
  const [axisId, setAxisId] = React.useState<string>('all');
  const [level, setLevel] = React.useState<string>(year);
  const [playing, setPlaying] = React.useState<string | null>(null);

  // مزامنة المستوى مع سنة المستخدم عند تغييرها من الترويسة
  React.useEffect(() => {
    setLevel(year);
  }, [year]);

  const axes = React.useMemo(
    () =>
      VIDEO_AXES.filter(
        (a) =>
          (axisId === 'all' || a.id === axisId) &&
          (level === 'all' || a.lessons.some((l) => l.level === level))
      ),
    [axisId, level]
  );

  const levelCount = React.useMemo(() => {
    const acc: Record<string, number> = {};
    VIDEO_AXES.forEach((a) => a.lessons.forEach((l) => { acc[l.level] = (acc[l.level] ?? 0) + 1; }));
    return acc;
  }, []);
"""
assert old1 in s, 'block1 not found'
s = s.replace(old1, new1)

# 2) حذف التنبيه القديم (بمواءمة الأقواس المتعددة الأسطر)
pat2 = re.compile(
    r"\s*\{/\* ملاحظة المستوى \*/\}.*?\{year === '1as' \|\| year === '2as' \? \(.*?\) : null\}\n",
    re.S,
)
m2 = pat2.search(s)
assert m2, 'old level notice not found'
s = s[: m2.start()] + '\n' + s[m2.end():]

# 3) إدراج مرشح المستوى قبل ملاحظة الحقوق
anchor = '{/* ملاحظة الحقوق */}'
assert anchor in s, 'rights notice anchor not found'
lvl_ui = """{/* مرشح المستوى */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <FilterChip active={level === year} onClick={() => setLevel(year)}>
          مستواي ({LEVEL_LABELS[year] ?? year})
        </FilterChip>
        {(['1as', '2as', '3as'] as const)
          .filter((lv) => levelCount[lv])
          .map((lv) => (
            <FilterChip key={lv} active={level === lv} onClick={() => setLevel(lv)}>
              {LEVEL_LABELS[lv]}
              <span className="mr-1 opacity-60">{levelCount[lv]}</span>
            </FilterChip>
          ))}
        <FilterChip active={level === 'all'} onClick={() => setLevel('all')}>
          الكل
          <span className="mr-1 opacity-60">{VIDEO_TOTAL}</span>
        </FilterChip>
      </div>

      """
s = s.replace(anchor, lvl_ui + anchor, 1)

# 4) مرشح المحاور يقتصر على محاور المستوى المختار
old4 = """        {VIDEO_AXES.map((a) => (
          <FilterChip key={a.id} active={axisId === a.id} onClick={() => setAxisId(a.id)}>
            {a.label}
            <span className="mr-1 opacity-60">{a.lessons.length}</span>
          </FilterChip>
        ))}"""
new4 = """        {VIDEO_AXES.filter((a) => level === 'all' || a.lessons.some((l) => l.level === level)).map((a) => (
          <FilterChip key={a.id} active={axisId === a.id} onClick={() => setAxisId(a.id)}>
            {a.label}
            <span className="mr-1 opacity-60">
              {a.lessons.filter((l) => level === 'all' || l.level === level).length}
            </span>
          </FilterChip>
        ))}"""
assert old4 in s, 'axis chips not found'
s = s.replace(old4, new4)

# 5) حالة فارغة + فلترة الدروس بالمستوى داخل كل محور
old5 = """      {/* الدروس حسب المحور */}
      {axes.map((axis) => ("""
new5 = """      {/* الدروس حسب المحور */}
      {axes.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-10 text-sm font-bold text-stone-400">
            <Info className="h-4 w-4" />
            لا دروس لهذا المستوى بعد — تُضاف دروس جديدة باستمرار.
          </CardContent>
        </Card>
      ) : null}
      {axes.map((axis) => ("""
assert old5 in s, 'lessons map not found'
s = s.replace(old5, new5)

old6 = """            {axis.lessons.map((v) => {"""
new6 = """            {axis.lessons
              .filter((v) => level === 'all' || v.level === level)
              .map((v) => {"""
assert old6 in s, 'lessons inner map not found'
s = s.replace(old6, new6)

io.open(P, 'w', encoding='utf-8').write(s)
print('OK — VideosView patched,', len(s) - len(orig), 'chars delta')
