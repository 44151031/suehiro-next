// ✅ /components/common/CampaignCardList.tsx
import Link from "next/link";
import CampaignCard from "@/components/common/CampaignCard";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import type { Campaign } from "@/types/campaign";
import type { PayTypeId } from "@/lib/payType";

type Props = {
  campaigns: Campaign[];
  excludeCitySlug?: string;
};

export function CampaignCardList({ campaigns, excludeCitySlug }: Props) {
  const filtered = excludeCitySlug
    ? campaigns.filter((c) => c.citySlug !== excludeCitySlug)
    : campaigns;

  if (filtered.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((c) => {
        if (!c.paytype) return null;
        const paySlug = c.paytype as PayTypeId;

        return (
          <Link
            key={`${c.prefectureSlug}-${c.citySlug}-${paySlug}`}
            href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${paySlug}`}
            className="block transition-transform hover:scale-[1.02]">
            <CampaignCard
              prefecture={c.prefecture}
              city={c.city}
              offer={c.offer}
              fullpoint={c.fullpoint}
              startDate={c.startDate}
              endDate={c.endDate}
              period={
                c.startDate && c.endDate
                  ? `${formatJapaneseDate(c.startDate, { omitYear: true })}〜${formatJapaneseDate(
                      c.endDate,
                      { omitYear: true }
                    )}`
                  : ""
              }
              paytype={paySlug}
            />
          </Link>
        );
      })}
    </div>
  );
}
