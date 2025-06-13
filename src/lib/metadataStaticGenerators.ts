// ✅ /lib/metadataStaticGenerators.ts

import { Metadata } from "next";

//
// ✅ ページ別タイトル＆説明を静的に定義（※すべて「- Pキャン」を除外済み）
//
const staticMetadataMap: Record<string, { title: string; description: string }> = {
  top: {
    title: "PayPay・auPAY・楽天ペイ・d払い等キャッシュレスキャンペーン体験-Payキャン",
    description:
      "全国のPayPay・auPAY・楽天ペイ・d払いのキャッシュレスキャンペーンと対象店舗を紹介。都道府県・市区町村ごとの還元情報をわかりやすく掲載しています。1つのキャンペーンで最大30％還元、1万円還元も！今すぐチェック。",
  },
  campaigns: {
    title: "全国のキャッシュレスキャンペーン一覧",
    description:
      "今、獲得できるポイントの総額が分かる。全国の都道府県・市区町村で開催中・開催予定のPayPay・auPAY・楽天ペイ・d払い等のキャッシュレスキャンペーンを一覧で確認できます。",
  },
  archive: {
    title: "次回開催待ちのキャッシュレスキャンペーン一覧",
    description:
      "次回開催待ちの市区町村の過去のキャッシュレスキャンペーン一覧。過去のキャンペーンの終了日や内容から各市区町村の次回開催時の傾向を確認できます。",
  },
  maintenance: {
    title: "メンテナンス中",
    description:
      "ただいまシステムメンテナンス中です。ご不便をおかけしておりますが、しばらくお待ちください。",
  },
  management: {
    title: "運営管理ページ",
    description:
      "Payキャンの管理情報を掲載しています。Payキャンの連絡先などを確認できます。",
  },
};

//
// ✅ 共通OGP付きのMetadataを生成
//
function withDefaultOGP(key: keyof typeof staticMetadataMap): Metadata {
  const baseUrl = "https://paycancampaign.com";
  const meta = staticMetadataMap[key];

  return {
    ...meta,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: `${baseUrl}/${key === "top" ? "" : key}`,
      images: [
        {
          url: `${baseUrl}/ogp.jpg`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/ogp.jpg`],
    },
  };
}

//
// ✅ 各ページ用のエクスポート関数
//
export const getTopPageMetadata = () => withDefaultOGP("top");
export const getCampaignsPageMetadata = () => withDefaultOGP("campaigns");
export const getArchivePageMetadata = () => withDefaultOGP("archive");
export const getSearchPageMetadata = () => withDefaultOGP("search");
export const getMaintenancePageMetadata = () => withDefaultOGP("maintenance");
export const getManagementPageMetadata = () => withDefaultOGP("management");
