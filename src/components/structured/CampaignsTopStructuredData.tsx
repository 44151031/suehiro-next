"use client";

const CampaignsTopStructuredData = () => {
  const origin = "https://paycancampaign.com";
  const pageUrl = `${origin}/campaigns`;

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        "url": origin,
        "name": "Payキャン",
        "publisher": {
          "@id": `${origin}/#publisher`
        }
      },
      {
        "@type": "Organization",
        "@id": `${origin}/#publisher`,
        "name": "Payキャン",
        "url": origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${origin}/logo.png`
        },
        "sameAs": [
          "https://x.com/paycancampaign"
        ]
      },
      {
        "@type": "WebPage",
        "@id": pageUrl,
        "url": pageUrl,
        "name": "PayPayなど全国のポイント還元キャンペーン一覧",
        "description": "全国で開催中のPayPay、au PAY、楽天ペイ、d払い、イオンペイなどの自治体ポイント還元キャンペーンを一覧で掲載しています。",
        "isPartOf": {
          "@id": `${origin}/#website`
        },
        "about": {
          "@id": `${origin}/#publisher`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${origin}/ogp.jpg`
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

export default CampaignsTopStructuredData;
