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

const PaytypeCampaignStructuredData = ({
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
}: Props) => {
  const origin = "https://paycancampaign.com";
  const paytypeLabel = PayTypeLabels[paytype] || paytype;

  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;
  const onePayFormatted = Number(onePayLimit).toLocaleString();
  const fullPayFormatted = Number(fullPayLimit).toLocaleString();
  const offerLimitDescription = `最大${offerRate}％ポイント還元。1回あたり最大${onePayFormatted}円、期間合計最大${fullPayFormatted}円まで。`;

  const officialPageUrl = officialUrl ?? `${origin}/campaigns/${prefectureSlug}/${citySlug}`;
  const faqGraph = generateFAQGraph(prefecture, city, paytypeLabel);

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
        "@type": "Offer",
        name: `最大${offerRate}％ポイント還元キャンペーン（${city} × ${paytypeLabel}）`,
        description: offerDescription,
        priceCurrency: "JPY",
        validFrom: `${validFrom}T00:00:00+09:00`,
        validThrough: `${validThrough}T00:00:00+09:00`,
        url,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          priceCurrency: "JPY",
          description: offerLimitDescription,
        },
      },
      {
        "@type": "Event",
        name: `${city}の${paytypeLabel}キャンペーン（最大${offerRate}％還元）`,
        startDate: `${validFrom}T00:00:00+09:00`,
        endDate: `${validThrough}T00:00:00+09:00`,
        eventStatus: "http://schema.org/EventScheduled",
        eventAttendanceMode: "http://schema.org/OnlineEventAttendanceMode",
        url,
        image: imageUrl,
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
        organizer: {
          "@type": "GovernmentOrganization",
          name: `${prefecture}${city}`,
          url: officialPageUrl,
        },
        description: offerLimitDescription,
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

export default PaytypeCampaignStructuredData;
