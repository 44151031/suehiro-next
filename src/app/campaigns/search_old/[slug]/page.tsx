import { Metadata } from "next";
import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";

interface Props {
  params: { slug: string };
}

// ✅ 動的メタデータ設定
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const prefecture = prefectures.find((p) => p.slug === slug);
  const city = cities.find((c) => c.slug === slug);

  const title = prefecture
    ? `${prefecture.name}のPayPayキャンペーン一覧`
    : city
    ? `${city.name}のPayPayキャンペーン情報`
    : `キャンペーン検索結果`;

  const description = `${title}を紹介しています。お得な還元キャンペーンをチェック！`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://あなたのドメイン/campaigns/search/${slug}`,
      siteName: "PayPay自治体キャンペーン情報",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ✅ ページ本体
export default function CampaignSearchResultPage({ params }: Props) {
  const { slug } = params;

  const prefecture = prefectures.find((p) => p.slug === slug);
  const city = cities.find((c) => c.slug === slug);

  const results = city
    ? [city]
    : cities.filter((c) => c.prefectureSlug === slug);

  const title = prefecture
    ? `${prefecture.name}のキャンペーン一覧`
    : city
    ? `${city.name}のキャンペーン情報`
    : `検索結果`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((c) => (
            <li key={c.slug}>
              {prefecture?.name || ""}
              {c.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>一致するキャンペーンがありません。</p>
      )}
    </div>
  );
}