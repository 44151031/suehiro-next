"use client";

import React from "react";
import { generateFAQGraph } from "@/components/structured/parts/FAQJsonLd";

type Props = {
  prefecture: string;
  prefectureSlug: string;
  city: string;
  citySlug: string;
  paytype: string; // "paypay-voucher" 固定でもOK
  headline: string; // 例: `${cityName}の商品券キャンペーン（${campaigntitle}）`
  articleDescription: string;
  validFrom: string;    // YYYY-MM-DD or ISO
  validThrough: string; // YYYY-MM-DD or ISO
  url: string;          // ページURL
  datePublished: string; // YYYY-MM-DD
  dateModified: string;  // YYYY-MM-DD
  officialUrl?: string;  // 自治体や公式の案内ページ
};

const VoucherCampaignStructuredData = ({
  prefecture,
  prefectureSlug,
  city,
  citySlug,
  paytype,
  headline,
  articleDescription,
  validFrom,
  validThrough,
  url,
  datePublished,
  dateModified,
  officialUrl,
}: Props) => {
  const origin = "https://paycancampaign.com";
  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;
  const officialPageUrl =
    officialUrl ?? `${origin}/campaigns/${prefectureSlug}/${citySlug}`;
  const faqGraph = generateFAQGraph(prefecture, city, "商品券");

  // 与えられた日付文字列が既に時間まで含むかを判定してISO拡張
  const toISO = (d: string, { endOfDay = false } = {}) => {
    // すでに "T" を含む場合はそのまま採用（ダブル連結防止）
    if (/\dT\d/.test(d)) return d;
    return `${d}T${endOfDay ? "23:59:59" : "00:00:00"}+09:00`;
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        description: articleDescription,
        author: { "@type": "Organization", name: "Payキャン", url: origin },
        publisher: {
          "@type": "Organization",
          name: "Payキャン",
          logo: { "@type": "ImageObject", url: `${origin}/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        image: { "@type": "ImageObject", url: imageUrl },
        datePublished: toISO(datePublished),
        dateModified: toISO(dateModified),
      },
      {
        "@type": "Event",
        // ❌ 以前: `${city}の商品券キャンペーン（${headline}）` → 二重になるため修正
        name: headline,
        startDate: toISO(validFrom),                // 申込開始日
        endDate: toISO(validThrough, { endOfDay: true }), // 申込終了日（終日）
        eventStatus: "http://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: `${prefecture}${city}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressRegion: prefecture,
            addressCountry: "JP",
          },
        },
        image: imageUrl,
        description: `${prefecture}${city}で実施されるプレミアム商品券キャンペーン「${headline}」は、${validFrom}から${validThrough}までの期間で行われます。`,
        organizer: {
          "@type": "GovernmentOrganization",
          name: `${prefecture}${city}`,
          url: officialPageUrl,
        },
        performer: { "@type": "Organization", name: `${prefecture}${city}` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      ...faqGraph,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default VoucherCampaignStructuredData;
