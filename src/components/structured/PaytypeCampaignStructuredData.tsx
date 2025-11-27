"use client";

import React from "react";
import { generateFAQGraph } from "@/components/structured/parts/FAQJsonLd";
import { PayTypeLabels } from "@/lib/payType";
import type { PayTypeId } from "@/lib/payType";

type Props = {
  prefecture: string;
  prefectureSlug: string;
  city: string;
  citySlug: string;
  paytype: PayTypeId;
  headline: string;
  articleDescription: string;
  offerDescription: string;
  validFrom: string;
  validThrough: string;
  url: string;
  offerRate: number;
  onePayLimit: string;
  fullPayLimit: string;
  datePublished: string;
  dateModified: string;
  officialUrl?: string;
};

const PaytypeCampaignStructuredData = (props: Props) => {
  const {
    prefecture,
    prefectureSlug,
    city,
    citySlug,
    paytype,
    headline,
    articleDescription,
    offerDescription,
    validFrom,
    validThrough,
    url,
    offerRate,
    onePayLimit,
    fullPayLimit,
    datePublished,
    dateModified,
    officialUrl,
  } = props;

  const origin = "https://paycancampaign.com";
  const paytypeLabel = PayTypeLabels[paytype] || paytype;

  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;
  const onePayFormatted = Number(onePayLimit).toLocaleString();
  const fullPayFormatted = Number(fullPayLimit).toLocaleString();
  const offerLimitDescription = `最大${offerRate}％ポイント還元。1回あたり最大${onePayFormatted}円、期間合計最大${fullPayFormatted}円まで。`;

  const officialPageUrl =
    officialUrl ?? `${origin}/campaigns/${prefectureSlug}/${citySlug}`;
  const faqGraph = generateFAQGraph(prefecture, city, paytypeLabel);

  // ===== 状態判定（開催前／開催中／終了） =====
  const now = new Date();
  const startDate = new Date(`${validFrom}T00:00:00+09:00`);
  const endDate = new Date(`${validThrough}T23:59:59+09:00`);

  let eventStatus = "https://schema.org/EventScheduled";
  let availability = "https://schema.org/InStock";

  if (endDate < now) {
    eventStatus = "https://schema.org/EventCompleted";
    availability = "https://schema.org/SoldOut";
  }

  // ===== メイン構造化データ（Eventのみ） =====
  const graph: any[] = [
    {
      "@type": "Event",
      name: `${city}の${paytypeLabel}キャンペーン（最大${offerRate}％還元）`,
      headline,
      description: articleDescription,
      startDate: `${validFrom}T00:00:00+09:00`,
      endDate: `${validThrough}T23:59:59+09:00`,
      eventStatus,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
      offers: {
        "@type": "Offer",
        name: `${city} × ${paytypeLabel} 最大${offerRate}％ポイント還元キャンペーン`,
        description: offerDescription,
        priceCurrency: "JPY",
        price: 0,
        availability,
        validFrom: `${validFrom}T00:00:00+09:00`,
        validThrough: `${validThrough}T23:59:59+09:00`,
        url,
      },
      organizer: {
        "@type": "GovernmentOrganization",
        name: `${prefecture}${city}`,
        url: officialPageUrl,
      },
      performer: {
        "@type": "Organization",
        name: `${prefecture}${city}`,
      },
      offersDescription: offerLimitDescription,
      datePublished: `${datePublished}T00:00:00+09:00`,
      dateModified: `${dateModified}T00:00:00+09:00`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    },
  ];

  const data = {
    "@context": "https://schema.org",
    "@graph": [...graph, ...faqGraph],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
};

export default PaytypeCampaignStructuredData;
