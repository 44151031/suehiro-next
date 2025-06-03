import { formatJapaneseDate, isNowInCampaignPeriod } from "@/lib/campaignUtils";
import { PayTypeId, PayTypes } from "@/lib/payType";

type CampaignCardProps = {
  prefecture: string;
  city: string;
  offer: number;
  startDate?: string;
  endDate?: string;
  period?: string;
  fullpoint?: string;
  paytype?: PayTypeId;
};

export default function CampaignCard({
  prefecture,
  city,
  offer,
  startDate,
  endDate,
  period,
  fullpoint,
  paytype,
}: CampaignCardProps) {
  const hasDate = startDate && endDate;
  const isActive = hasDate ? isNowInCampaignPeriod(startDate, endDate) : false;
  const paytypeLabel = paytype && PayTypes[paytype] ? PayTypes[paytype].label : "その他";

  return (
    <div className="relative w-4/5 sm:w-full min-w-[220px] max-w-[250px] p-6 border border-border rounded-2xl bg-white text-card-foreground shadow-lg hover:shadow-xl transition duration-300">
      {isActive && (
        <span className="absolute top-3 right-3 bg-accent text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm tracking-wide">
          開催中
        </span>
      )}

      <p className="text-base font-medium mb-1 leading-tight">
        <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
          {prefecture}
        </span>
        <span className="text-base text-neutral-900 font-extrabold"> {city}</span>
      </p>

      <p className="text-base mb-1 leading-tight">
        {paytypeLabel && (
          <span className="text-sm text-gray-800 mr-1 font-extrabold">{paytypeLabel}</span>
        )}
        <span className="text-2xl font-extrabold text-accent">{offer}%</span> 還元
      </p>

      {period ? (
        <p className="text-sm text-neutral-700 leading-snug">{period}</p>
      ) : hasDate ? (
        <p className="text-sm text-neutral-700 leading-snug">
          {formatJapaneseDate(startDate, "から", { omitYear: true })}〜
          {formatJapaneseDate(endDate, "まで", { omitYear: true })}
        </p>
      ) : null}

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
