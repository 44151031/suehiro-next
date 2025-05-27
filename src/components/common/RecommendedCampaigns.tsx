import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { prefectures } from "@/lib/prefectures";
import { isNowInCampaignPeriod, formatJapaneseDate } from "@/lib/campaignUtils";
import CampaignLineCard from "@/components/common/CampaignLineCard";

type Props = {
  prefectureSlug: string;
  citySlug: string;
};

export function RecommendedCampaigns({ prefectureSlug, citySlug }: Props) {
  const samePrefCampaigns = campaigns.filter(
    (c) => c.prefectureSlug === prefectureSlug && c.citySlug !== citySlug
  );

  let recommended = [...samePrefCampaigns];

  if (recommended.length < 4) {
    const currentPref = prefectures.find((p) => p.slug === prefectureSlug);
    if (currentPref) {
      const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
      };

      const nearbyPrefectures = prefectures
        .filter((p) => p.slug !== prefectureSlug)
        .map((p) => ({
          ...p,
          distance: distance(currentPref.lat, currentPref.lng, p.lat, p.lng),
        }))
        .sort((a, b) => a.distance - b.distance);

      for (const pref of nearbyPrefectures) {
        const extra = campaigns.filter((c) => c.prefectureSlug === pref.slug);
        for (const c of extra) {
          if (recommended.length >= 4) break;
          recommended.push(c);
        }
        if (recommended.length >= 4) break;
      }
    }
  }

  if (recommended.length === 0) {
    return (
      <p className="text-center text-gray-600 text-base">
        他のキャンペーンは見つかりませんでした。
      </p>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
        おすすめのPayPayキャンペーン
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommended.slice(0, 4).map((c) => (
          <li key={`${c.prefectureSlug}-${c.citySlug}`}>
            <Link href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}>
              <CampaignLineCard
                prefecture={c.prefecture} // ✅ 都道府県も表示
                city={c.city}
                startDate={c.startDate}
                endDate={c.endDate}
                offer={c.offer}
                fullpoint={c.fullpoint}
                onepoint={c.onepoint}
                isActive={isNowInCampaignPeriod(c.startDate, c.endDate)}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
