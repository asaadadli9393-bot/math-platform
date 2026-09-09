"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarkdownMath } from "@/components/math-renderer";
import type { VideoSimulation, VideoScene } from "@/data/curriculum";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Clock,
  Gauge,
  Mic,
  MicOff,
  Loader2,
  Eye,
  Type,
} from "lucide-react";

interface VideoSimulationPlayerProps {
  video: VideoSimulation;
  lessonTitle: string;
}

// ============================================================
//  hook للسرد الصوتي العربي (Web Speech API + بحث مكثف)
// ============================================================

function useArabicSpeech() {
  const [supported, setSupported] = React.useState(false);
  const [arabicVoice, setArabicVoice] = React.useState<SpeechSynthesisVoice | null>(null);
  const [speaking, setSpeaking] = React.useState(false);
  const [searching, setSearching] = React.useState(true);
  const [allVoices, setAllVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSearching(false);
      return;
    }

    setSupported(true);

    const findArabicVoice = (voices: SpeechSynthesisVoice[]) => {
      // البحث بأولوية: العربية السعودية > المصرية > الإماراتية > أي عربية
      const priorities = ["ar-SA", "ar-EG", "ar-AE", "ar", "Arabic"];
      for (const p of priorities) {
        const v = voices.find(
          (v) => v.lang.startsWith(p) || v.name.includes("Arabic") || v.name.includes("العربية")
        );
        if (v) return v;
      }
      // البحث بأي لغة تحتوي "ar"
      return voices.find((v) => v.lang.toLowerCase().startsWith("ar")) || null;
    };

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return; // سيتوقف البحث بعد 5 ثوانٍ

      setAllVoices(voices);
      const ar = findArabicVoice(voices);
      setArabicVoice(ar);
      setSearching(false);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // إعادة المحاولة (بعض المتصفحات تأخذ وقتاً لتحميل الأصوات)
    const retryInterval = setInterval(() => {
      if (!arabicVoice) loadVoices();
    }, 500);

    // إيقاف البحث بعد 5 ثوانٍ مهما كانت النتيجة
    const stopSearchTimeout = setTimeout(() => {
      clearInterval(retryInterval);
      setSearching(false);
      // إذا لم نجد أصواتاً أصلاً، نضع supported = false
      if (window.speechSynthesis.getVoices().length === 0) {
        setSupported(false);
      }
    }, 5000);

    return () => {
      clearInterval(retryInterval);
      clearTimeout(stopSearchTimeout);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = React.useCallback(
    (text: string, options?: { rate?: number; voice?: SpeechSynthesisVoice }) => {
      if (!supported || !text) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";

      const voice = options?.voice || arabicVoice;
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = options?.rate ?? 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [supported, arabicVoice]
  );

  const stop = React.useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const pause = React.useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
  }, [supported]);

  const resume = React.useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
  }, [supported]);

  return { supported, arabicVoice, speaking, searching, allVoices, speak, stop, pause, resume };
}

// ============================================================
//  مكوّن الفيديو المحاكاة
// ============================================================

export function VideoSimulationPlayer({ video, lessonTitle }: VideoSimulationPlayerProps) {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = React.useState(0);
  const [narrationEnabled, setNarrationEnabled] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const speech = useArabicSpeech();
  const currentScene = video.scenes[currentSceneIdx];

  // هل يوجد صوت عربي متاح؟
  const hasArabicAudio = speech.supported && !!speech.arabicVoice;

  // وضع "السرد المرئي" إذا لم يوجد صوت عربي
  const visualNarrationMode = narrationEnabled && !hasArabicAudio;

  // تشغيل السرد الصوتي عند تغير المشهد
  React.useEffect(() => {
    if (narrationEnabled && hasArabicAudio && currentScene?.narration) {
      speech.speak(currentScene.narration, { rate: playbackRate });
    }
  }, [currentSceneIdx, narrationEnabled, hasArabicAudio, currentScene, playbackRate, speech]);

  // التشغيل التلقائي للفيديو
  React.useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= video.duration) {
            setIsPlaying(false);
            speech.stop();
            return video.duration;
          }
          return t + 0.1 * playbackRate;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, video.duration, playbackRate, speech]);

  // تنظيف عند الخروج
  React.useEffect(() => {
    return () => {
      speech.stop();
    };
  }, [speech]);

  // ============================================================
  //  أدوات التحكم
  // ============================================================

  const handlePlayPause = () => {
    if (currentTime >= video.duration) {
      setCurrentTime(0);
      setCurrentSceneIdx(0);
    }
    if (isPlaying) {
      speech.pause();
    } else {
      speech.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    speech.stop();
    if (currentSceneIdx < video.scenes.length - 1) {
      const next = video.scenes[currentSceneIdx + 1];
      setCurrentTime(next.timeStart);
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const handleSkipBack = () => {
    speech.stop();
    if (currentSceneIdx > 0) {
      const prev = video.scenes[currentSceneIdx - 1];
      setCurrentTime(prev.timeStart);
      setCurrentSceneIdx(currentSceneIdx - 1);
    } else {
      setCurrentTime(0);
      setCurrentSceneIdx(0);
    }
  };

  const handleReset = () => {
    speech.stop();
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSceneIdx(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    speech.stop();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    setIsPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleNarration = () => {
    if (narrationEnabled) {
      speech.stop();
    } else if (hasArabicAudio && currentScene?.narration) {
      speech.speak(currentScene.narration, { rate: playbackRate });
    }
    setNarrationEnabled(!narrationEnabled);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const difficultyColors: Record<VideoSimulation["difficulty"], string> = {
    easy: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-amber-100 text-amber-800 border-amber-300",
    hard: "bg-red-100 text-red-800 border-red-300",
  };

  const difficultyLabels: Record<VideoSimulation["difficulty"], string> = {
    easy: "سهل",
    medium: "متوسط",
    hard: "صعب",
  };

  return (
    <Card ref={containerRef} className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-l from-primary to-accent text-primary-foreground">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              فيديو محاكاة — {lessonTitle}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">
              شرح تفاعلي متحرك خطوة بخطوة
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${difficultyColors[video.difficulty]} border`}>
              {difficultyLabels[video.difficulty]}
            </Badge>
            {narrationEnabled && hasArabicAudio && (
              <Badge className="bg-emerald-500 text-white">
                <Mic className="w-3 h-3 ml-1" />
                سرد صوتي عربي
              </Badge>
            )}
            {narrationEnabled && visualNarrationMode && (
              <Badge className="bg-blue-500 text-white">
                <Type className="w-3 h-3 ml-1" />
                سرد مرئي
              </Badge>
            )}
            {speech.speaking && (
              <Badge className="bg-amber-500 text-white animate-pulse">
                <Mic className="w-3 h-3 ml-1" />
                ينطق...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {/* منطقة العرض */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 min-h-[320px]">
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            <Clock className="w-3 h-3 ml-1" />
            {formatTime(currentTime)} / {formatTime(video.duration)}
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            مشهد {currentSceneIdx + 1} / {video.scenes.length}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute top-3 left-3 bg-white/10 text-white hover:bg-white/20 z-10"
          onClick={toggleFullscreen}
          title="ملء الشاشة"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        {/* المشهد الحالي */}
        <div
          key={currentScene.id}
          className="mt-8"
          style={{
            animation: currentScene.animation
              ? `${getAnimationName(currentScene.animation)} 0.6s ease-out`
              : "fadeIn 0.6s ease-out",
          }}
        >
          <h3 className="text-2xl font-bold mb-4 text-amber-300">
            {currentScene.title}
          </h3>
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4 max-h-72 overflow-y-auto">
            <div className="text-white" dir="rtl">
              <MarkdownMath content={currentScene.content} />
            </div>
          </div>
          {currentScene.highlight && (
            <div className="bg-amber-500/20 border-r-4 border-amber-400 rounded-md p-3 mt-3">
              <span className="text-amber-200 font-bold">💡 القاعدة الذهبية: </span>
              <span className="text-white">
                <MarkdownMath content={currentScene.highlight} />
              </span>
            </div>
          )}
        </div>

        {/* السرد — مرئي أو صوتي */}
        {narrationEnabled && currentScene.narration && (
          <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-sm max-w-md text-center ${
            visualNarrationMode
              ? "bg-blue-600/80 text-white border border-blue-300"
              : "bg-black/70 text-white"
          }`}>
            {visualNarrationMode && (
              <div className="flex items-center justify-center gap-1 mb-1 text-xs text-blue-200">
                <Eye className="w-3 h-3" />
                السرد المرئي
              </div>
            )}
            {currentScene.narration}
          </div>
        )}
      </div>

      {/* أدوات التحكم */}
      <CardContent className="pt-4 space-y-3 bg-muted/30">
        {/* شريط التقدم */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={video.duration}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to left, var(--primary) ${(currentTime / video.duration) * 100}%, var(--muted) ${(currentTime / video.duration) * 100}%)`,
            }}
          />
          <span className="text-xs font-mono">{formatTime(video.duration)}</span>
        </div>

        {/* الأزرار */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Button variant="outline" size="icon" onClick={handleReset} title="إعادة">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSkipBack} title="المشهد السابق">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            size="default"
            onClick={handlePlayPause}
            className="gap-2 bg-primary hover:bg-primary/90"
            title={isPlaying ? "إيقاف" : "تشغيل"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> إيقاف
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> تشغيل
              </>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleSkipForward} title="المشهد التالي">
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* زر السرد */}
          <Button
            variant={narrationEnabled ? "default" : "outline"}
            size="icon"
            onClick={toggleNarration}
            title={narrationEnabled ? "إيقاف السرد" : "تشغيل السرد"}
            className={narrationEnabled ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {narrationEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="icon" title="النص مرئي">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>

        {/* سرعة التشغيل */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-bold ml-1">سرعة السرد:</span>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <Button
              key={rate}
              size="sm"
              variant={playbackRate === rate ? "default" : "outline"}
              className="h-7 px-2 text-xs"
              onClick={() => {
                setPlaybackRate(rate);
                if (narrationEnabled && hasArabicAudio && currentScene?.narration) {
                  speech.speak(currentScene.narration, { rate });
                }
              }}
            >
              {rate}x
            </Button>
          ))}
        </div>

        {/* معلومات عن الصوت */}
        {narrationEnabled && speech.searching && (
          <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
            <Loader2 className="w-3 h-3 animate-spin" />
            جارٍ البحث عن صوت عربي على جهازك...
          </div>
        )}
        {narrationEnabled && !speech.searching && !hasArabicAudio && speech.supported && (
          <div className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
            <Type className="w-3 h-3" />
            لا يوجد صوت عربي على جهازك. تم تفعيل <strong>السرد المرئي</strong> تلقائياً —
            النص يظهر بوضوح في الأسفل. لتشغيل الصوت، ثبّت صوتاً عربياً من إعدادات جهازك.
          </div>
        )}
        {narrationEnabled && !speech.supported && (
          <div className="text-xs text-muted-foreground flex items-center gap-1 bg-muted p-2 rounded">
            <MicOff className="w-3 h-3" />
            متصفحك لا يدعم السرد الصوتي. النص يظهر في الأسفل كافٍ للفهم.
          </div>
        )}
        {narrationEnabled && hasArabicAudio && speech.arabicVoice && (
          <div className="text-xs text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded">
            <Mic className="w-3 h-3" />
            صوت عربي متاح: {speech.arabicVoice.name} ({speech.arabicVoice.lang})
          </div>
        )}

        {/* قائمة المشاهد */}
        <div className="space-y-2 pt-2">
          <div className="text-sm font-bold mb-2">📋 قائمة المشاهد:</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {video.scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
                  speech.stop();
                  setCurrentTime(scene.timeStart);
                  setCurrentSceneIdx(idx);
                  setIsPlaying(false);
                }}
                className={`text-right p-2 rounded-md border text-xs transition-all ${
                  idx === currentSceneIdx
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary/50"
                }`}
              >
                <div className="font-bold mb-1">
                  {idx + 1}. {scene.title}
                </div>
                <div className="text-xs opacity-70 font-mono">{formatTime(scene.timeStart)}</div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getAnimationName(anim: string): string {
  const map: Record<string, string> = {
    fade: "fadeIn",
    slide: "slideIn",
    zoom: "zoomIn",
    highlight: "highlightIn",
    draw: "drawIn",
  };
  return map[anim] || "fadeIn";
}
