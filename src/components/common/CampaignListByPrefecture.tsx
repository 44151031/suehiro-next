import Link from "next/link";
import CampaignCard from "@/components/common/CampaignCard";
import { campaigns } from "@/lib/campaignMaster";
import { formatJapaneseDate } from "@/lib/campaignUtils";

type Props = {
  prefectureSlug: string;
  excludeCitySlug?: string;
};

export function CampaignListByPrefecture({ prefectureSlug, excludeCitySlug }: Props) {
  const list = campaigns.filter(
    (c) => c.prefectureSlug === prefectureSlug && c.citySlug !== excludeCitySlug
  );

  if (list.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {list.map((c) => (
        <Link
          key={`${c.prefectureSlug}-${c.citySlug}-${c.paytype}`}
          href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`}
          className="block transition-transform hover:scale-[1.02]"
        >
          <CampaignCard
            prefecture={c.prefecture}
            city={c.city}
            offer={c.offer}
            fullpoint={c.fullpoint}
            startDate={c.startDate}
            endDate={c.endDate}
            period={
              c.startDate && c.endDate
                ? `${formatJapaneseDate(c.startDate, undefined, { omitYear: true })}〜${formatJapaneseDate(c.endDate, undefined, { omitYear: true })}`
                : ""
            }
            paytype={c.paytype}
          />
        </Link>
      ))}
    </div>
  );
}
