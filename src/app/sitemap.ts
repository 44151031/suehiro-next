// ✅ /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paycancampaign.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ✅ 全国のキャンペーン一覧ページ
  const rootPage = [
    { url: `${siteUrl}/campaigns`, lastModified: now },
  ];

  // ✅ 都道府県別ページ（campaigns に登場する都道府県だけ）
  const prefectureSlugs = Array.from(new Set(campaigns.map((c) => c.prefectureSlug)));
  const prefecturePages = prefectureSlugs.map((slug) => ({
    url: `${siteUrl}/campaigns/${slug}`,
    lastModified: now,
  }));

  // ✅ 市区町村ページ（重複排除）
  const citySet = new Set<string>();
  const cityPages = campaigns
    .filter((c) => {
      const key = `${c.prefectureSlug}/${c.citySlug}`;
      if (citySet.has(key)) return false;
      citySet.add(key);
      return true;
    })
    .map((c) => ({
      url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}`,
      lastModified: c.lastModified ?? now,
    }));

  // ✅ 支払いタイプ付き詳細ページ
  const detailedPages = campaigns
    .filter((c) => !!c.paytype)
    .map((c) => ({
      url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`,
      lastModified: c.lastModified ?? now,
    }));

  // ✅ その他静的ページ（必要に応じて）
  const staticPages = [
    { url: `${siteUrl}/management`, lastModified: now },
    { url: `${siteUrl}/search`, lastModified: now },
  ];

  return [
    ...rootPage,
    ...prefecturePages,
    ...cityPages,
    ...detailedPages,
    ...staticPages,
  ];
}
