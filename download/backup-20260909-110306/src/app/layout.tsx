import type { Metadata } from "next";
import { Amiri, Amiri_Quran } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const amiriQuran = Amiri_Quran({
  variable: "--font-amiri-quran",
  subsets: ["arabic"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة الرياضيات | الأستاذ عدلي أسعد — السنة الثالثة ثانوي",
  description:
    "منصة تعليمية تفاعلية لرياضيات السنة الثالثة ثانوي (الشعب العلمية) في الجزائر — متوافقة كلياً مع المنهاج الرسمي لوزارة التربية الوطنية. إشراف بيداغوجي: الأستاذ عدلي أسعد.",
  keywords: [
    "رياضيات",
    "السنة الثالثة ثانوي",
    "البكالوريا",
    "الجزائر",
    "عدلي أسعد",
    "علوم تجريبية",
    "رياضيات",
    "تقني رياضي",
    "المنهاج الرسمي",
    "التعليم التفاعلي",
  ],
  authors: [{ name: "الأستاذ عدلي أسعد" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "منصة الرياضيات | الأستاذ عدلي أسعد",
    description: "تعلم رياضيات السنة الثالثة ثانوي من الصفر إلى البكالوريا",
    type: "website",
    locale: "ar_DZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${amiri.variable} ${amiriQuran.variable} font-amiri antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
