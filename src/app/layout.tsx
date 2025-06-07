// ✅ /src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
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
    default: "PayPay・auPay・楽天ペイ・d払いキャンペーン体験 - Payキャン",
    template: "%s - Payキャン",
  },
  description:
    "全国のPayPay・auPay・楽天ペイ・d払いキャンペーンをまとめて紹介。各地域で獲得出来る総額もわかるから、効率よくポイントを獲得出来ます。",
  openGraph: {
    title: "PayPay・auPay・楽天ペイ・d払いキャンペーン体験 - Payキャン",
    description:
      "全国のPayPay・auPay・楽天ペイ・d払いキャンペーンをまとめて紹介。各地域で獲得出来る総額もわかるから、効率よくポイントを獲得出来ます。",
    url: "https://paycancampaign.com",
    siteName: "Payキャン",
    type: "website",
    images: [
      {
        url: "https://paycancampaign.com/ogp.jpg",
        width: 1200,
        height: 630,
        alt: "PayキャンのOGP画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayPay・auPay・楽天ペイ・d払いキャンペーン体験 - Payキャン",
    description:
      "全国のPayPay・auPay・楽天ペイ・d払いキャンペーンをまとめて紹介。各地域で獲得出来る総額もわかるから、効率よくポイントを獲得出来ます。",
    images: ["https://paycancampaign.com/ogp.jpg"],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID!;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head />

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Google Tag Manager script（クライアントでのみ実行） */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        {/* ✅ GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Header />
        <LayoutShell>{children}</LayoutShell>
        <Footer />
      </body>
    </html>
  );
}
