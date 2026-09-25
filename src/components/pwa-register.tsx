'use client';

/**
 * تسجيل Service Worker + زر «تثبيت التطبيق» (PWA)
 * يظهر الزر فقط عندما يدعم المتصفح التثبيت المباشر (Android/Chrome/Edge)
 */

import React, { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWARegister() {
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // تسجيل عامل الخدمة
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // التقاط حدث التثبيت
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!installEvt || hidden) return null;

  const install = async () => {
    try {
      await installEvt.prompt();
      await installEvt.userChoice;
      setInstallEvt(null);
    } catch {
      setHidden(true);
    }
  };

  return (
    <button
      onClick={install}
      className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-700 to-teal-700 px-4 py-2.5 text-xs font-black text-white shadow-xl shadow-emerald-900/30 ring-1 ring-white/20 transition hover:scale-105 hover:from-emerald-800 hover:to-teal-800 sm:text-sm"
      title="ثبّت المنصة كتطبيق على هاتفك — تعمل دون اتصال بعد التثبيت"
    >
      <Smartphone className="h-4 w-4" />
      ثبّت التطبيق على هاتفك
      <Download className="h-4 w-4" />
    </button>
  );
}
