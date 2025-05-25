import { formatJapaneseDate, isNowInCampaignPeriod } from "@/lib/campaignUtils";

type CampaignCardProps = {
  prefecture: string;
  city: string;
  offer: number;
  startDate?: string;
  endDate?: string;
  period?: string;
  fullpoint?: string;
};

export default function CampaignCard({
  prefecture,
  city,
  offer,
  startDate,
  endDate,
  period,
  fullpoint,
}: CampaignCardProps) {
  const hasDate = startDate && endDate;
  const isActive = hasDate ? isNowInCampaignPeriod(startDate, endDate) : false;

  return (
    <div className="relative bg-white text-card-foreground border border-border rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 w-full min-w-[240px] max-w-[300px]">
      {/* ✅ 開催中バッジ */}
      {isActive && (
        <span className="absolute top-3 right-3 bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm tracking-wide">
          開催中
        </span>
      )}

      {/* 都道府県・市区町村 */}
      <p className="text-base font-medium mb-1 leading-tight">
        <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
          {prefecture}
        </span>
        <span className="text-base text-neutral-700"> {city}</span>
      </p>

      {/* 還元率 */}
      <p className="text-base mb-1 leading-tight">
        <span className="text-2xl font-extrabold text-accent">{offer}%</span> 還元
      </p>

      {/* キャンペーン期間 */}
      {period ? (
        <p className="text-sm text-neutral-700 leading-snug">{period}</p>
      ) : hasDate ? (
        <p className="text-sm text-neutral-700 leading-snug">
          {formatJapaneseDate(startDate, "から", { omitYear: true })}〜
          {formatJapaneseDate(endDate, "まで", { omitYear: true })}
        </p>
      ) : null}

      {/* 最大ポイント */}
      {fullpoint && (
        <p className="text-base font-semibold text-neutral-700 leading-tight flex items-baseline gap-1">
          <span>最大</span>
          <span className="text-3xl font-extrabold text-accent">
            {Number(fullpoint).toLocaleString()}
          </span>
          <span className="text-sm text-neutral-700">pt</span>
        </p>
      )}
    </div>
  );
}
