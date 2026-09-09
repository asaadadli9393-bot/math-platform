"use client";
import * as React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  React.useEffect(() => { console.error("Global error:", error); }, [error]);
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, 'Segoe UI', Tahoma, sans-serif", background: "linear-gradient(135deg, #fef2f2, #fff7ed)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: "480px", padding: "32px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", margin: "0 auto 16px", borderRadius: "50%", backgroundColor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertOctagon size={40} color="#dc2626" />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#dc2626", margin: "0 0 8px" }}>⚠️ خطأ حرج في المنصة</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6, margin: "0 0 24px" }}>نعتذر بشدة. حدث خطأ غير متوقّع. يمكنك المحاولة مرة أخرى.</p>
          <button onClick={reset} style={{ backgroundColor: "#A4133C", color: "white", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <RefreshCw size={16} />إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
