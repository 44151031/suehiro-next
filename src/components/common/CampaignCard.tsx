// components/common/CampaignCard.tsx
import { formatJapaneseDate } from "@/lib/campaignUtils";

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

  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl shadow-md hover:shadow-lg transition p-4 w-full min-w-[240px] max-w-[280px]">
      {/* 地域 */}
      <p className="text-sm font-medium mb-1">
        <span className="text-base font-bold text-primary">{prefecture}</span>{" "}
        <span className="text-sm text-muted-foreground">{city}</span>
      </p>

      {/* 還元率 */}
      <p className="text-sm mb-1">
        <span className="text-base font-bold text-accent">{offer}%</span> 還元
      </p>

      {/* 表示期間 */}
      {period ? (
        <p className="text-xs text-muted-foreground mb-2">{period}</p>
      ) : hasDate ? (
        <p className="text-xs text-muted-foreground mb-2">
          {formatJapaneseDate(startDate, "から", { omitYear: true })}〜
          {formatJapaneseDate(endDate, "まで", { omitYear: true })}
        </p>
      ) : null}

      {/* 最大ポイント */}
      {fullpoint && (
        <p className="text-sm font-bold text-primary mt-2">
          最大{" "}
          <span className="text-lg font-extrabold text-accent">
            {Number(fullpoint).toLocaleString()}
          </span>{" "}
          pt
        </p>
      )}
    </div>
  );
}
