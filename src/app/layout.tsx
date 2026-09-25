import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://math-adli.vercel.app"),
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
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    url: "https://math-adli.vercel.app",
    siteName: "منصة تدرّج للرياضيات",
    title: "منصة تدرّج للرياضيات 🌟 تحت إشراف الأستاذ عدلي اسعد",
    description:
      "دروس وملخصات • بنك 1207 تمرين بحلول نموذجية مفصلة • 175 سلسلة PDF • 17 ورقة تفاعلية + 182 ورقة أرشيف حقيقية عبر 16 موسماً • تجميعيات البكالوريا 2008–2026 — كل الشعب: 1AS / 2AS / 3AS.",
    images: [
      {
        url: "/og-treasure-2026.jpg",
        width: 1200,
        height: 630,
        alt: "منصة تدرّج للرياضيات — تحت إشراف الأستاذ عدلي اسعد",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "منصة تدرّج للرياضيات 🌟 تحت إشراف الأستاذ عدلي اسعد",
    description:
      "بنك 1207 تمرين بحلول نموذجية • 175 سلسلة PDF • 199 ورقة فرض واختبار • تجميعيات البكالوريا — كل الشعب.",
    images: ["/og-treasure-2026.jpg"],
  },
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
