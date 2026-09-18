import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "تدرّج | منصة الرياضيات للثانوي — تحت إشراف الأستاذ عدلي اسعد",
  description:
    "منصة احترافية شاملة للسنوات الأولى والثانية والثالثة ثانوي: بنك تمارين بحلول نموذجية، ملخصات وصيغ، وتدرج رسمي متوافق مع وثيقة 2022-2023 لمادة الرياضيات — جميع الشعب — تحت إشراف الأستاذ عدلي اسعد.",
  keywords: [
    "رياضيات",
    "بكالوريا",
    "اولى ثانوي",
    "ثانية ثانوي",
    "ثالثة ثانوي",
    "تدرج 2022",
    "بنك التمارين",
    "الجزائر",
    "عدلي اسعد",
  ],
  authors: [{ name: "الأستاذ عدلي اسعد" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
