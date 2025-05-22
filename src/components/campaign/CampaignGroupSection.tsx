// /components/campaign/CampaignGroupSection.tsx

import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { prefectures } from "@/lib/prefectures";
import { isCampaignActive, formatJapaneseDate } from "@/lib/campaignUtils";

type CampaignGroupSectionProps = { groupName: string };

export default function CampaignGroupSection({ groupName }: CampaignGroupSectionProps) {
  const groupPrefectures = prefectures.filter(p => p.group === groupName);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{groupName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {groupPrefectures.map(pref => {
          const prefCampaigns = campaigns
            .filter(c => c.prefectureSlug === pref.slug && isCampaignActive(c.endDate))
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

          if (prefCampaigns.length === 0) return null;

          return (
            <div key={pref.slug}>
              <h3 className="text-lg font-semibold mb-2">{pref.name}</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {prefCampaigns.map(c => (
                  <Link
                    key={`${c.prefectureSlug}-${c.citySlug}`}
                    href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
                    className="min-w-[200px] border rounded p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="font-semibold mb-2">{c.offer}</h4>
                    <p className="text-sm text-gray-600">{c.prefecture} {c.city}</p>
                    <p className="text-sm text-gray-500">
                      {formatJapaneseDate(c.startDate, "から")} 〜 {formatJapaneseDate(c.endDate, "まで")}
                    </p>
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
