// /app/sitemap.ts
import { MetadataRoute } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { prefectures } from "@/lib/prefectures";
import { createClientServerRSC } from "@/lib/supabase/rsc";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://paycancampaign.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ✅ トップ
  const topPage: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now },
  ];

  // ✅ 一覧系
  const rootPage: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/campaigns`, lastModified: now },
    { url: `${siteUrl}/campaigns/archive`, lastModified: now },
    { url: `${siteUrl}/articles`, lastModified: now }, // 記事一覧トップ
  ];

  // ✅ 都道府県ページ
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

  // ✅ 支払いタイプ付き詳細
  const detailedPages: MetadataRoute.Sitemap = campaigns
    .filter((c) => !!c.paytype && c.prefectureSlug && c.citySlug)
    .map((c) => ({
      url: `${siteUrl}/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`,
      lastModified: (c as any).dateModified ?? (c as any).datePublished ?? now,
    }));

  // ✅ 商品券（voucher）
  const voucherPages: MetadataRoute.Sitemap = voucherCampaignMaster
    .filter((v) => !!v.prefectureSlug && !!v.citySlug && !!v.paytype)
    .map((v) => ({
      url: `${siteUrl}/campaigns/${v.prefectureSlug}/${v.citySlug}/${v.paytype}`,
      lastModified: (v as any).dateModified ?? (v as any).datePublished ?? now,
    }));

  // ✅ 記事ページ（Supabaseから取得）
  const supabase = await createClientServerRSC();
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, published_at, updated_at, status")
    .eq("status", "published");

  const articlePages: MetadataRoute.Sitemap =
    articles?.map((a) => {
      const pub = new Date(a.published_at);
      const y = String(pub.getFullYear());
      const m = String(pub.getMonth() + 1).padStart(2, "0");

      return {
        url: `${siteUrl}/articles/${y}/${m}/${a.slug}`,
        lastModified: a.updated_at || a.published_at || now,
      };
    }) ?? [];

  // ✅ その他静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/management`, lastModified: now },
    { url: `${siteUrl}/campaigns/search`, lastModified: now },
  ];

  // ✅ 結合
  const all: MetadataRoute.Sitemap = [
    ...topPage,
    ...rootPage,
    ...prefecturePages,
    ...cityPages,
    ...detailedPages,
    ...voucherPages,
    ...articlePages,
    ...staticPages,
  ];

  // 重複排除
  const seen = new Set<string>();
  const uniq = all.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });

  return uniq;
}
