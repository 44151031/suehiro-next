import React from "react";
import { formatJapaneseDate } from "@/lib/campaignUtils";

type Props = {
  ticketUnit: string;
  purchasePrice: number;
  ticketAmount: number;
  maxUnits: number;
  campaigntitle: string;
  eligiblePersons: string;
  applicationUrl: string;
  applyStartDate: string;
  applyEndDate: string;
  resultAnnounceDate?: string;
  useEndDate: string;
};

export default function VoucherCampaignOverviewTable({
  ticketUnit,
  purchasePrice,
  ticketAmount,
  maxUnits,
  campaigntitle,
  eligiblePersons,
  applicationUrl,
  applyStartDate,
  applyEndDate,
  resultAnnounceDate,
  useEndDate,
}: Props) {
  const discount = Math.round(((ticketAmount - purchasePrice) / purchasePrice) * 100);

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3 sm:p-8 mt-10">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">商品券の概要</h2>
      <dl className="grid gap-y-4 text-sm sm:text-base">
        <Row label="キャンペーン名" value={campaigntitle} />
        <Row label="商品券販売価格" value={`1口 ${purchasePrice.toLocaleString()}円`} />
        <Row
          label="商品券の利用可能額"
          value={`1口 ${ticketAmount.toLocaleString()}円（${discount}%お得）`}
        />
        <Row label="購入上限" value={`${maxUnits}口まで`} />
        <Row label="対象者" value={eligiblePersons} />
        <Row
          label="申込期間"
          value={`${formatJapaneseDate(applyStartDate)} 10:00 ～ ${formatJapaneseDate(applyEndDate)}`}
        />
        {applicationUrl && (
          <Row
            label="申込ページ"
            value={
              <div className="max-w-full">
                <a
                  href={applicationUrl}
                  className="inline-block max-w-full text-blue-600 underline break-all whitespace-normal"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  title={applicationUrl}
                >
                  {applicationUrl}
                </a>
              </div>
            }
          />
        )}
        {resultAnnounceDate && (
          <Row label="抽選発表日" value={`${formatJapaneseDate(resultAnnounceDate)}以降`} />
        )}
        <Row label="商品券の利用期限" value={`${formatJapaneseDate(useEndDate)}の23:59まで`} />
      </dl>
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
    <div className="flex items-start gap-4 border-b border-gray-100 pb-2 last:border-b-0">
      <dt className="text-gray-600 font-medium w-1/3 sm:min-w-[13rem] whitespace-nowrap break-keep">
        {label}
      </dt>
      <dd className="text-gray-900 font-semibold text-left w-2/3 break-words break-all max-w-full">
        {value}
      </dd>
    </div>
  );
}
