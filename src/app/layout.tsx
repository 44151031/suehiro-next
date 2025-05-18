import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ 共通メタ情報設定（SEO・OGP対応）
export const metadata: Metadata = {
  title: "全国PayPay自治体キャンペーン情報サイト",
  description: "全国のPayPay自治体キャンペーンを地域別にまとめて紹介。あなたの街の最新キャンペーンをチェックしよう！",
  openGraph: {
    title: "全国PayPay自治体キャンペーン情報サイト",
    description: "全国のPayPay自治体キャンペーンを地域別にまとめて紹介。あなたの街の最新キャンペーンをチェックしよう！",
    url: "https://あなたのドメイン", // ← 公開時にドメインを設定してください
    siteName: "PayPay自治体キャンペーン情報",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "全国PayPay自治体キャンペーン情報サイト",
    description: "全国のPayPay自治体キャンペーンを地域別にまとめて紹介。あなたの街の最新キャンペーンをチェックしよう！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Footer /> {/* ✅ ここで全ページ共通フッターを読み込み */}
      </body>
    </html>
  );
}