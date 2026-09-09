import * as React from "react";
import { RefreshCw } from "lucide-react";

export default function Loading() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-primary">منصة الرياضيات</h2>
          <p className="text-sm text-muted-foreground">جارٍ تحميل المحتوى... يرجى الانتظار</p>
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
}
