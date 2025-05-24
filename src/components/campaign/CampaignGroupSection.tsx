import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { prefectures } from "@/lib/prefectures";
import { isCampaignActive, formatJapaneseDate } from "@/lib/campaignUtils";
import CampaignCard from "@/components/common/CampaignCard";

type CampaignGroupSectionProps = {
  groupName: string;
};

export default function CampaignGroupSection({
  groupName,
}: CampaignGroupSectionProps) {
  const groupPrefectures = prefectures.filter(
    (p) => p.group === groupName
  );

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{groupName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {groupPrefectures.map((pref) => {
          const prefCampaigns = campaigns
            .filter(
              (c) =>
                c.prefectureSlug === pref.slug &&
                isCampaignActive(c.endDate)
            )
            .sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
            );

          if (prefCampaigns.length === 0) return null;

          return (
            <div key={pref.slug}>
              <h3 className="text-lg font-semibold mb-3">{pref.name}</h3>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {prefCampaigns.map((c) => (
                  <Link
                    key={`${c.prefectureSlug}-${c.citySlug}`}
                    href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
                    className="min-w-[240px] block"
                  >
                    <CampaignCard
                      prefecture={c.prefecture}
                      city={c.city}
                      offer={c.offer}
                      period={`${formatJapaneseDate(
                        c.startDate,
                        "から"
                      )} ${formatJapaneseDate(c.endDate, "まで")}`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
