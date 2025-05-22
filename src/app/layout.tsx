// ✅ /src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header"; // ✅ 共通ヘッダー
import Footer from "@/components/layout/Footer";
import LayoutShell from "@/components/layout/LayoutShell"; // ✅ ← 追加

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ メタ情報（SEO・OGP）
export const metadata: Metadata = {
  title: "全国PayPay自治体キャンペーン情報サイト",
  description:
    "全国のPayPay自治体キャンペーンを地域別にまとめて紹介。あなたの街の最新キャンペーンをチェックしよう！",
  openGraph: {
    title: "全国PayPay自治体キャンペーン情報サイト",
    description:
      "全国のPayPay自治体キャンペーンを地域別にまとめて紹介。あなたの街の最新キャンペーンをチェックしよう！",
    url: "https://あなたのドメイン", // ← 公開時にドメインを設定
    siteName: "PayPay自治体キャンペーン情報",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "全国PayPay自治体キャンペーン情報サイト",
    description:
      "全国のPayPay自治体キャンペーンを地域別にまとめて紹介。あなたの街の最新キャンペーンをチェックしよう！",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header /> {/* ✅ 共通ヘッダー */}
        <LayoutShell> {/* ✅ ここにパンくず処理も含まれる */}
          {children}
        </LayoutShell>
        <Footer /> {/* ✅ 共通フッター */}
      </body>
    </html>
  );
}
