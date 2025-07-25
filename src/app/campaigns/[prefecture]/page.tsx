// ✅ 修正済 PrefecturePage コンポーネント
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

type Props = {
  params: { prefecture: string };
};

export function generateMetadata({ params }: Props) {
  return getPrefectureMetadata(params.prefecture);
}

export default function PrefecturePage({ params }: Props) {
  const { prefecture } = params;

  const list = campaigns.filter((c) => c.prefectureSlug === prefecture);
  if (list.length === 0) return notFound();

  const prefectureName = list[0].prefecture;
  const activeList = getActiveCampaignsByPrefecture(prefecture, campaigns);
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

  // ✅ 表示対象の voucher 市区町村を先に抽出
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {activeList.length > 0 ? (
              active.length === 0 && upcoming > 0 ? (
                <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                  <span className="text-[17px] sm:text-xl font-semibold">
                    {prefectureName}では現在
                    <span className="text-green-700 font-bold"> {upcoming}件</span>
                    が開催予定となっています。開催日前に情報をチェックしておきましょう。
                  </span>
                </p>
              ) : (
                <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                  <span className="text-[17px] sm:text-xl font-semibold">
                    {prefectureName}では、現在開催中のキャンペーンは{" "}
                    <span className="text-orange-600 font-bold">{active.length}件</span>です。
                  </span>
                  <span className="ml-1 text-[17px] sm:text-xl font-semibold">
                    <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
                  </span>
                </p>
              )
            ) : (
              <p className="text-base sm:text-lg text-neutral-700 leading-snug font-semibold">
                現在、{prefectureName}で開催中または予定されているキャンペーンはありません。
              </p>
            )}
          </div>

          {activeList.length > 0 && (
            <div className="prefecture-page-card-container">
              <CampaignCardList campaigns={activeList} />
            </div>
          )}

          <div className="mb-6">
            <SNSShareButtons
              title={shareTitle}
              url={`https://paycancampaign.com/campaigns/${prefecture}`}
              hashtags={shareHashtags}
            />
          </div>

          {/* ✅ voucher 市区町村が存在する場合のみ表示 */}
          {voucherCities.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                {prefectureName}内のキャンペーンPayPay商品券
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {voucherCities.map(({ city, citySlug }) => (
                  <li key={citySlug} className="text-base">
                    <Link
                      href={`/campaigns/${prefecture}/${citySlug}`}
                      className="text-brand-primary underline hover:text-brand-primary/80"
                    >
                      {city}
                    </Link>
                    <Link
                      href={`/campaigns/${prefecture}/${citySlug}/paypay-voucher`}
                      className="ml-2 inline-block rounded bg-red-600 px-2 py-0.5 text-xs text-white"
                    >
                      商品券
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 同一エリアの他県キャンペーン */}
          {(() => {
            const currentPref = prefectures.find((p) => p.slug === prefecture);
            if (!currentPref) return null;

            const sameGroupPrefectures = prefectures
              .filter((p) => p.group === currentPref.group && p.slug !== prefecture)
              .map((p) => p.slug);

            const sameGroupCampaigns = campaigns
              .filter(
                (c) =>
                  sameGroupPrefectures.includes(c.prefectureSlug) &&
                  getCampaignStatus(c.startDate, c.endDate) !== "ended"
              )
              .sort((a, b) => {
                const aStatus = getCampaignStatus(a.startDate, a.endDate);
                const bStatus = getCampaignStatus(b.startDate, b.endDate);
                return (bStatus === "active" ? 1 : 0) - (aStatus === "active" ? 1 : 0);
              });

            if (sameGroupCampaigns.length === 0) return null;

            return (
              <section className="mt-16">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                  {currentPref.group}エリアの他県のキャンペーンもチェック！
                </h2>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {sameGroupCampaigns.slice(0, 6).map((c) => (
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
                          isActive={getCampaignStatus(c.startDate, c.endDate) === "active"}
                          showPrefecture={true}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })()}

          <BackNavigationButtons
            prefecture={prefectureName}
            prefectureSlug={prefecture}
          />
        </div>
      </div>
    </>
  );
}
