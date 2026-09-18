import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "تدرج | منصة الرياضيات للسنة الثالثة ثانوي",
  description:
    "منصة احترافية لبنك تمارين شامل بالحلول النموذجية، متوافقة مع التدرج السنوي الرسمي 2022-2023 لمادة الرياضيات — السنة الثالثة ثانوي (علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد، آداب).",
  keywords: [
    "رياضيات",
    "بكالوريا",
    "السنة الثالثة ثانوي",
    "تدرج 2022",
    "بنك التمارين",
    "الجزائر",
  ],
  authors: [{ name: "منصة تدرج" }],
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
