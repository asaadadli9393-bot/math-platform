"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  React.useEffect(() => { console.error("Application error:", error); }, [error]);
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-300">⚠️ حدث خطأ غير متوقّع</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">نعتذر عن هذا الإزعاج. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.</p>
        </div>
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="rounded-md border border-red-500/30 bg-red-50 dark:bg-red-950/30 p-3 text-xs text-red-700 dark:text-red-300 text-left" dir="ltr">
            <strong>Error:</strong> {error.message}
            {error.digest && <div className="mt-1 opacity-70">Digest: {error.digest}</div>}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="gap-2"><RefreshCw className="w-4 h-4" />إعادة المحاولة</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")} className="gap-2"><Home className="w-4 h-4" />العودة للرئيسية</Button>
        </div>
      </div>
    </div>
  );
}
