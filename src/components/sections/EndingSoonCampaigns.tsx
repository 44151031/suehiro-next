// ✅ /components/sections/EndingSoonCampaigns.tsx

import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import Card from "@/components/common/Card"; // ✅ 共通Cardを利用

// ✅ 日付文字列を Date オブジェクトに変換するユーティリティ
function parseDate(text: string) {
  const match = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return null;
  const [_, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// ✅ 終了まで15日以内か判定
function isEndingSoon(endDateText: string) {
  const endDate = parseDate(endDateText);
  if (!endDate) return false;
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 15;
}

export default function EndingSoonCampaigns() {
  const endingSoon = campaigns.filter((c) => isEndingSoon(c.endDate));

  if (endingSoon.length === 0) return null;

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-red-50">
      <h2 className="text-2xl font-bold mb-8 text-center">まもなく終了のキャンペーン</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {endingSoon.map((c, index) => (
          <Card key={index} className="min-w-[220px] max-w-[240px] bg-white rounded-2xl">
            <Link href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`} className="block">
              <p className="text-sm font-semibold">{c.prefecture} {c.city}</p>
              <p className="text-lg font-bold mt-2">{c.offer}</p>
              <p className="text-sm mt-1">{c.endDate}</p>
            </Link>
          </Card>
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
