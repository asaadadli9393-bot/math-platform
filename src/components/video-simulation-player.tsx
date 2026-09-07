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
  Sparkles,
  Clock,
} from "lucide-react";

interface VideoSimulationPlayerProps {
  video: VideoSimulation;
  lessonTitle: string;
}

export function VideoSimulationPlayer({ video, lessonTitle }: VideoSimulationPlayerProps) {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // المشهد الحالي
  const currentScene = video.scenes[currentSceneIdx];

  // تحديث المشهد الحالي عند تغير الوقت
  React.useEffect(() => {
    let idx = 0;
    for (let i = 0; i < video.scenes.length; i++) {
      if (video.scenes[i].timeStart <= currentTime) {
        idx = i;
      } else {
        break;
      }
    }
    if (idx !== currentSceneIdx) {
      setCurrentSceneIdx(idx);
    }
  }, [currentTime, video.scenes, currentSceneIdx]);

  // التشغيل التلقائي
  React.useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= video.duration) {
            setIsPlaying(false);
            return video.duration;
          }
          return t + 0.1;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, video.duration]);

  const handlePlayPause = () => {
    if (currentTime >= video.duration) {
      setCurrentTime(0);
      setCurrentSceneIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (currentSceneIdx < video.scenes.length - 1) {
      const next = video.scenes[currentSceneIdx + 1];
      setCurrentTime(next.timeStart);
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const handleSkipBack = () => {
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
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSceneIdx(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    setIsPlaying(false);
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
    <Card className="overflow-hidden border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-l from-primary to-accent text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              فيديو محاكاة — {lessonTitle}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80 mt-1">
              شرح تفاعلي متحرك خطوة بخطوة
            </CardDescription>
          </div>
          <Badge className={`${difficultyColors[video.difficulty]} border`}>
            {difficultyLabels[video.difficulty]}
          </Badge>
        </div>
      </CardHeader>

      {/* منطقة العرض */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 min-h-[300px]">
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge variant="ghost" className="bg-white/10 text-white border-white/20">
            <Clock className="w-3 h-3 ml-1" />
            {formatTime(currentTime)} / {formatTime(video.duration)}
          </Badge>
          <Badge variant="ghost" className="bg-white/10 text-white border-white/20">
            مشهد {currentSceneIdx + 1} / {video.scenes.length}
          </Badge>
        </div>

        {/* المشهد الحالي */}
        <div
          key={currentScene.id}
          className="mt-8 animate-fadeIn"
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

        {/* النص المسموع (subtitle) */}
        {isMuted && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md text-sm max-w-md text-center">
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
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-primary/30 accent-primary"
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "إظهار النص" : "إخفاء النص"}
          >
            {isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* قائمة المشاهد */}
        <div className="space-y-2 pt-2">
          <div className="text-sm font-bold mb-2">📋 قائمة المشاهد:</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {video.scenes.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => {
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
