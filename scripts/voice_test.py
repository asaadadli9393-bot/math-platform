#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""اختبار سريع لأصوات التمثيل في حلقات v2"""
import asyncio, os, subprocess

OUT = "/home/z/my-project/assets/pro_v2/voice_test"
os.makedirs(OUT, exist_ok=True)

CAST = {
    "narr": "ar-DZ-IsmaelNeural",
    "salim": "ar-SA-HamedNeural",
    "layan": "ar-EG-SalmaNeural",
    "porter": "ar-AE-HamdanNeural",
    "sage": "ar-IQ-BasselNeural",
}
LINES = {
    "narr": "في ليلةٍ بلا نهاية، وقف فندقٌ لا تشبهه الفنادق… فندق هيلبرت.",
    "salim": "ممتلئ؟ إذن لا مكان لنا الليلة… الرفض واضح!",
    "layan": "انتظر يا سليم… لم يقل إنه لا يوجد مكان — بل إن هناك دائماً مكاناً!",
    "porter": "أهلاً بكما في فندق هيلبرت. غرفُنا لا نهائية… وفندقُنا ممتلئٌ تماماً.",
    "sage": "اللانهاية ليست عدداً تصل إليه — بل اتجاهاً تسير نحوه.",
}

async def main():
    import edge_tts
    for role, voice in CAST.items():
        out = f"{OUT}/{role}.mp3"
        com = edge_tts.Communicate(LINES[role], voice, rate="-4%" if role in ("narr", "porter", "sage") else "+2%")
        await com.save(out)
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", out], capture_output=True, text=True)
        print(f"  {role:7s} {voice:24s} {float(r.stdout.strip()):5.2f}s OK")

asyncio.run(main())
print("voice_test DONE")
