"use client";

import Link from "next/link";
import { VoucherCampaign } from "@/types/voucher";
import { calculateVoucherDiscountRate, formatJapaneseDateOnly } from "@/lib/voucherUtils";

type Props = {
  campaign: VoucherCampaign;
};

export default function VoucherCampaignCard({ campaign }: Props) {
  const start = new Date(campaign.applyStartDate);
  const end = new Date(campaign.applyEndDate);
  const now = new Date();
  const isActive = now >= start && now <= end;

  const ticketAmount = Number(campaign.ticketAmount ?? 0);
  const purchasePrice = Number(campaign.purchasePrice ?? 0);
  const maxUnits = Number(campaign.maxUnits ?? 0);
  const rate = calculateVoucherDiscountRate(ticketAmount, purchasePrice);
  const benefit = Math.max(ticketAmount - purchasePrice, 0) * maxUnits;

  const type = campaign.resultAnnounceDate ? "抽選" : "先着";

  let eligibilityLabel = "居住者のみ";
  if (campaign.eligiblePersons?.includes("居住地に関係なく")) {
    eligibilityLabel = "誰でもOK(年齢制限有)";
  }

  const href = `/campaigns/${campaign.prefectureSlug}/${campaign.citySlug}/${campaign.paytype}`;

  return (
    <Link
      href={href}
      className="
        group relative block border rounded-2xl p-4 bg-white shadow
        transition duration-300 will-change-transform
        hover:-translate-y-0.5 hover:shadow-xl
      "
    >
      <h3 className="font-bold text-base mb-1">
        {campaign.prefecture}
        {campaign.city}
        {campaign.payTypeLabel}商品券

        {/* 対象者ラベル */}
        <span
          className={`inline-block ml-2 text-xs font-bold px-2 py-1 rounded-full shadow ${
            eligibilityLabel.includes("誰でも")
              ? "border bg-white text-red-600 border-red-600"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {eligibilityLabel}
        </span>

        {/* 抽選 / 先着ラベル */}
        <span
          className={`inline-block ml-2 text-xs font-bold px-2 py-1 rounded-full shadow ${
            type === "先着" ? "bg-green-500 text-white" : "bg-sky-200 text-sky-800"
          }`}
        >
          {type}
        </span>
      </h3>

      {/* 申込期間と受付中表示（受付前はバッジなし） */}
      <p className="text-sm text-gray-500 mb-1">
        申込期間：{formatJapaneseDateOnly(campaign.applyStartDate)} ～ {formatJapaneseDateOnly(campaign.applyEndDate)}
        {isActive && (
          <span className="ml-2 inline-block text-xs bg-red-600 text-white px-2 py-0.5 rounded">
            受付中
          </span>
        )}
      </p>

      {/* ✅ 元の表現を維持 */}
      <p className="text-sm">
        <span className="text-red-500 font-bold">{rate}%</span>お得／最大
        <span className="text-red-500 font-bold">{benefit.toLocaleString()}円</span>お得
      </p>

      {/* 常時表示の右矢印（ホバーでほんの少しだけ動く） */}
      <span
        aria-hidden
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-neutral-400 transition-transform duration-300 group-hover:translate-x-0.5"
      >
        ›
      </span>
    </Link>
  );
}
