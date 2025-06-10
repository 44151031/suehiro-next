"use client";

import { campaigns } from "@/lib/campaignMaster";
import { filterCampaignsByStatus } from "@/lib/campaignUtils";
import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/sections/campaign/RegionCampaignSection";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";

export default function CampaignsArchiveContent() {
  const endedCampaigns = filterCampaignsByStatus(campaigns, "ended");

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="headline1">次回キャンペーン待ち一覧</h1>
        <p className="text-base leading-relaxed mb-4">
          現在は終了していますが、今後同じ自治体でキャンペーンが開催される可能性があります。これまでの傾向や内容を参考に、次回のチャンスを見逃さないようにこのページはご活用ください。
        </p>

        {/* ブランドアイコン省略（見た目は変更なし） */}

        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection
              key={group}
              groupName={group}
              overrideCampaigns={endedCampaigns}
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
