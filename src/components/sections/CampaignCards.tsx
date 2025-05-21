import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import CampaignCard from "@/components/common/CampaignCard";
import { isCampaignActive, formatJapaneseDate } from "@/lib/campaignUtils"; // ✅ 有効キャンペーン判定をインポート

export default function CampaignCards() {
  // ✅ 終了していないキャンペーンのみ表示
  const activeCampaigns = campaigns.filter((c) => isCampaignActive(c.endDate));

  if (activeCampaigns.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-8 text-center">開催中のキャンペーン</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {activeCampaigns.map((c, index) => (
          <Link
            key={index}
            href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
            className="block"
          >
            <CampaignCard
              prefecture={c.prefecture}
              city={c.city}
              offer={c.offer}
              period={formatJapaneseDate(c.endDate, "まで")}
            />
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/campaigns"
          className="inline-block bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600 transition"
        >
          一覧を見る
        </Link>
      </div>
    </section>
  );
}
