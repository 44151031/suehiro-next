export default function ArticleJsonLd({ headline, description, url, imageUrl, datePublished, dateModified }) {
  const origin = "https://paycancampaign.com";
  const base = {
    "@type": "Article",
    headline,
    description,
    author: {
      "@type": "Organization",
      name: "Payキャン運用事務局",
      url: origin,
    },
    publisher: {
      "@type": "Organization",
      name: "Payキャン運用事務局",
      logo: { "@type": "ImageObject", "url": `${origin}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: { "@type": "ImageObject", "url": imageUrl },
  };
  if (datePublished) base["datePublished"] = `${datePublished}T00:00:00+09:00`;
  if (dateModified) base["dateModified"] = `${dateModified}T00:00:00+09:00`;
  return base;
}
