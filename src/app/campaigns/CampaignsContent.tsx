"use client";

import { useState } from "react";
import { campaigns } from "@/lib/campaignMaster";
import { getCampaignStatus } from "@/lib/campaignUtils";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/sections/campaign/RegionCampaignSection";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import Link from "next/link";
import CampaignsTopStructuredData from "@/components/structured/CampaignsTopStructuredData";

// ✅ 商品券関連
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { calculateVoucherDiscountRate, formatJapaneseDateOnly } from "@/lib/voucherUtils";

export default function CampaignsContent() {
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [showOnlyOver30Percent, setShowOnlyOver30Percent] = useState(false);
  const [showOnlyOver10000Yen, setShowOnlyOver10000Yen] = useState(false);

  const notEndedCampaigns = campaigns.filter(
    (c) => getCampaignStatus(c.startDate, c.endDate) !== "ended"
  );

  const filtered = notEndedCampaigns.filter((c) => {
    const status = getCampaignStatus(c.startDate, c.endDate);
    if (showOnlyActive && status !== "active") return false;
    if (showOnlyOver30Percent && c.offer < 30) return false;
    if (showOnlyOver10000Yen && Number(c.fullpoint) < 10000) return false;
    return true;
  });

  const activeVoucherCampaigns = voucherCampaignMaster
    .filter((v) => {
      const now = new Date();
      return (
        getCampaignStatus(v.startDate, v.endDate) !== "ended" &&
        new Date(v.applyEndDate) >= now // 申込終了日が未来のもののみ
      );
    })
    .sort((a, b) => new Date(a.applyStartDate).getTime() - new Date(b.applyStartDate).getTime());


  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <CampaignsTopStructuredData />

      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="headline1">全国のキャッシュレスキャンペーン一覧</h1>
        <CampaignTotalPointSummary campaigns={filtered} areaLabel="全国" />

        <p className="text-base leading-relaxed mb-4">
          日本全国の市区町村のPayPay、au PAY、楽天Pay、d払いのキャッシュレス還元キャンペーンをまとめています。
          開催中のキャンペーンから、開催予定のキャンペーンまでまとめていますので、計画的にポイントを貯めることが出来ます。
        </p>

        {/* ブランドアイコン */}
        <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
          {[
            { label: "PayPay", color: "#ef2a36", icon: "P" },
            { label: "au PAY", color: "#f58220", icon: "au" },
            { label: "楽天ペイ", color: "#bf0000", icon: "楽" },
            { label: "d払い", color: "#b11f27", icon: "d" },
            { label: "AEON Pay", color: "#524fa5", icon: "イ" },
          ].map(({ label, color, icon }) => (
            <div key={label} className="flex items-center">
              <span
                className="ml-1 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                {icon}
              </span>
              <span className="ml-2">{label}</span>
            </div>
          ))}
        </div>

        {/* フィルター */}
        <div className="sticky top-16 z-30 bg-[#f8f7f2] pt-4 pb-3 mb-10">
          <div className="flex flex-wrap sm:flex-nowrap justify-end gap-3 sm:gap-6 px-2 sm:px-0 text-sm sm:text-base">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyActive}
                onChange={() => setShowOnlyActive((prev) => !prev)}
                className="form-checkbox h-5 w-5 text-[#f7931e] border-gray-400 focus:ring-[#f7931e]"
              />
              <span className="font-bold text-sm text-gray-600">開催中のみ</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyOver30Percent}
                onChange={() => setShowOnlyOver30Percent((prev) => !prev)}
                className="form-checkbox h-5 w-5 text-green-600 border-gray-400 focus:ring-green-600"
              />
              <span className="font-bold text-sm text-gray-600">30%以上</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlyOver10000Yen}
                onChange={() => setShowOnlyOver10000Yen((prev) => !prev)}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-400 focus:ring-blue-600"
              />
              <span className="font-bold text-sm text-gray-600">1万円以上</span>
            </label>
          </div>
        </div>

        {/* エリア別セクション */}
        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection
              key={group}
              groupName={group}
              showOnlyActive={showOnlyActive}
              showOnlyOver30Percent={showOnlyOver30Percent}
              showOnlyOver10000Yen={showOnlyOver10000Yen}
              overrideCampaigns={filtered}
            />
          ))}
        </div>

        {/* ✅ 商品券キャンペーン */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">PayPay商品券キャンペーン</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeVoucherCampaigns.map((v) => {
              const rate = calculateVoucherDiscountRate(v.ticketAmount, v.purchasePrice);
              const benefit = (v.ticketAmount - v.purchasePrice) * v.maxUnits;
              const isActive =
                new Date(v.applyStartDate) <= new Date() && new Date() <= new Date(v.applyEndDate);
              const type = v.resultAnnounceDate ? "抽選" : "先着";
              const isAnyone = v.eligiblePersons === "居住地に関係なく12歳以上の全ての方";

              return (
                <Link
                  key={`${v.citySlug}-${v.paytype}`}
                  href={`/campaigns/${v.prefectureSlug}/${v.citySlug}/${v.paytype}`}
                  className="block border rounded-2xl p-4 shadow bg-white hover:shadow-md transition"
                >
                  <h3 className="font-bold text-base mb-1">
                    {v.prefecture}{v.city}{v.payTypeLabel}商品券

                    {/* 対象者ラベル */}
                    <span
                      className={`inline-block ml-2 text-xs font-bold px-2 py-1 rounded-full shadow ${isAnyone
                        ? "border bg-white text-red-600 border-red-600"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {isAnyone ? "誰でもOK（12歳〜）" : "居住者のみ"}
                    </span>

                    {/* 抽選 / 先着ラベル */}
                    <span
                      className={`inline-block ml-2 text-xs font-bold px-2 py-1 rounded-full shadow ${type === "先着"
                        ? "bg-red-600 text-white"
                        : "bg-sky-200 text-sky-800"
                        }`}
                    >
                      {type}
                    </span>
                  </h3>

                  {/* 申込期間と受付中表示 */}
                  <p className="text-sm text-gray-500 mb-1">
                    申込期間：{formatJapaneseDateOnly(v.applyStartDate)} ～ {formatJapaneseDateOnly(v.applyEndDate)}
                    {isActive && (
                      <span className="ml-2 inline-block text-xs bg-green-500 text-white px-2 py-0.5 rounded">
                        受付中
                      </span>
                    )}
                  </p>

                  {/* 還元率と最大お得額 */}
                  <p className="text-sm">
                    <span className="text-red-500 font-bold">{rate}%</span>お得／最大
                    <span className="text-red-500 font-bold">{benefit.toLocaleString()}円</span>お得
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ✅ 次回キャンペーン待ちリンク */}
        <div className="mt-10 text-right">
          <Link
            href="/campaigns/archive"
            className="inline-block text-sm font-semibold text-brand-primary hover:underline"
          >
            →次回キャンペーン待ち一覧
          </Link>
        </div>

        {/* SNSシェア */}
        <div className="mt-4 mb-6">
          <SNSShareButtons
            url="https://paycancampaign.com/campaigns"
            title="PayPay、au Pay、楽天ペイ、d払いなど全国のキャッシュレス還元キャンペーン一覧"
            hashtags={["paypay還元", "全国キャンペーン", "キャッシュレス"]}
          />
        </div>

        <BackNavigationButtons />
      </div>
    </div>
  );
}
