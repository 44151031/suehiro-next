import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import { formatJapaneseDate } from "@/lib/utils";

export default function CampaignCards() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-8 text-center">開催中のキャンペーン</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {campaigns.map((c, index) => (
          <Link
            key={index}
            href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
            className="min-w-[220px] max-w-[240px] bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 block"
          >
            <p className="text-sm font-semibold">{c.prefecture} {c.city}</p>
            <p className="text-lg font-bold mt-2">{c.offer}</p>
            <p className="text-sm mt-1">{formatJapaneseDate(c.endDate, "まで")}</p>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link href="/campaigns" className="inline-block bg-blue-500 text-white rounded px-6 py-2 hover:bg-blue-600 transition">
          一覧を見る
        </Link>
      </div>
    </section>
  );
}