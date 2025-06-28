"use client";

import React from "react";
import ArticleJsonLd from "./parts/ArticleJsonLd";
import EventJsonLd from "./parts/EventJsonLd";
import OfferJsonLd from "./parts/OfferJsonLd";
import FAQJsonLd from "./parts/FAQJsonLd";

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
  officialUrl
}: Props) => {
  const origin = "https://paycancampaign.com";
  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      ArticleJsonLd({
        headline,
        description: articleDescription,
        url,
        imageUrl,
        datePublished,
        dateModified,
      }),
      OfferJsonLd({
        city,
        paytype,
        offerRate,
        offerDescription,
        validFrom,
        validThrough,
        url,
        onePayLimit,
        fullPayLimit,
      }),
      EventJsonLd({
        city,
        prefecture,
        offerRate,
        validFrom,
        validThrough,
        url,
        imageUrl,
        officialUrl,
      }),
      FAQJsonLd({
        prefecture,
        city,
        paytype,
      }),
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
