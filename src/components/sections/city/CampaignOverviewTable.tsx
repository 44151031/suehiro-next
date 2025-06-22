import { formatJapaneseDate } from "@/lib/campaignUtils";
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
    officialUrl, // ✅ 追加
  } = campaign;

  const onepay = calculateOnePay(Number(onepoint), offer);
  const fullpay = calculateFullPay(Number(fullpoint), offer);
  const paytime = calculatePayTime(fullpay, onepay);

  const payLabel = PayTypes[paytype].label;

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3 sm:p-8 mt-10">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        キャンペーン概要
      </h2>
      <div className="grid gap-y-4 text-sm sm:text-base">
        <Row label="対象" value={`${prefecture}${city}の対象店舗での${payLabel}支払い`} />
        <Row
          label="期間"
          value={`${formatJapaneseDate(startDate)} ～ ${formatJapaneseDate(endDate)}`}
        />
        <Row label="還元率" value={`${offer}%`} />
        <Row
          label={
            <>
              <span className="block sm:inline">1回あたりの</span>
              <span className="block sm:inline">付与上限</span>
            </>
          }
          value={`${formatNumber(onepoint)}円相当の${payLabel}ポイント`}
        />
        <Row
          label={
            <>
              <span className="block sm:inline">期間あたりの</span>
              <span className="block sm:inline">付与上限</span>
            </>
          }
          value={`${formatNumber(fullpoint)}円相当の${payLabel}ポイント`}
        />
        <Row
          label={
            <>
              <span className="block sm:inline">最大還元に</span>
              <span className="block sm:inline">必要な決済額</span>
            </>
          }
          value={`1回 ${formatNumber(onepay)}円 × ${paytime}回 = ${formatNumber(fullpay)}円`}
        />
        {officialUrl && (
          <Row
            label="自治体公式ページ"
            value={
              <a
                href={officialUrl}
                className="text-gray-500 underline overflow-hidden whitespace-nowrap truncate block"
                target="_blank"
                rel="noopener noreferrer nofollow"
                title={officialUrl}
              >
                {officialUrl}
              </a>
            }
          />
        )}
      </div>
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-gray-100 pb-2">
      <dt className="text-gray-600 font-medium w-1/3 sm:min-w-[13rem] whitespace-nowrap break-keep">
        {label}
      </dt>
      <dd className="text-gray-900 font-semibold text-left w-2/3 break-words">
        {value}
      </dd>
    </div>
  );
}
