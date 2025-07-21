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
        headline={`${cityName}の商品券キャンペーン（${campaigntitle}）`}
        articleDescription={`${prefName}${cityName}で実施されるプレミアム商品券の概要、販売条件、利用期間などを紹介。`}
        validFrom={applyStartDate}
        validThrough={applyEndDate}
        url={pageUrl}
        datePublished={datePublished}
        dateModified={modified}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {cityName}のPayPay商品券が最大{discountRate}％（{maxUnits}口購入で最大{formatNumber(maxDiscount)}円）お得
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-800">
              最終更新日：{formatJapaneseDate(modified)}｜ 公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}

          <p className="text-xs md:text-base leading-relaxed text-gray-800 mb-2">
            対象者の方がPayPayアプリから
            <span className="font-semibold">{formatJapaneseDate(applyStartDate)}10:00</span>
            から
            <span className="font-semibold">{formatJapaneseDate(applyEndDate)}</span>
            までに申し込みのうえ、当選された方（
            <span className="font-semibold">{formatJapaneseDate(resultAnnounceDate)}以降</span>
            ）は、当選発表後から
            <span className="font-semibold">{formatJapaneseDate(useEndDate)}の23:59</span>
            までに商品券を購入・利用いただけます。
            <br className="hidden md:block" />
            このページでは、ユーザーの方がポイ活しやすいように、キャンペーンの内容や、その他近隣エリアのキャンペーンをまとめて紹介しています。
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
            <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />
          </div>

          <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
            <h2 className="headline2">
              PayPay商品券概要｜{prefName}{cityName}のPayPay商品券とは？
            </h2>
            <p>
              <strong>{prefName}{cityName}「{campaigntitle}」</strong>は、
              <span className="text-brand-primary font-bold">
                {formatJapaneseDate(applyStartDate)}から{formatJapaneseDate(applyEndDate)}
              </span>
              までの申込期間中に、対象者が申し込みをして商品券を購入すると、
              最大で
              <span className="text-brand-primary font-bold">
                {formatNumber(maxDiscount)}円
              </span>
              お得になる商品券です。
            </p>
          </section>

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

          <VoucherApplicationFlow campaignUrl={pageUrl} />
          <VoucherRedemptionGuide />

          <div className="mt-8">
            <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />
          </div>

          {/* ✅ 他のPay系キャンペーン */}
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
