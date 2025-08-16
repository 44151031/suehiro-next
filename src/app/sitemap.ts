// ✅ /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { prefectures } from "@/lib/prefectures";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paycancampaign.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ✅ トップ
  const topPage: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now },
  ];

  // ✅ 一覧系
  const rootPage: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/campaigns`, lastModified: now },
    { url: `${siteUrl}/campaigns/archive`, lastModified: now },
  ];

  // ✅ 都道府県ページ（全都道府県を必ず掲載／0件でもページは存在させる方針）
  const prefecturePages: MetadataRoute.Sitemap = prefectures.map((p) => ({
    url: `${siteUrl}/campaigns/${p.slug}`,
    lastModified: now,
  }));

  // ✅ 市区町村ページ（重複排除）
  const citySet = new Set<string>();
  const cityPages: MetadataRoute.Sitemap = campaigns
    .filter((c) => {
      if (!c.prefectureSlug || !c.citySlug) return false;
      const key = `${c.prefectureSlug}/${c.citySlug}`;
      if (citySet.has(key)) return false;
      citySet.add(key);
      return true;
    })
    .map((c) => ({
      url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}`,
      lastModified: (c as any).dateModified ?? (c as any).datePublished ?? now,
    }));

  // ✅ 支払いタイプ付き（通常のPay系 詳細ページ）
  const detailedPages: MetadataRoute.Sitemap = campaigns
    .filter((c) => !!c.paytype && c.prefectureSlug && c.citySlug)
    .map((c) => ({
      url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`,
      lastModified: (c as any).dateModified ?? (c as any).datePublished ?? now,
    }));

  // ✅ 商品券（voucher）ページ
  const voucherPages: MetadataRoute.Sitemap = voucherCampaignMaster.map((v) => ({
    url: `${siteUrl}/campaigns/${v.prefectureSlug}/${v.citySlug}/${v.pay}`,
    lastModified: (v as any).dateModified ?? (v as any).datePublished ?? now,
  }));

  // ✅ その他静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/management`, lastModified: now },
    { url: `${siteUrl}/campaigns/search`, lastModified: now },
  ];

  // ✅ 結合（必要なら重複排除）
  const all: MetadataRoute.Sitemap = [
    ...topPage,
    ...rootPage,
    ...prefecturePages,
    ...cityPages,
    ...detailedPages,
    ...voucherPages,
    ...staticPages,
  ];

  // URL重複の念のため除去
  const seen = new Set<string>();
  const uniq = all.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });

  return uniq;
}
