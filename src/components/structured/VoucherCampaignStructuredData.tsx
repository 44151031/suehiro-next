"use client";

import React from "react";
import { generateFAQGraph } from "@/components/structured/parts/FAQJsonLd";

interface Props {
  prefecture: string;
  prefectureSlug: string;
  city: string;
  citySlug: string;
  paytype: string;
  headline: string;
  articleDescription: string;
  validFrom: string;
  validThrough: string;
  url: string;
  datePublished: string;
  dateModified: string;
  officialUrl?: string;
}

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
  const officialPageUrl = officialUrl ?? `${origin}/campaigns/${prefectureSlug}/${citySlug}`;
  const faqGraph = generateFAQGraph(prefecture, city, "商品券");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline,
        description: articleDescription,
        author: {
          "@type": "Organization",
          name: "Payキャン",
          url: origin,
        },
        publisher: {
          "@type": "Organization",
          name: "Payキャン",
          logo: {
            "@type": "ImageObject",
            url: `${origin}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        url,
        image: {
          "@type": "ImageObject",
          url: imageUrl,
        },
        datePublished: `${datePublished}T00:00:00+09:00`,
        dateModified: `${dateModified}T00:00:00+09:00`,
      },
      {
        "@type": "Event",
        name: `${city}の商品券キャンペーン（${headline}）`,
        startDate: `${validFrom}T00:00:00+09:00`,
        endDate: `${validThrough}T00:00:00+09:00`,
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
        performer: {
          "@type": "Organization",
          name: `${prefecture}${city}`,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
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
