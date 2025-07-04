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
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ✅ generateMetadata だけを export（icons をここで付加 & generatorを削除）
export async function generateMetadata(params: any): Promise<Metadata> {
  const dynamic = await generateDynamicMetadata(params);

  return {
    ...dynamic,
    generator: "",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ✅ AdSense スクリプトは生で書く！ */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6887407803306740"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientNoIndex />

        <Script
          id="gtm-init"
          strategy="lazyOnload"
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
