// ✅ /components/common/CampaignCard.tsx

import { formatJapaneseDate } from "@/lib/campaignUtils";

type CampaignCardProps = {
  prefecture: string;
  city: string;
  offer: number;
  startDate: string;
  endDate: string;
  fullpoint: string;
};

export default function CampaignCard({
  prefecture,
  city,
  offer,
  startDate,
  endDate,
  fullpoint,
}: CampaignCardProps) {
  const hasDate = startDate && endDate;

  return (
    <div className="border rounded-2xl shadow-sm hover:shadow-md transition p-4 bg-white min-w-[240px] max-w-[260px]">
      {/* 地域 */}
      <p className="text-sm text-gray-500 font-medium mb-1">
        <span className="text-base font-semibold text-gray-800">{prefecture}</span>{" "}
        <span className="text-sm text-gray-500">{city}</span>
      </p>

      {/* 還元率 */}
      <p className="text-sm text-gray-600 mb-1">
        最大 <span className="text-xl font-semibold text-rose-500">{offer}%</span> 還元
      </p>

      {/* 期間 */}
      {hasDate && (
        <p className="text-xs text-gray-500 mb-2">
          {formatJapaneseDate(startDate, "から", { omitYear: true })}〜
          {formatJapaneseDate(endDate, "まで", { omitYear: true })}
        </p>
      )}

      {/* 最大ポイント GET */}
      {fullpoint && (
        <p className="text-sm font-bold text-indigo-600 mt-2">
          最大 {Number(fullpoint).toLocaleString()} ポイント GET
        </p>
      )}
    </div>
  );
}
