// src/components/structured/ArticleStructuredData.tsx
// ※ "use client" を付けない（サーバーコンポーネント）
export default function ArticleStructuredData(props: {
  url: string;
  title: string;
  description: string;
  imageUrl: string;           // 1200px以上の絶対URL
  datePublished: string;      // ISO8601（+09:00 含む）
  dateModified: string;       // ISO8601（+09:00 含む）
  authorName: string;
  publisherName: string;
  publisherLogoUrl: string;   // 絶対URL（横600px以上推奨）
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": { "@type": "WebPage", "@id": props.url },
    "headline": props.title,
    "description": props.description,
    "image": [props.imageUrl],
    "datePublished": props.datePublished,
    "dateModified": props.dateModified,
    "author": { "@type": "Person", "name": props.authorName },
    "publisher": {
      "@type": "Organization",
      "name": props.publisherName,
      "logo": { "@type": "ImageObject", "url": props.publisherLogoUrl }
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
