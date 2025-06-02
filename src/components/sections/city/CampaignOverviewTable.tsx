// ✅ /components/sections/city/CampaignOverviewTable.tsx

import { formatJapaneseDate } from "@/lib/campaignUtils";
// ✅ 修正：PayTypeLabels → PayTypes に変更
import { PayTypes } from "@/lib/payType";
import { calculateOnePay, calculateFullPay, calculatePayTime } from "@/lib/campaignCalculations";
import type { Campaign } from "@/types/campaign";

// ✅ カンマ付き数値
function formatNumber(val: number | string) {
  return Number(val).toLocaleString("ja-JP");
}

export function CampaignOverviewTable({ campaign }: { campaign: Campaign }) {
  const {
    prefecture,
    city,
    startDate,
    endDate,
    offer,
    onepoint,
    fullpoint,
    paytype,
  } = campaign;

  const onepay = calculateOnePay(Number(onepoint), offer);
  const fullpay = calculateFullPay(Number(fullpoint), offer);
  const paytime = calculatePayTime(fullpay, onepay);

  // ✅ 修正箇所：ラベルを PayTypes から取得
  const payLabel = PayTypes[paytype].label;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-10">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        キャンペーン概要
      </h2>
      <div className="grid gap-y-4 text-sm sm:text-base">
        <Row label="対象エリア" value={`${prefecture}${city}の対象店舗`} />
        <Row
          label="期間"
          value={`${formatJapaneseDate(startDate)} ～ ${formatJapaneseDate(endDate)}`}
        />
        <Row label="還元率" value={`${offer}%`} />
        <Row
          label="1回あたりの付与上限"
          value={`${formatNumber(onepoint)}円相当の${payLabel}ポイント`}
        />
        <Row
          label="期間あたりの付与上限"
          value={`${formatNumber(fullpoint)}円相当の${payLabel}ポイント`}
        />
        <Row
          label="最大還元に必要な決済額"
          value={`1回 ${formatNumber(onepay)}円 × ${paytime}回 = ${formatNumber(fullpay)}円`}
        />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-2">
      <dt className="text-gray-600 font-medium min-w-[11rem] sm:min-w-[13rem] whitespace-nowrap">
        {label}
      </dt>
      <dd className="text-gray-900 font-semibold text-left break-words flex-1">
        {value}
      </dd>
    </div>
  );
}
