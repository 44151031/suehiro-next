// ✅ /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { prefectures } from "@/lib/prefectures"; // ✅ 都道府県スラッグ取得用

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paycancampaign.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ✅ 全国のキャンペーン一覧ページ
  const rootPage = [
    { url: `${siteUrl}/campaigns`, lastModified: now },
  ];

  // ✅ 都道府県別ページ（使用されている都道府県スラッグのみ）
  const usedPrefectureSlugs = Array.from(new Set(campaigns.map(c => c.prefectureSlug)));
  const prefecturePages = usedPrefectureSlugs.map(slug => ({
    url: `${siteUrl}/campaigns/${slug}`,
    lastModified: now,
  }));

  // ✅ 市区町村ページ（存在する組み合わせのみ）
  const cityCampaignPages = campaigns.map(c => ({
    url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}`,
    lastModified: c.lastModified ?? now,
  }));

  // ✅ 支払いタイプ別ページ（campaigns に存在するものだけ）
  const usedPaytypes = Array.from(new Set(campaigns.map(c => c.paytype).filter(Boolean)));
  const payTypePages = usedPaytypes.map(slug => ({
    url: `${siteUrl}/campaigns/paytype/${slug}`,
    lastModified: now,
  }));

  // ✅ その他静的ページ
  const staticPages = [
    { url: `${siteUrl}/management`, lastModified: now },
    { url: `${siteUrl}/search`, lastModified: now },
  ];

  return [
    ...rootPage,
    ...prefecturePages,
    ...cityCampaignPages,
    ...payTypePages,
    ...staticPages,
  ];
}
