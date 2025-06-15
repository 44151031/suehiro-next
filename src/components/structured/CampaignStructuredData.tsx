"use client";

import React from "react";

type Props = {
  prefecture: string;
  prefectureSlug: string;
  city: string;
  citySlug: string;
  paytype: string;
  headline: string;
  articleDescription: string;
  offerDescription: string;
  validFrom: string;
  validThrough: string;
  url: string;
  offerRate: number;
  onePayLimit: string;
  fullPayLimit: string;
};

const CampaignStructuredData = ({
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
}: Props) => {
  const origin = "https://paycancampaign.com";

  const onePayFormatted = Number(onePayLimit).toLocaleString();
  const fullPayFormatted = Number(fullPayLimit).toLocaleString();
  const offerLimitDescription = `最大${offerRate}％ポイント還元。1回あたり最大${onePayFormatted}円、期間合計最大${fullPayFormatted}円まで。`;

  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": headline,
        "description": articleDescription,
        "author": {
          "@type": "Organization",
          "name": "Payキャン運用事務局",
          "url": origin
        },
        "publisher": {
          "@type": "Organization",
          "name": "Payキャン運用事務局",
          "logo": {
            "@type": "ImageObject",
            "url": `${origin}/logo.png`
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        },
        "url": url,
        "image": {
          "@type": "ImageObject",
          "url": imageUrl
        }
      },
      {
        "@type": "Offer",
        "name": `最大${offerRate}％ポイント還元キャンペーン（${city} × ${paytype}）`,
        "description": offerDescription,
        "priceCurrency": "JPY",
        "validFrom": validFrom,
        "validThrough": validThrough,
        "url": url,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "priceCurrency": "JPY",
          "description": offerLimitDescription
        }
      },
      {
        "@type": "Event",
        "name": `${city}の${paytype}キャンペーン（最大${offerRate}％還元）`,
        "startDate": validFrom,
        "endDate": validThrough,
        "eventStatus": "http://schema.org/EventScheduled",
        "eventAttendanceMode": "http://schema.org/OnlineEventAttendanceMode",
        "url": url,
        "image": imageUrl,
        "location": {
          "@type": "Place",
          "name": `${prefecture}${city}`,
          "address": {
            "@type": "PostalAddress",
            "addressRegion": prefecture,
            "addressLocality": city,
            "addressCountry": {
              "@type": "Country",
              "name": "JP"
            }
          }
        },
        "organizer": {
          "@type": "GovernmentOrganization",
          "name": `${prefecture}${city}`,
          "url": `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}`
        },
        "description": offerLimitDescription
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default CampaignStructuredData;
