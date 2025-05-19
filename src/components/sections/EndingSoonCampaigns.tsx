import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import CampaignCard from "@/components/common/CampaignCard";
import { isEndingSoon } from "@/lib/campaignUtils"; // ✅ 直接 isEndingSoon を利用

export default function EndingSoonCampaigns() {
  // ✅ まもなく終了のキャンペーンのみ抽出
  const endingSoon = campaigns.filter((c) => isEndingSoon(c.endDate));

  if (endingSoon.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-red-50">
      <h2 className="text-2xl font-bold mb-8 text-center">まもなく終了のキャンペーン</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {endingSoon.map((c, index) => (
          <Link key={index} href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`} className="block">
            <CampaignCard
              prefecture={c.prefecture}
              city={c.city}
              offer={c.offer}
              period={c.endDate}
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
