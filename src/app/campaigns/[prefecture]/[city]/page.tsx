import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import {
  formatJapaneseDate,
  getCampaignStatus,
  CampaignStatus,
} from "@/lib/campaignUtils";
import CampaignTotalPointSummary from "@/components/common/CampaignTotalPointSummary";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import { CampaignCardList } from "@/components/common/CampaignCardList";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import { getCityMetadata } from "@/lib/metadataGenerators";
import CityCampaignStructuredData from "@/components/structured/CityCampaignStructuredData";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import Link from "next/link";
import CampaignLineCard from "@/components/common/CampaignLineCard";
import { getVoucherCampaignUrl } from "@/lib/voucherUtils";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster"; // ✅ 追加
import VoucherCampaignCardList from "@/components/common/VoucherCampaignCardList";

type Props = {
  params: { prefecture: string; city: string };
};

export function generateMetadata({ params }: Props) {
  return getCityMetadata(params.prefecture, params.city);
}

export default function CityCampaignsPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const { prefecture, city } = params;

  const list = campaigns.filter(
    (c) => c.prefectureSlug === prefecture && c.citySlug === city
  );

  const hasVoucherCampaign = voucherCampaignMaster.some(
    (v) => v.prefectureSlug === prefecture && v.citySlug === city
  );

  if (list.length === 0 && !hasVoucherCampaign) return notFound();

  const cityName =
    list[0]?.city ??
    voucherCampaignMaster.find(
      (v) => v.prefectureSlug === prefecture && v.citySlug === city
    )?.city ??
    "";

  const prefectureName =
    list[0]?.prefecture ??
    voucherCampaignMaster.find(
      (v) => v.prefectureSlug === prefecture && v.citySlug === city
    )?.prefecture ??
    "";

  const classified = list.map((c) => ({
    ...c,
    status: getCampaignStatus(c.startDate, c.endDate),
  }));

  const filteredList = classified.filter((c) => c.status !== "ended");
  const active = filteredList.filter((c) => c.status === "active");
  const upcoming = filteredList.filter((c) => c.status === "scheduled");

  const headline = `${cityName}のキャッシュレスキャンペーン情報`;
  const articleDescription = `Payキャンでは${prefectureName}${cityName}で現在・今後開催予定のキャッシュレス決済キャンペーン情報を掲載中。PayPay、楽天ペイ、d払い、auPAYなどの対象キャンペーンを網羅しています。`;
  const url = `https://paycancampaign.com/campaigns/${prefecture}/${city}`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city: cityName,
    style: "city",
  });

  // ✅ この市の「受付中 or 受付前」の商品券のみ（申込終了は除外）
  const now = new Date();
  const cityVoucherCampaigns = voucherCampaignMaster
    .filter(
      (v) =>
        v.prefectureSlug === prefecture &&
        v.citySlug === city &&
        now <= new Date(v.applyEndDate) // 申込終了を除外
    )
    .sort(
      (a, b) =>
        new Date(a.applyStartDate).getTime() - new Date(b.applyStartDate).getTime()
    );

  return (
    <>
      <CityCampaignStructuredData
        prefecture={prefectureName}
        prefectureSlug={prefecture}
        city={cityName}
        citySlug={city}
        headline={headline}
        articleDescription={articleDescription}
        url={url}
      />

      <main className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {cityName}のキャッシュレスキャンペーン一覧
          </h1>

          <CampaignTotalPointSummary
            campaigns={filteredList}
            areaLabel={cityName}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {filteredList.length > 0 ? (
              active.length === 0 && upcoming.length > 0 ? (
                <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                  <span className="text-[17px] sm:text-xl font-semibold">
                    {prefectureName}
                    {cityName}では現在
                    <span className="text-green-700 font-bold">
                      {" "}
                      {upcoming.length}件
                    </span>
                    が開催予定となっています。開催日に向けてお買い物を調整しましょう。
                  </span>
                </p>
              ) : (
                <p className="text-base sm:text-lg text-neutral-700 leading-snug">
                  <span className="text-[17px] sm:text-xl font-semibold">
                    {prefectureName}
                    {cityName}では、現在{" "}
                    <span className="text-orange-600 font-bold">
                      {active.length}件
                    </span>{" "}
                    のキャンペーンが開催中です。
                  </span>
                  <span className="ml-1 text-[17px] sm:text-xl font-semibold">
                    <span className="text-green-700 font-bold">
                      {upcoming.length}件
                    </span>{" "}
                    は開催予定となっています。
                  </span>
                </p>
              )
            ) : (
              <p className="text-base sm:text-lg text-neutral-700 leading-snug font-semibold">
                現在、{prefectureName}
                {cityName}で実施中または予定されているキャンペーンはありません。
              </p>
            )}
          </div>

          {filteredList.length > 0 && (
            <div className="city-page-card-container">
              <CampaignCardList campaigns={filteredList} />
            </div>
          )}

          {filteredList.length === 0 && (
            <RecommendedCampaigns
              prefectureSlug={prefecture}
              citySlug={city}
              city={cityName}
            />
          )}

          <SNSShareButtons url={url} title={shareTitle} hashtags={shareHashtags} />

          {/* ✅ 商品券（受付中 + 受付前） */}
          {cityVoucherCampaigns.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                {prefectureName}{cityName}のPayPay商品券キャンペーン
              </h2>
              <VoucherCampaignCardList campaigns={cityVoucherCampaigns} />
            </section>
          )}

          {(() => {
            const otherPrefectureCampaigns = campaigns
              .filter(
                (c) =>
                  c.prefectureSlug === prefecture &&
                  c.citySlug !== city &&
                  getCampaignStatus(c.startDate, c.endDate) !== "ended"
              )
              .map((c) => ({
                ...c,
                status: getCampaignStatus(c.startDate, c.endDate),
              }))
              .sort((a, b) => {
                const order: CampaignStatus[] = ["scheduled", "active", "ended"];
                return order.indexOf(a.status) - order.indexOf(b.status);
              });

            if (otherPrefectureCampaigns.length === 0) return null;

            return (
              <section className="mt-16">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                  {prefectureName}内の他のキャンペーンもチェック！
                </h2>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {otherPrefectureCampaigns.slice(0, 6).map((c) => (
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
                          showPrefecture={false}
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
      </main>
    </>
  );
}
