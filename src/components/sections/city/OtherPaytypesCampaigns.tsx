/**
 * OtherPaytypesCampaigns.tsx
 *
 * 同一市区町村における他のPayタイプ（PayPay・auPAY・楽天ペイ等）が存在する場合、
 * リンクカード形式で一覧表示するセクション。
 * 現在表示中のPayタイプは除外。
 */

import Link from "next/link";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels } from "@/lib/payType";
import { getCampaignStatus } from "@/lib/campaignUtils";
import CampaignLineCard from "@/components/common/CampaignLineCard";

type Props = {
  prefectureSlug: string;
  citySlug: string;
  currentPaytype: string;
};

export default function OtherPaytypesCampaigns({
  prefectureSlug,
  citySlug,
  currentPaytype,
}: Props) {
  const otherPayCampaigns = campaigns.filter(
    (c) =>
      c.prefectureSlug === prefectureSlug &&
      c.citySlug === citySlug &&
      c.paytype !== currentPaytype &&
      getCampaignStatus(c.startDate, c.endDate) !== "ended"
  );

  if (otherPayCampaigns.length === 0) {
    return null;
  }

  // ✅ 1件目から市区町村名・都道府県名を取得
  const { prefecture, city } = otherPayCampaigns[0];

  return (
    <section className="mt-16">
      <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
        {prefecture}{city}の他の決済サービスの還元キャンペーンもチェック！
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
