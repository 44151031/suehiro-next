// ✅ /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeSlugMap } from "@/lib/payType";

// ✅ ドメインの環境変数（Vercel用） fallback付き
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // ✅ 市区町村別キャンペーンページ
  const cityCampaigns = campaigns.map((c) => ({
    url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}`,
    lastModified: c.lastModified ?? new Date().toISOString(), // ⛳ 型に lastModified?: string を定義すること
  }));

  // ✅ 支払いタイプ別ページ
  const payTypePages = Object.values(PayTypeSlugMap).map((slug) => ({
    url: `${siteUrl}/campaigns/paytype/${slug}`,
    lastModified: new Date().toISOString(), // 静的なので日付固定でもOK
  }));

  return [...cityCampaigns, ...payTypePages];
}
