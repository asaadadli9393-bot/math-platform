#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""استخراج النتائج (videoId + title + channel) من صفحة نتائج بحث يوتيوب المحفوظة."""
import json, re, sys

def extract(path):
    html = open(path, encoding="utf-8", errors="ignore").read()
    m = re.search(r'var ytInitialData = (\{.*?\});</script>', html, re.S)
    if not m:
        m = re.search(r'window\["ytInitialData"\] = (\{.*?\});', html, re.S)
    if not m:
        print(f"!! ytInitialData غير موجود في {path}")
        return []
    data = json.loads(m.group(1))
    out, seen = [], set()

    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                vid = v.get("videoId", "")
                if vid and vid not in seen:
                    seen.add(vid)
                    title = "".join(r.get("text", "") for r in v.get("title", {}).get("runs", []))
                    owner = "".join(r.get("text", "") for r in v.get("ownerText", {}).get("runs", []))
                    views = v.get("viewCountText", {}).get("simpleText", "")
                    length = v.get("lengthText", {}).get("simpleText", "")
                    out.append(dict(id=vid, title=title, channel=owner, views=views, length=length))
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(data)
    return out

if __name__ == "__main__":
    for path in sys.argv[1:]:
        print(f"=== {path} ===")
        for i, r in enumerate(extract(path)[:25]):
            print(f"{i+1}. [{r['id']}] ({r['length']}) {r['title']} — قناة: {r['channel']} — {r['views']}")
