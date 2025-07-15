"use client";

import { useState } from "react";
import { campaigns } from "@/lib/campaignMaster";
import { filterCampaignsByStatus } from "@/lib/campaignUtils";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/sections/campaign/RegionCampaignSection";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import Link from "next/link";

export default function CampaignsArchiveContent() {
  // 重複を排除し、startDateが最新のものを優先
  const uniqueCampaignsMap = new Map<string, typeof campaigns[number]>();
  campaigns.forEach((c) => {
    const key = `${c.prefectureSlug}-${c.citySlug}-${c.paytype}`;
    const existing = uniqueCampaignsMap.get(key);
    if (!existing || new Date(c.startDate) > new Date(existing.startDate)) {
      uniqueCampaignsMap.set(key, c);
    }
  });
  const uniqueCampaigns = Array.from(uniqueCampaignsMap.values());

  const endedCampaigns = filterCampaignsByStatus(uniqueCampaigns, "ended");

  // 支払いサービスのフィルター
  const [selectedPaytype, setSelectedPaytype] = useState<string>("all");
  const filteredCampaigns = endedCampaigns.filter((c) => {
    if (selectedPaytype === "all") return true;
    if (selectedPaytype === "other") {
      return !["paypay", "aupay", "rakutenpay", "dbarai"].includes(c.paytype);
    }
    return c.paytype === selectedPaytype;
  });

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="headline1">次回キャンペーン待ち一覧</h1>
        <p className="text-base leading-relaxed mb-4">
          現在は終了していますが、今後同じ自治体でキャンペーンが開催される可能性があります。これまでの傾向や内容を参考に、次回のチャンスを見逃さないようにこのページはご活用ください。
        </p>

        <div className="mt-6 mb-5 bg-white border border-neutral-300 rounded-xl shadow-sm px-6 py-4">
          <p className="text-base sm:text-lg font-medium text-neutral-500 leading-snug">
            現在、開催中・開催予定のキャンペーンを確認したい方は
            <Link href="/campaigns" className="text-blue-600 ml-1 hover:underline">
              全国のキャンペーン一覧
            </Link>
            をご覧ください。
          </p>
        </div>

        {/* 支払いサービスフィルター */}
        <div className="sticky top-16 z-30 bg-[#f8f7f2] pt-4 pb-3 mb-10">
          <div className="flex flex-wrap sm:flex-nowrap justify-end gap-3 sm:gap-6 px-2 sm:px-0 text-sm sm:text-base">
            {[
              { label: "すべて", value: "all" },
              { label: "PayPay", value: "paypay" },
              { label: "au PAY", value: "aupay" },
              { label: "楽天ペイ", value: "rakutenpay" },
              { label: "d払い", value: "dbarai" },
              { label: "その他", value: "other" },
            ].map(({ label, value }) => (
              <label key={value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="paytype"
                  value={value}
                  checked={selectedPaytype === value}
                  onChange={() => setSelectedPaytype(value)}
                  className="form-radio h-5 w-5 text-blue-600 border-gray-400 focus:ring-blue-600"
                />
                <span className="font-bold text-sm text-gray-600">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection
              key={group}
              groupName={group}
              overrideCampaigns={filteredCampaigns}
            />
          ))}
        </div>

        <div className="mt-4 mb-6">
          <SNSShareButtons
            url="https://paycancampaign.com/campaigns/archive"
            title="次回キャンペーン待ち一覧（アーカイブ）"
            hashtags={["再開待ち", "全国ポイント還元"]}
          />
        </div>

        <BackNavigationButtons />
      </div>
    </div>
  );
}
