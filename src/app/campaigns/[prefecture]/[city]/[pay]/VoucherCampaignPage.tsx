// /app/campaigns/[prefecture]/[city]/[pay]/VoucherCampaignPage.tsx
import { notFound } from "next/navigation";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import VoucherCampaignStructuredData from "@/components/structured/VoucherCampaignStructuredData";
import VoucherCampaignOverviewTable from "@/components/sections/voucher/VoucherCampaignOverviewTable";
import VoucherCampaignSchedule from "@/components/sections/voucher/VoucherCampaignSchedule";
import VoucherCampaignFlow from "@/components/sections/voucher/VoucherCampaignFlow";
import VoucherCampaignStoreTypes from "@/components/sections/voucher/VoucherCampaignStoreTypes";
import VoucherCampaignSummaryCard from "@/components/sections/voucher/VoucherCampaignSummaryCard";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { calculateVoucherDiscountRate } from "@/lib/voucherUtils";

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
    ticketUnit,
    purchasePrice,
    ticketAmount,
    maxUnits,
    applyStartDate,
    applyEndDate,
    useStartDate,
    useEndDate,
    resultAnnounceDate,
    officialUrl,
    datePublished,
    dateModified,
    prefectureSlug,
    citySlug,
  } = campaign;

  const modified = dateModified ?? datePublished;
  const discountRate = calculateVoucherDiscountRate(ticketAmount, purchasePrice);
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
        articleDescription={`${prefName}${cityName}で実施されるプレミアム商品券の概要、販売条件、利用期間などを紹介。1口${ticketUnit}の券が${maxUnits}口まで購入可能。`}
        validFrom={applyStartDate}
        validThrough={applyEndDate}
        url={pageUrl}
        datePublished={datePublished}
        dateModified={modified}
        officialUrl={officialUrl}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          {/* ✅ タイトル・日付 */}
          <h1 className="headline1">
            {cityName}最大{discountRate}％（
            {(ticketAmount - purchasePrice).toLocaleString()}円）お得なPay商品券
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-800">
              最終更新日：{formatJapaneseDate(modified)}｜ 公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}

          {/* ✅ キャンペーンの説明文 */}
          <p className="text-xs md:text-base leading-relaxed text-gray-800 mb-2">
            対象者の方がPayPayアプリから
            <span className="font-semibold">{formatJapaneseDate(applyStartDate)}10:00</span>
            から
            <span className="font-semibold">{formatJapaneseDate(applyEndDate)}</span>
            までに申し込みのうえ、
            当選された方（
            <span className="font-semibold">{formatJapaneseDate(resultAnnounceDate)}以降</span>
            ）は、当選発表後から
            <span className="font-semibold">{formatJapaneseDate(useEndDate)}の23:59</span>
            までに商品券を購入・利用いただけます。
            <br className="hidden md:block" />
            このページでは、ユーザーの方がポイ活しやすいように、キャンペーンの内容や、その他近隣エリアのキャンペーンをまとめて紹介しています。
          </p>

          {/* ✅ サマリーカード（新設） */}
          <div className="my-6">
            <VoucherCampaignSummaryCard campaign={campaign} />
          </div>

          {/* 商品券の概要テーブル */}
          <VoucherCampaignOverviewTable
            ticketUnit={ticketUnit}
            purchasePrice={purchasePrice}
            ticketAmount={ticketAmount}
            maxUnits={maxUnits}
          />

          {/* 応募期間・利用期間・当選発表 */}
          <VoucherCampaignSchedule
            applyStartDate={applyStartDate}
            applyEndDate={applyEndDate}
            useStartDate={useStartDate}
            useEndDate={useEndDate}
            resultAnnounceDate={resultAnnounceDate}
          />

          {/* 対象店舗ジャンル（将来拡張用） */}
          <VoucherCampaignStoreTypes />

          {/* 購入〜利用の流れ（将来拡張用） */}
          <VoucherCampaignFlow />

          {/* 公式リンク */}
          {officialUrl && (
            <p className="mt-4 text-base text-blue-700 underline">
              <a href={officialUrl} target="_blank" rel="noopener noreferrer">
                公式情報はこちら
              </a>
            </p>
          )}

          {/* SNS共有 */}
          <div className="mt-8">
            <SNSShareButtons
              url={pageUrl}
              title={shareTitle}
              hashtags={shareHashtags}
            />
          </div>
        </main>
      </div>
    </>
  );
}
