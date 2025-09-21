// /app/campaigns/[prefecture]/[city]/[pay]/VoucherCampaignPage.tsx
import { notFound } from "next/navigation";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import VoucherCampaignStructuredData from "@/components/structured/VoucherCampaignStructuredData";
import VoucherCampaignOverviewTable from "@/components/sections/voucher/VoucherCampaignOverviewTable";
import VoucherCampaignSummaryCard from "@/components/sections/voucher/VoucherCampaignSummaryCard";
import VoucherCampaignHighlight from "@/components/sections/voucher/VoucherCampaignHighlight";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { calculateVoucherDiscountRate } from "@/lib/voucherUtils";
import { VoucherApplicationFlow } from "@/components/sections/voucher/VoucherApplicationFlow";
import { VoucherRedemptionGuide } from "@/components/sections/voucher/VoucherRedemptionGuide";
import OtherPaytypesCampaigns from "@/components/sections/city/OtherPaytypesCampaigns";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import AdUnit from "@/components/common/AdUnit";
export { generateVoucherMetadata as generateMetadata } from "@/lib/voucherMetadateGenerators";

const formatNumber = (num: number) => Number(num).toLocaleString("ja-JP");

export default function VoucherCampaignPage({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}) {
  const { prefecture, city, pay } = params;

  const campaign = voucherCampaignMaster.find(
    (c) =>
      c.prefectureSlug === prefecture &&
      c.citySlug === city &&
      c.paytype === pay
  );

  if (!campaign) return notFound();

  const {
    prefecture: prefName,
    city: cityName,
    campaigntitle,
    purchasePrice,
    ticketAmount,
    maxUnits,
    applyStartDate,
    applyEndDate,
    useEndDate,
    resultAnnounceDate,
    datePublished,
    dateModified,
    prefectureSlug,
    citySlug,
    eligiblePersons,
    applicationUrl,
  } = campaign;

  const modified = dateModified ?? datePublished;
  const discountRate = calculateVoucherDiscountRate(ticketAmount, purchasePrice);
  const maxDiscount = (ticketAmount - purchasePrice) * maxUnits;
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${pay}`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city: cityName,
    payLabel: "商品券",
    offer: discountRate,
    style: "voucher",
  });

  return (
    <>
      <VoucherCampaignStructuredData
        prefecture={prefName}
        prefectureSlug={prefectureSlug}
        city={cityName}
        citySlug={citySlug}
        paytype={pay}
        // H1と意味合わせ：還元ではなく「お得」訴求
        headline={`${cityName}のPayPay商品券（${campaigntitle}）`}
        articleDescription={`${prefName}${cityName}の${campaigntitle}は、${formatJapaneseDate(
          applyStartDate
        )}〜${formatJapaneseDate(
          applyEndDate
        )}にアプリ申込、当選後に購入・利用可。最大${discountRate}％お得（${maxUnits}口で最大${formatNumber(
          maxDiscount
        )}円）、利用期限は${formatJapaneseDate(
          useEndDate
        )} 23:59。本ページでは対象者・申込方法・購入手順・使い方・注意点と周辺キャンペーンを解説。`}
        validFrom={applyStartDate}
        validThrough={applyEndDate}
        url={pageUrl}
        datePublished={datePublished}
        dateModified={modified}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          {/* ✅ H1：対象店舗は出さず、「お得・申込・利用」に寄せる */}
          <h1 className="headline1">
            {cityName}のPayPay商品券2025｜最大{discountRate}％お得！（{maxUnits}
            口購入で最大{formatNumber(maxDiscount)}円）
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-800">
              最終更新日：{formatJapaneseDate(modified)}｜ 公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}

          {/* ✅ 導入文A（万能・指名検索向け）に準拠／タイトルをマスタの campaigntitle で表示 */}
          <p className="text-xs md:text-base leading-relaxed text-gray-800 mb-2">
            {prefName}
            {cityName}の<strong>「{campaigntitle}」</strong>
            は、
            <span className="font-semibold">
              {formatJapaneseDate(applyStartDate)}
            </span>
            〜
            <span className="font-semibold">
              {formatJapaneseDate(applyEndDate)}
            </span>
            に<strong>PayPayアプリから申込</strong>、当選後に<strong>購入・利用</strong>
            できます
            {resultAnnounceDate && (
              <>
                （当選発表：
                <span className="font-semibold">
                  {formatJapaneseDate(resultAnnounceDate)}
                </span>
                以降）
              </>
            )}
            。<strong>最大{discountRate}%お得</strong>（
            {maxUnits}
            口で<strong>最大{formatNumber(maxDiscount)}円</strong>）、
            <strong>
              利用期限は{formatJapaneseDate(useEndDate)} 23:59
            </strong>
            。本ページでは<strong>対象者・申込方法・購入手順・使い方・注意点</strong>
            を最短で理解できるように解説し、<strong>周辺自治体の関連キャンペーン</strong>
            もまとめて比較。<strong>いつから・いつまで・どう使うか</strong>
            がこの1ページで分かります。
          </p>

          <div className="my-6">
            <VoucherCampaignSummaryCard campaign={campaign} />
          </div>

          <VoucherCampaignHighlight
            targetAudience={eligiblePersons}
            resultAnnounceDate={resultAnnounceDate}
            applicationUrl={applicationUrl}
            applicationStart={applyStartDate}
            applicationEnd={applyEndDate}
            usageEnd={useEndDate}
          />

          <div className="mt-8">
            <SNSShareButtons
              url={pageUrl}
              title={shareTitle}
              hashtags={shareHashtags}
            />
          </div>

          <AdUnit />

          {/* ===== H2：概要（商品券とは？） ===== */}
          <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
            <h2 className="headline2">
              {prefName}
              {cityName}のPayPay商品券とは？
            </h2>
            <p>
              <strong>
                {prefName}
                {cityName}「{campaigntitle}」
              </strong>
              は、申込期間中に対象者が申し込み、当選後に購入できるプレミアム商品券（PayPay商品券）です。最大で
              <span className="text-brand-primary font-bold">
                {formatNumber(maxDiscount)}円
              </span>
              お得にお買い物ができます。
            </p>
          </section>

          {/* ===== H2：概要テーブル ===== */}
          <VoucherCampaignOverviewTable
            purchasePrice={purchasePrice}
            resultAnnounceDate={resultAnnounceDate}
            ticketAmount={ticketAmount}
            maxUnits={maxUnits}
            campaigntitle={campaigntitle}
            eligiblePersons={eligiblePersons}
            applyStartDate={applyStartDate}
            applyEndDate={applyEndDate}
            useEndDate={useEndDate}
            applicationUrl={applicationUrl}
          />

          {/* ===== H2：申込フロー ===== */}
          <section className="mt-10">
            <h2 className="headline2">申込方法（ステップ解説）</h2>
            <VoucherApplicationFlow campaignUrl={pageUrl} />
          </section>

          {/* ===== H2：利用方法 ===== */}
          <section className="mt-10">
            <h2 className="headline2">利用方法（支払いの流れ）</h2>
            <VoucherRedemptionGuide />
          </section>

          <div className="mt-8">
            <SNSShareButtons
              url={pageUrl}
              title={shareTitle}
              hashtags={shareHashtags}
            />
          </div>

          {/* ✅ 他のPay系キャンペーン（内部回遊） */}
          <OtherPaytypesCampaigns
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
            currentPaytype={pay}
          />

          {/* ✅ レコメンド */}
          <div className="mt-20">
            <RecommendedCampaigns
              prefectureSlug={prefectureSlug}
              citySlug={citySlug}
              currentPaytype={pay}
              city={cityName}
            />
          </div>

          {/* ✅ 戻るボタン */}
          <BackNavigationButtons
            prefecture={prefName}
            prefectureSlug={prefectureSlug}
          />
        </main>
      </div>
    </>
  );
}
