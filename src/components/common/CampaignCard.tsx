import { formatJapaneseDate, getCampaignStatus } from "@/lib/campaignUtils";
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
  const status = hasDate ? getCampaignStatus(startDate, endDate) : null;
  const isActive = status === "active";

  const paytypeData = paytype ? PayTypes[paytype] : undefined;
  const paytypeLabel = paytypeData?.label ?? "その他";
  const paytypeColor = paytypeData?.badge.bg ?? "#333";

  return (
    <div className="relative w-[90%] sm:w-full max-w-[320px] px-4 py-6 border border-border rounded-2xl bg-white text-card-foreground shadow-lg hover:shadow-xl transition duration-300 mx-auto text-[clamp(0.85rem,2vw,1rem)]">
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
          <span
            className="text-sm mr-1 font-extrabold"
            style={{ color: paytypeColor }}
          >
            {paytypeLabel}
          </span>
        )}
        <span className="text-2xl font-extrabold text-accent">{offer}%</span> 還元
      </p>

      {period ? (
        <p className="text-sm text-neutral-700 leading-snug">{period}</p>
      ) : hasDate ? (
        <p className="text-sm text-neutral-700 leading-snug">
          {formatJapaneseDate(startDate, { omitYear: true })}〜
          {formatJapaneseDate(endDate, { omitYear: true })}
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
