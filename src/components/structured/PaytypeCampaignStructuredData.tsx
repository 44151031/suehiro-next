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

  const publisher = {
    "@type": "Organization",
    "@id": `${origin}/#publisher`,
    name: "Payキャン運用事務局",
    logo: {
      "@type": "ImageObject",
      url: `${origin}/logo.png`,
    },
    sameAs: ["https://x.com/paycancampaign"],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: "Payキャン",
    publisher: {
      "@id": `${origin}/#publisher`,
    },
  };

  const article = {
    "@type": "Article",
    headline,
    description: articleDescription,
    author: {
      "@type": "Organization",
      name: "Payキャン運用事務局",
      url: origin,
    },
    publisher,
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
    offers: {
      "@type": "Offer",
      url,
    },
  };

  const offer = {
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
  };

  const event = {
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
    performer: {
      "@type": "Organization",
      name: "Payキャン運用事務局",
    },
    description: offerLimitDescription,
  };

  const faqGraph = generateFAQGraph(prefecture, city, paytypeLabel);

  const data = {
    "@context": "https://schema.org",
    "@graph": [website, publisher, article, offer, event, ...faqGraph],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default PaytypeCampaignStructuredData;
