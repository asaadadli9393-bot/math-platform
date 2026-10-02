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

    // الشفاء الذاتي بعد كل نشر جديد: إذا فشل تحميل وحدة (chunk) من نسخة قديمة
    // مخزّنة مؤقتاً نمسح التخزين المؤقت القديم ونعيد التحميل مرة واحدة فقط —
    // يمنع ظهور صفحات مكسورة أو أزرار لا تستجيب لدى الزوار القدامى
    const purgeAndReload = () => {
      try {
        if (sessionStorage.getItem('tadaruj-chunk-recovery')) return;
        sessionStorage.setItem('tadaruj-chunk-recovery', '1');
      } catch {
        // تجاهل
      }
      const purgeThenReload = () => {
        if ('caches' in window) {
          caches
            .keys()
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .then(() => window.location.reload())
            .catch(() => window.location.reload());
        } else {
          window.location.reload();
        }
      };
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => {
            regs.forEach((r) => r.unregister());
            purgeThenReload();
          })
          .catch(purgeThenReload);
      } else {
        purgeThenReload();
      }
    };

    const isChunkError = (msg: string) =>
      /ChunkLoadError|Loading chunk|Failed to load chunk|error loading dynamically imported module/i.test(msg);

    const onError = (e: ErrorEvent) => {
      if (isChunkError(e.message ?? '')) purgeAndReload();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const msg = typeof reason === 'string' ? reason : (reason?.message ?? String(reason ?? ''));
      if (isChunkError(msg)) purgeAndReload();
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    // التقاط حدث التثبيت
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('beforeinstallprompt', onPrompt);
    };
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
