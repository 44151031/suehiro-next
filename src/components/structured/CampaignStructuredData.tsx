"use client";

import React from "react";
import type { CampaignStructuredDataProps } from "@/types/campaign";

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
  datePublished,
  dateModified,
  officialUrl,
}: CampaignStructuredDataProps) => {
  const origin = "https://paycancampaign.com";

  const onePayFormatted = Number(onePayLimit).toLocaleString();
  const fullPayFormatted = Number(fullPayLimit).toLocaleString();
  const offerLimitDescription = `最大${offerRate}％ポイント還元。1回あたり最大${onePayFormatted}円、期間合計最大${fullPayFormatted}円まで。`;

  const imageUrl = `${origin}/images/campaigns/ogp/${prefectureSlug}-${citySlug}-${paytype}-ogp.jpg`;

  // ✅ タイムゾーン付き ISO 8601 形式へ補正
  const toISO8601WithTZ = (date: string) => `${date}T00:00:00+09:00`;

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
        },
        "datePublished": toISO8601WithTZ(datePublished),
        "dateModified": toISO8601WithTZ(dateModified),
        "offers": {
          "@type": "Offer",
          "url": url
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
            "addressLocality": city,
            "addressRegion": prefecture,
            "addressCountry": "JP"
          }
        },
        "organizer": {
          "@type": "GovernmentOrganization",
          "name": `${prefecture}${city}`,
          "url": officialUrl?.trim() ? officialUrl : `${origin}/campaigns/${prefectureSlug}/${citySlug}`
        },
        "performer": {
          "@type": "Organization",
          "name": "Payキャン運用事務局"
        },
        "description": offerLimitDescription
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `キャンペーン対象エリア（${prefecture}${city}）に住んでいなくても還元を受けられますか？`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${prefecture}${city}の${paytype}キャンペーンでは、${prefecture}${city}にお住まいでなくても対象店舗での対象決済であれば還元の対象になります。観光や出張、帰省などで訪れた際にも利用できます。詳細条件は公式ページをご確認ください。`
            }
          },
          {
            "@type": "Question",
            "name": `${paytype}の還元は何時、何でもらえますか？`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${prefecture}${city}の${paytype}キャンペーンでは、通常は決済から30日以内にポイントとして還元されます。`
            }
          },
          {
            "@type": "Question",
            "name": `家族のスマホで${paytype}を使った場合も還元されますか？`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${paytype}のアカウント単位で還元対象が決まります。対象アカウントでの正しい決済であれば還元されます。`
            }
          },
          {
            "@type": "Question",
            "name": `${paytype}で支払ったのにポイントが付かないのはなぜ？`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `期間外・対象外店舗・対象外商品・クレジット払い・請求書払いなどは還元対象外です。`
            }
          },
          {
            "@type": "Question",
            "name": `${paytype}は他のキャンペーンと併用できますか？`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `他キャンペーンとの併用が可能な場合もありますが、上限や条件に注意が必要です。`
            }
          },
          {
            "@type": "Question",
            "name": `${paytype}で付与されたポイントはどこで使えますか？`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `全国の${paytype}対応店舗で使用可能です。`
            }
          }
        ]
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
