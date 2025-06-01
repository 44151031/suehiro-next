// ✅ /src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LayoutShell from "@/components/layout/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PayPay・auPay・楽天Pay・d払いキャンペーン体験 - Payキャン",
    template: "%s - Payキャン", // ✅ ページごとのタイトルに対応
  },
  description:
    "全国のPayPay・auPay・楽天Pay・d払いキャンペーンをまとめて紹介。各地域で獲得出来る総額もわかるから、効率よくポイントを獲得出来ます。",
  openGraph: {
    title: "PayPay・auPay・楽天Pay・d払いキャンペーン体験 - Payキャン",
    description:
      "全国のPayPay・auPay・楽天Pay・d払いキャンペーンをまとめて紹介。各地域で獲得出来る総額もわかるから、効率よくポイントを獲得出来ます。",
    url: "https://paycancampaign.com",
    siteName: "Payキャン",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PayPay・auPay・楽天Pay・d払いキャンペーン体験 - Payキャン",
    description:
      "全国のPayPay・auPay・楽天Pay・d払いキャンペーンをまとめて紹介。各地域で獲得出来る総額もわかるから、効率よくポイントを獲得出来ます。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <LayoutShell>{children}</LayoutShell>
        <Footer />
      </body>
    </html>
  );
}
