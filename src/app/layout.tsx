import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LayoutShell from "@/components/layout/LayoutShell";
import ClientNoIndex from "@/components/common/ClientNoIndex"; // ✅ 追加

// ✅ metadataGenerators.ts を使って動的にメタデータを生成
import { generateMetadata as generateDynamicMetadata } from "@/lib/metadataGenerators";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // ✅ 遅延防止（FOUT対策）
  preload: true,   // ✅ LCP改善のため追加
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // ✅ 遅延防止（FOUT対策）
});

// ✅ generateMetadata だけを export（icons をここで付加）
export async function generateMetadata(params: any): Promise<Metadata> {
  const dynamic = await generateDynamicMetadata(params);

  return {
    ...dynamic,
    icons: {
      icon: "/favicon.png", 
    },
  };
}

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID!;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        {/* ✅ Google Fonts 最適化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientNoIndex /> {/* ✅ クライアントでnoindexを追加 */}

        {/* ✅ Google Tag Manager script（lazyOnloadでTBT改善） */}
        <Script
          id="gtm-init"
          strategy="lazyOnload" // ✅ ここが変更点
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
