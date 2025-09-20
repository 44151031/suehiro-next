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
import { getCampaignStatus, CampaignStatus } from "@/lib/campaignUtils";
import CampaignLineCard from "@/components/common/CampaignLineCard";

type Props = {
  prefectureSlug: string;
  citySlug: string;
  currentPaytype?: string;
  city: string;
};

// ✅ ブランド並び順
const brandPriority: Record<string, number> = {
  paypay: 1,
  rakutenpay: 2,
  dbarai: 3,
  aupay: 4,
  aeonpay: 5,
};

// ✅ ソート関数: 開催中 > 未来、開始日順、同日ならブランド順
function sortCampaigns(a: any, b: any) {
  const statusOrder = (s: CampaignStatus) =>
    s === "active" ? 0 : s === "scheduled" ? 1 : 2;

  const diffStatus = statusOrder(getCampaignStatus(a.startDate, a.endDate)) -
    statusOrder(getCampaignStatus(b.startDate, b.endDate));
  if (diffStatus !== 0) return diffStatus;

  const diffDate =
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  if (diffDate !== 0) return diffDate;

  const brandA = brandPriority[a.paytype] ?? 99;
  const brandB = brandPriority[b.paytype] ?? 99;
  return brandA - brandB;
}

export function RecommendedCampaigns({
  prefectureSlug,
  citySlug,
  currentPaytype,
  city,
}: Props) {
  const samePrefCampaigns = campaigns.filter(
    (c) =>
      c.prefectureSlug === prefectureSlug &&
      !(c.citySlug === citySlug && c.paytype === currentPaytype) &&
      getCampaignStatus(c.startDate, c.endDate) !== "ended"
  );

  let recommended = [...samePrefCampaigns];

  if (recommended.length < 6) {
    const currentPref = prefectures.find((p) => p.slug === prefectureSlug);

    if (currentPref) {
      const distance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
      ) => {
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
          (c) =>
            c.prefectureSlug === pref.slug &&
            getCampaignStatus(c.startDate, c.endDate) !== "ended"
        );

        for (const c of extra) {
          if (recommended.length >= 6) break;
          recommended.push(c);
        }

        if (recommended.length >= 6) break;
      }
    }
  }

  // ✅ 並び替えを適用
  recommended = recommended.sort(sortCampaigns);

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
        {city}近隣のおすすめキャンペーン！せっかくならハシゴしよう！
      </h2>
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {recommended.slice(0, 6).map((c) => {
          const paySlug = c.paytype;
          if (!paySlug) return null;

          const isActive =
            getCampaignStatus(c.startDate, c.endDate) === "active";

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
                  isActive={isActive}
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
