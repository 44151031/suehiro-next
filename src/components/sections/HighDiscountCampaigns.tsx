import { campaigns } from "@/lib/campaigns";
import Link from "next/link";

// 数値部分だけを抽出して比較する関数
function extractPercentage(text: string) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export default function HighDiscountCampaigns() {
  const highDiscounts = campaigns.filter((c) => extractPercentage(c.offer) >= 30);

  if (highDiscounts.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-yellow-50">
      <h2 className="text-2xl font-bold mb-8 text-center">高還元キャンペーン特集（30%以上）</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {highDiscounts.map((c, index) => (
          <Link
            key={index}
            href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
            className="min-w-[220px] max-w-[240px] bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 block"
          >
            <p className="text-sm font-semibold">{c.prefecture} {c.city}</p>
            <p className="text-lg font-bold mt-2">{c.offer}</p>
            <p className="text-sm mt-1">{c.period}</p>
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
