/**
 * RecommendedCampaigns.tsx
 *
 * 現在表示中のキャンペーン以外でおすすめのキャンペーンを最大6件表示するセクション。
 * 同一市区町村の別Payや、同一都道府県内の他市区町村を優先。
 * 足りない場合は近隣都道府県のキャンペーンを距離順に補完。
 */
import Link from "next/link";
import { campaigns } from "@/lib/campaignMaster";
import { prefectures } from "@/lib/prefectures";
import { isNowInCampaignPeriod, isCampaignActive } from "@/lib/campaignUtils";
import CampaignLineCard from "@/components/common/CampaignLineCard";

type Props = {
  prefectureSlug: string;
  citySlug: string;
  currentPaytype: string;
};

export function RecommendedCampaigns({ prefectureSlug, citySlug, currentPaytype }: Props) {
  const samePrefCampaigns = campaigns.filter(
    (c) =>
      c.prefectureSlug === prefectureSlug &&
      !(c.citySlug === citySlug && c.paytype === currentPaytype) &&
      isCampaignActive(c.endDate)
  );

  let recommended = [...samePrefCampaigns];

  if (recommended.length < 6) {
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
        const extra = campaigns.filter(
          (c) => c.prefectureSlug === pref.slug && isCampaignActive(c.endDate)
        );

        for (const c of extra) {
          if (recommended.length >= 6) break;
          recommended.push(c);
        }

        if (recommended.length >= 6) break;
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
        この場所から近いキャンペーン！せっかくならハシゴしよう！
      </h2>
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {recommended.slice(0, 6).map((c) => {
          const paySlug = c.paytype;
          if (!paySlug) return null;

          return (
            <li key={`${c.prefectureSlug}-${c.citySlug}-${paySlug}`}>
              <Link
                href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${paySlug}`}
                className="block"
              >
                <CampaignLineCard
                  prefecture={c.prefecture}
                  city={c.city}
                  startDate={c.startDate}
                  endDate={c.endDate}
                  offer={c.offer}
                  fullpoint={c.fullpoint}
                  onepoint={c.onepoint}
                  paytype={c.paytype}
                  isActive={isNowInCampaignPeriod(c.startDate, c.endDate)}
                  showPrefecture={true}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
