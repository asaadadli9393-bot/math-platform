#!/usr/bin/env python3
"""إصلاح بنك التمارين: استبدال ".",
بـ `, في نهاية template literals غير المغلقة."""
import sys

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    fixed_lines = []
    in_backtick = False
    fixed_count = 0
    
    for i, line in enumerate(lines):
        if in_backtick and line.rstrip().endswith('",'):
            new_line = line.rstrip()[:-2] + '`,'
            fixed_lines.append(new_line)
            in_backtick = False
            fixed_count += 1
            print(f"  سطر {i+1}: {line.rstrip()[-40:]} -> {new_line[-40:]}")
        else:
            fixed_lines.append(line)
            for ch in line:
                if ch == '`':
                    in_backtick = not in_backtick
    
    new_content = '\n'.join(fixed_lines)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✓ {filepath}: تم إصلاح {fixed_count} سطر")
    else:
        print(f"✓ {filepath}: لا تغييرات")

if __name__ == '__main__':
    for f in sys.argv[1:]:
        print(f"\n=== {f} ===")
        fix_file(f)
