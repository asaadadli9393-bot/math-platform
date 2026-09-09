import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
          <FileQuestion className="w-12 h-12 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-amber-700 dark:text-amber-300">404</h1>
          <h2 className="text-xl font-bold">الصفحة غير موجودة</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-2"><Link href="/"><Home className="w-4 h-4" />العودة للرئيسية</Link></Button>
        </div>
      </div>
    </div>
  );
}
