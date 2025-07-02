"use client";

const TopPageStructuredData = () => {
  const origin = "https://paycancampaign.com";

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

export default TopPageStructuredData;
