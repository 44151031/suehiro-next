// ✅ /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paycancampaign.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ✅ トップページ
  const topPage = [
    { url: `${siteUrl}/`, lastModified: now },
  ];

  // ✅ 全国のキャンペーン一覧ページ（prefecture ページは含めない）
  const rootPage = [
    { url: `${siteUrl}/campaigns`, lastModified: now },
    { url: `${siteUrl}/campaigns/archive`, lastModified: now }, // ✅ 追加されたアーカイブページ
  ];

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

  // ✅ その他静的ページ（prefecture は入れない）
  const staticPages = [
    { url: `${siteUrl}/management`, lastModified: now },
    { url: `${siteUrl}/campaigns/search`, lastModified: now },
  ];

  return [
    ...topPage,
    ...rootPage,
    ...prefecturePages,
    ...cityPages,
    ...detailedPages,
    ...staticPages,
  ];
}
