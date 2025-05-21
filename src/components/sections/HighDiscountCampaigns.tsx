// ✅ /components/sections/HighDiscountCampaigns.tsx

import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import CampaignCard from "@/components/common/CampaignCard";
import { getHighDiscountCampaigns, formatJapaneseDate } from "@/lib/campaignUtils"; // ✅ 共通取得関数

export default function HighDiscountCampaigns() {
  const highDiscounts = getHighDiscountCampaigns(campaigns); // ✅ 30%以上抽出

  if (highDiscounts.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-yellow-50">
      <h2 className="text-2xl font-bold mb-8 text-center">高還元キャンペーン特集（30%以上）</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {highDiscounts.map((c, index) => (
          <Link key={index} href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`} className="block">
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
