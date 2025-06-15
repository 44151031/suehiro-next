"use client";

import React from "react";

type Props = {
  prefecture: string;
  prefectureSlug: string;
  headline: string;
  articleDescription: string;
  url: string;
};

const PrefectureCampaignStructuredData = ({
  prefecture,
  prefectureSlug,
  headline,
  articleDescription,
  url,
}: Props) => {
  const origin = "https://paycancampaign.com";
  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-ogp.jpg`;

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
        "@type": "Place",
        "name": prefecture,
        "address": {
          "@type": "PostalAddress",
          "addressRegion": prefecture,
          "addressCountry": {
            "@type": "Country",
            "name": "JP"
          }
        }
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

export default PrefectureCampaignStructuredData;
