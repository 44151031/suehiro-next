// ✅ /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypes } from "@/lib/payType";
import { prefectures } from "@/lib/prefectures"; // ✅ 都道府県スラッグ取得用

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paycancampaign.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ✅ 全国のキャンペーン一覧ページ
  const rootPage = [
    { url: `${siteUrl}/campaigns`, lastModified: now },
  ];

  // ✅ 都道府県別ページ
  const prefecturePages = prefectures.map((p) => ({
    url: `${siteUrl}/campaigns/${p.slug}`,
    lastModified: now,
  }));

  // ✅ 市区町村別ページ（キャンペーン情報ベース）
  const cityCampaigns = campaigns.map((c) => ({
    url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}`,
    lastModified: c.lastModified ?? now,
  }));

  // ✅ 支払いタイプ別ページ（存在する場合）
  const payTypePages = Object.keys(PayTypes).map((slug) => ({
    url: `${siteUrl}/campaigns/paytype/${slug}`,
    lastModified: now,
  }));

  // ✅ その他静的ページ
  const staticPages = [
    { url: `${siteUrl}/management`, lastModified: now }, // 運営について
    { url: `${siteUrl}/search`, lastModified: now },     // 検索結果トップ
  ];

  return [
    ...rootPage,
    ...prefecturePages,
    ...cityCampaigns,
    ...payTypePages,
    ...staticPages,
  ];
}
