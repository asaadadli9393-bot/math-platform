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
} from "lucide-react";

interface VideoSimulationPlayerProps {
  video: VideoSimulation;
  lessonTitle: string;
}

export function VideoSimulationPlayer({ video, lessonTitle }: VideoSimulationPlayerProps) {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = React.useState(0);
  const [narrationEnabled, setNarrationEnabled] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1);
  const [audioLoading, setAudioLoading] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = React.useRef<Map<string, string>>(new Map());
  const currentSceneRef = React.useRef(0);

  const currentScene = video.scenes[currentSceneIdx];

  // ============================================================
  //  توليد وتشغيل الصوت عبر API السحابي
  // ============================================================

  const generateAndPlayAudio = React.useCallback(
    async (scene: VideoScene, rate: number) => {
      if (!narrationEnabled || !scene.narration) return;

      // تحقق من الكاش
      const cacheKey = `${scene.id}-${rate}`;
      if (audioCacheRef.current.has(cacheKey)) {
        playAudio(audioCacheRef.current.get(cacheKey)!, rate);
        return;
      }

      setAudioLoading(true);
      setAudioError(false);

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: scene.narration, speed: rate }),
        });

        if (!response.ok) throw new Error("TTS failed");

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);

        // حفظ في الكاش
        audioCacheRef.current.set(cacheKey, audioUrl);

        // تشغيل
        playAudio(audioUrl, rate);
      } catch (err) {
        console.error("TTS Error:", err);
        setAudioError(true);
      } finally {
        setAudioLoading(false);
      }
    },
    [narrationEnabled]
  );

  const playAudio = (url: string, rate: number) => {
    // إيقاف الصوت السابق
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // إنشاء عنصر صوتي جديد
    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.volume = 1;
    audioRef.current = audio;
    audio.play().catch((e) => console.error("Audio play error:", e));
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // تشغيل السرد عند تغير المشهد
  React.useEffect(() => {
    currentSceneRef.current = currentSceneIdx;
    if (narrationEnabled && currentScene?.narration) {
      generateAndPlayAudio(currentScene, playbackRate);
    }
  }, [currentSceneIdx, narrationEnabled, currentScene, playbackRate, generateAndPlayAudio]);

  // التشغيل التلقائي للفيديو
  React.useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= video.duration) {
            setIsPlaying(false);
            stopAudio();
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
  }, [isPlaying, video.duration, playbackRate]);

  // تنظيف عند الخروج
  React.useEffect(() => {
    return () => {
      stopAudio();
      // تنظيف الكاش
      audioCacheRef.current.forEach((url) => URL.revokeObjectURL(url));
      audioCacheRef.current.clear();
    };
  }, []);

  // ============================================================
  //  أدوات التحكم
  // ============================================================

  const handlePlayPause = () => {
    if (currentTime >= video.duration) {
      setCurrentTime(0);
      setCurrentSceneIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    stopAudio();
    if (currentSceneIdx < video.scenes.length - 1) {
      const next = video.scenes[currentSceneIdx + 1];
      setCurrentTime(next.timeStart);
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const handleSkipBack = () => {
    stopAudio();
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
    stopAudio();
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSceneIdx(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    stopAudio();
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
      stopAudio();
    } else if (currentScene?.narration) {
      generateAndPlayAudio(currentScene, playbackRate);
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
              شرح تفاعلي متحرك خطوة بخطوة مع سرد صوتي
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${difficultyColors[video.difficulty]} border`}>
              {difficultyLabels[video.difficulty]}
            </Badge>
            {narrationEnabled && (
              <Badge className="bg-emerald-500 text-white">
                <Mic className="w-3 h-3 ml-1" />
                سرد صوتي
              </Badge>
            )}
            {audioLoading && (
              <Badge className="bg-amber-500 text-white">
                <Loader2 className="w-3 h-3 ml-1 animate-spin" />
                تحميل الصوت...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {/* منطقة العرض */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 min-h-[320px]">
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <Badge variant="ghost" className="bg-white/10 text-white border-white/20">
            <Clock className="w-3 h-3 ml-1" />
            {formatTime(currentTime)} / {formatTime(video.duration)}
          </Badge>
          <Badge variant="ghost" className="bg-white/10 text-white border-white/20">
            مشهد {currentSceneIdx + 1} / {video.scenes.length}
          </Badge>
        </div>

        <Button
          variant="ghost"
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

        {/* النص المسموع */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md text-sm max-w-md text-center">
          {currentScene.narration}
        </div>
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

          {/* زر السرد الصوتي */}
          <Button
            variant={narrationEnabled ? "default" : "outline"}
            size="icon"
            onClick={toggleNarration}
            title={narrationEnabled ? "إيقاف السرد الصوتي" : "تشغيل السرد الصوتي"}
            className={narrationEnabled ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            {narrationEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <Button variant="ghost" size="icon" title="النص مرئي دائماً">
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
                if (narrationEnabled && currentScene?.narration) {
                  generateAndPlayAudio(currentScene, rate);
                }
              }}
            >
              {rate}x
            </Button>
          ))}
        </div>

        {/* حالة الصوت */}
        {audioError && (
          <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
            <MicOff className="w-3 h-3" />
            تعذّر توليد الصوت. النص المسموع مرئي في الأسفل.
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
                  stopAudio();
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
