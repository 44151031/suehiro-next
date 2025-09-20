// ✅ 修正版 PrefecturePage コンポーネント
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import {
  getCampaignStatus,
  getActiveCampaignsByPrefecture,
  CampaignStatus,
} from "@/lib/campaignUtils";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import { CampaignCardList } from "@/components/common/CampaignCardList";
import { getPrefectureMetadata } from "@/lib/metadataGenerators";
import PrefectureCampaignStructuredData from "@/components/structured/PrefectureCampaignStructuredData";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import Link from "next/link";
import CampaignLineCard from "@/components/common/CampaignLineCard";
import { prefectures } from "@/lib/prefectures";
import { hasVoucherCampaign } from "@/lib/voucherUtils";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import VoucherCampaignCardList from "@/components/common/VoucherCampaignCardList";

// ブランドごとの並び順
const brandPriority: Record<string, number> = {
  paypay: 1,
  rakutenpay: 2,
  dbarai: 3,
  aupay: 4,
  aeonpay: 5,
};

// ステータス優先度
function statusOrder(status: CampaignStatus) {
  if (status === "active") return 0;
  if (status === "upcoming") return 1;
  return 2;
}

// キャンペーンソート関数
function sortCampaigns(list: typeof campaigns) {
  return [...list].sort((a, b) => {
    const aStatus = getCampaignStatus(a.startDate, a.endDate);
    const bStatus = getCampaignStatus(b.startDate, b.endDate);

    const statusDiff = statusOrder(aStatus) - statusOrder(bStatus);
    if (statusDiff !== 0) return statusDiff;

    const dateDiff =
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    if (dateDiff !== 0) return dateDiff;

    const brandA = brandPriority[a.paytype] ?? 99;
    const brandB = brandPriority[b.paytype] ?? 99;
    return brandA - brandB;
  });
}

type Props = {
  params: { prefecture: string };
};

export function generateMetadata({ params }: Props) {
  return getPrefectureMetadata(params.prefecture);
}

export default function PrefecturePage({ params }: Props) {
  const { prefecture } = params;

  const list = campaigns.filter((c) => c.prefectureSlug === prefecture);
  const prefectureName =
    list[0]?.prefecture ?? prefectures.find((p) => p.slug === prefecture)?.name ?? prefecture;

  // ✅ ソートを適用
  const activeList = sortCampaigns(
    getActiveCampaignsByPrefecture(prefecture, campaigns)
  );

  const active = activeList.filter(
    (c) => getCampaignStatus(c.startDate, c.endDate) === "active"
  );
  const upcoming = activeList.length - active.length;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    prefecture: prefectureName,
    style: "prefecture",
  });

  const cityMap = new Map<string, { city: string; citySlug: string }>();
  campaigns.forEach((c) => {
    if (c.prefectureSlug === prefecture && !cityMap.has(c.citySlug)) {
      cityMap.set(c.citySlug, { city: c.city, citySlug: c.citySlug });
    }
  });

  const now = new Date();
  const activeOrUpcomingVoucherCampaigns = voucherCampaignMaster
    .filter(
      (v) =>
        v.prefectureSlug === prefecture &&
        now <= new Date(v.applyEndDate)
    )
    .sort(
      (a, b) =>
        new Date(a.applyStartDate).getTime() -
        new Date(b.applyStartDate).getTime()
    );

  const voucherCities = [...cityMap.values()].filter(({ citySlug }) =>
    hasVoucherCampaign(prefecture, citySlug)
  );

  return (
    <>
      <PrefectureCampaignStructuredData
        prefecture={prefectureName}
        prefectureSlug={prefecture}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {prefectureName}のキャッシュレスキャンペーン一覧
          </h1>

          <CampaignTotalPointSummary
            campaigns={activeList}
            areaLabel={prefectureName}
          />

          {/* 説明テキスト部分省略（元のまま） */}

          {activeList.length > 0 && (
            <div className="prefecture-page-card-container">
              <CampaignCardList campaigns={activeList} />
            </div>
          )}

          {/* ✅ 商品券キャンペーン */}
          {activeOrUpcomingVoucherCampaigns.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                {prefectureName}内のPayPay商品券キャンペーン
              </h2>
              <VoucherCampaignCardList campaigns={activeOrUpcomingVoucherCampaigns} />
            </section>
          )}

          <div className="mb-6">
            <SNSShareButtons
              title={shareTitle}
              url={`https://paycancampaign.com/campaigns/${prefecture}`}
              hashtags={shareHashtags}
            />
          </div>

          {/* 他県キャンペーン省略（元のまま） */}

          <BackNavigationButtons
            prefecture={prefectureName}
            prefectureSlug={prefecture}
          />
        </div>
      </div>
    </>
  );
}
