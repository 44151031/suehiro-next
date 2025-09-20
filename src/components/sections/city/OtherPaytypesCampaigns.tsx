/**
 * OtherPaytypesCampaigns.tsx
 *
 * 同一市区町村における他のPayタイプ（PayPay・auPAY・楽天ペイ等）が存在する場合、
 * リンクカード形式で一覧表示するセクション。
 * 現在表示中のPayタイプは除外。
 */

import Link from "next/link";
import { campaigns } from "@/lib/campaignMaster";
import { getCampaignStatus, CampaignStatus } from "@/lib/campaignUtils";
import CampaignLineCard from "@/components/common/CampaignLineCard";

type Props = {
  prefectureSlug: string;
  citySlug: string;
  currentPaytype: string;
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

  const diffStatus =
    statusOrder(getCampaignStatus(a.startDate, a.endDate)) -
    statusOrder(getCampaignStatus(b.startDate, b.endDate));
  if (diffStatus !== 0) return diffStatus;

  const diffDate =
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  if (diffDate !== 0) return diffDate;

  const brandA = brandPriority[a.paytype] ?? 99;
  const brandB = brandPriority[b.paytype] ?? 99;
  return brandA - brandB;
}

export default function OtherPaytypesCampaigns({
  prefectureSlug,
  citySlug,
  currentPaytype,
}: Props) {
  let otherPayCampaigns = campaigns.filter(
    (c) =>
      c.prefectureSlug === prefectureSlug &&
      c.citySlug === citySlug &&
      c.paytype !== currentPaytype &&
      getCampaignStatus(c.startDate, c.endDate) !== "ended"
  );

  if (otherPayCampaigns.length === 0) {
    return null;
  }

  // ✅ 並び替え
  otherPayCampaigns = otherPayCampaigns.sort(sortCampaigns);

  // ✅ 1件目から市区町村名・都道府県名を取得
  const { prefecture, city } = otherPayCampaigns[0];

  return (
    <section className="mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
        {prefecture}
        {city}の他の決済サービスの還元キャンペーンもチェック！
      </h2>
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {otherPayCampaigns.map((c) => {
          const isActive = getCampaignStatus(c.startDate, c.endDate) === "active";
          return (
            <li key={`${c.prefectureSlug}-${c.citySlug}-${c.paytype}`}>
              <Link
                href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`}
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
                  showPrefecture={false}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
