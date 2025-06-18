"use client";

import React from "react";

type Props = {
  prefecture: string;
  prefectureSlug: string;
  city: string;
  citySlug: string;
  headline: string;
  articleDescription: string;
  url: string;
};

const CityCampaignStructuredData = ({
  prefecture,
  prefectureSlug,
  city,
  citySlug,
  headline,
  articleDescription,
  url,
}: Props) => {
  const origin = "https://paycancampaign.com";
  const imageUrl = `${origin}/images/campaigns/${prefectureSlug}-${citySlug}.jpg`;

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
        "name": `${prefecture}${city}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressRegion": prefecture,
          "addressCountry": "JP"
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

export default CityCampaignStructuredData;
