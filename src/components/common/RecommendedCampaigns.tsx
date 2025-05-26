import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { prefectures } from "@/lib/prefectures";
import CampaignCard from "@/components/common/CampaignCard";
import { formatJapaneseDate } from "@/lib/campaignUtils";

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
        const R = 6371; // km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
      <h2 className="text-xl font-semibold mb-6 text-gray-900">
        おすすめのPayPayキャンペーン
      </h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recommended.slice(0, 4).map((c) => (
          <Link
            key={`${c.prefectureSlug}-${c.citySlug}`}
            href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
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
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
