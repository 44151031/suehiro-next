import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";
import { campaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/common/CampaignCard";
import { isCampaignActive, formatJapaneseDate } from "@/lib/campaignUtils"; // ✅ 有効キャンペーン判定をインポート

// ✅ 動的メタデータ生成
export async function generateMetadata({ params }: { params: { prefecture: string } }): Promise<Metadata> {
  const prefecture = prefectures.find(p => p.slug === params.prefecture);
  if (!prefecture) {
    return {
      title: "キャンペーン情報が見つかりません",
      description: "お探しのキャンペーンは存在しないか、URLが間違っている可能性があります。",
    };
  }

  const title = `${prefecture.name}のPayPayキャンペーン一覧`;
  const description = `${title}を紹介しています。お得な還元キャンペーンをチェック！`;

  return { title, description };
}

// ✅ ページ表示処理
export default function PrefecturePage({ params }: { params: { prefecture: string } }) {
  const prefecture = prefectures.find(p => p.slug === params.prefecture);
  if (!prefecture) return notFound();

  const prefectureCities = cities.filter(c => c.prefectureSlug === params.prefecture);
  const prefectureCampaigns = campaigns
    .filter(c => c.prefectureSlug === params.prefecture)
    .filter(c => isCampaignActive(c.endDate)); // ✅ 終了済み除外

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{prefecture.name}のキャンペーン一覧</h1>

      {/* ✅ キャンペーン一覧（リンク付き CampaignCard 利用） */}
      {prefectureCampaigns.length > 0 ? (
        <ul className="space-y-4 mb-8">
          {prefectureCampaigns.map(campaign => (
            <li key={`${campaign.prefectureSlug}-${campaign.citySlug}`}>
              <Link href={`/campaigns/${campaign.prefectureSlug}/${campaign.citySlug}`} className="block">
                <CampaignCard
                  prefecture={campaign.prefecture}
                  city={campaign.city}
                  offer={campaign.offer}
                  period={`${formatJapaneseDate(campaign.startDate, "から")} 〜 ${formatJapaneseDate(campaign.endDate, "まで")}`}
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mb-8">現在、{prefecture.name}の登録キャンペーンはありません。</p>
      )}

      {/* ✅ 市区町村一覧 */}
      <h2 className="text-2xl font-semibold mb-4">市区町村別キャンペーン</h2>
      {prefectureCities.length > 0 ? (
        <ul className="space-y-4">
          {prefectureCities.map(city => (
            <li key={city.slug}>
              <Link href={`/campaigns/${prefecture.slug}/${city.slug}`} className="block">
                <CampaignCard
                  prefecture={prefecture.name}
                  city={city.name}
                  offer=""
                  period="キャンペーン情報を見る"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">現在、{prefecture.name}の市区町村別キャンペーンはありません。</p>
      )}

      <div className="mt-8">
        <Link href="/" className="text-blue-500 underline">
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
