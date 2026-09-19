// /app/campaigns/[prefecture]/[city]/[pay]/EndedCampaignPage.tsx
// 🏁 終了キャンペーン専用テンプレート（SEO最適化済み・StandardCampaignPage寄せ強化版）

import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";
import {
  formatJapaneseDate,
  getCampaignStatus,
  getActiveCampaignsByPrefecture,
  CampaignStatus,
} from "@/lib/campaignUtils";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import PaytypeCampaignStructuredData from "@/components/structured/PaytypeCampaignStructuredData";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import CityCampaignFAQ from "@/components/sections/city/CampaignFAQ";
import StoreRegistrationCTA from "@/components/common/StoreRegistrationCTA";
import AdUnit from "@/components/common/AdUnit";

// ▼ StandardCampaignPage 準拠の追加要素
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import OtherPaytypesCampaigns from "@/components/sections/city/OtherPaytypesCampaigns";
import CTAShopList from "@/components/sections/city/CTAShopList";
import SampleShopExample from "@/components/sections/shop/SampleShopExample";

// ▼ 商品券データ（県内の関連誘導）
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import VoucherCampaignCardList from "@/components/common/VoucherCampaignCardList";

// ▼ 決済別アフィリエイトブロック
import RakutenPayAffiliate from "@/components/affiliate/RakutenPayAffiliate";
import PayPayAffiliate from "@/components/affiliate/PayPayAffiliate";
import DbaraiAffiliate from "@/components/affiliate/DbaraiAffiliate";
import AuPayAffiliate from "@/components/affiliate/AuPayAffiliate";
import AeonPayAffiliate from "@/components/affiliate/AeonPayAffiliate";

// ✅ 都道府県内キャンペーンカードリスト
import { CampaignCardList } from "@/components/common/CampaignCardList";

//
// 🔹 終了月に基づく開催傾向メッセージを自動生成
//
function generateCampaignTrend(city: string, payLabel: string, endDate: string): string {
  const month = new Date(endDate).getMonth() + 1;

  if ([1, 2].includes(month)) {
    return `${city}では、冬季（1〜2月）に${payLabel}キャンペーンが実施されることが多く、年末年始の買い物支援策として企画される傾向があります。`;
  } else if ([3, 4, 5].includes(month)) {
    return `${city}では、春（3〜5月）の新生活応援キャンペーンとして${payLabel}が開催されるケースが見られます。`;
  } else if ([6, 7].includes(month)) {
    return `${city}では、初夏（6〜7月）に地域の商店街活性化を目的とした${payLabel}キャンペーンが行われる傾向があります。`;
  } else if ([8, 9].includes(month)) {
    return `${city}では、夏〜初秋（8〜9月）に${payLabel}キャンペーンが実施される例があり、観光シーズンやイベントと連動するケースもあります。`;
  } else {
    return `${city}では、秋〜冬（10〜12月）にかけて${payLabel}キャンペーンが行われることが多く、年末商戦に合わせて実施される傾向があります。`;
  }
}

export default async function EndedCampaignPage({
  params,
}: {
  params: { prefecture: string; city: string; pay: string };
}) {
  const paytypeId = params.pay as PayTypeId;
  if (!paytypeId || !(paytypeId in PayTypeLabels)) return notFound();

  const campaign = campaigns
    .filter(
      (c) =>
        c.prefectureSlug === params.prefecture &&
        c.citySlug === params.city &&
        c.paytype === paytypeId
    )
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0];

  if (!campaign) return notFound();

  const payLabel = PayTypeLabels[paytypeId];
  const {
    prefecture,
    city,
    startDate,
    endDate,
    offer,
    fullpoint,
    onepoint,
    prefectureSlug,
    citySlug,
    datePublished,
    dateModified,
  } = campaign;

  const modified = dateModified ?? datePublished;
  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeId}`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city,
    payLabel,
    offer,
    style: "archive",
  });

  // ✅ 自動生成された傾向文
  const trendText = generateCampaignTrend(city, payLabel, endDate);

  return (
    <>
      <PaytypeCampaignStructuredData
        prefecture={prefecture}
        prefectureSlug={prefectureSlug}
        city={city}
        citySlug={citySlug}
        paytype={paytypeId}
        headline={`${city} × ${payLabel} 過去のキャンペーン情報（最大${offer}%還元）`}
        articleDescription={`${prefecture}${city}で実施された${payLabel}キャンペーンの概要や結果、還元率、実施期間をまとめています。`}
        offerDescription={`${formatJapaneseDate(startDate)}から${formatJapaneseDate(
          endDate
        )}まで、${prefecture}${city}で開催された${payLabel}の${offer}％還元キャンペーンの記録です。`}
        validFrom={startDate}
        validThrough={endDate}
        offerRate={Number(offer)}
        onePayLimit={String(onepoint)}
        fullPayLimit={String(fullpoint)}
        datePublished={datePublished}
        dateModified={modified}
        url={pageUrl}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {city}で実施された{payLabel}キャンペーンの開催実績（最大{offer}%還元）
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-700">
              最終更新日：{formatJapaneseDate(modified)}｜公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}

          {/* 🔰 導入説明 */}
          <section className="mt-6 text-gray-800 leading-relaxed space-y-4">
            <p>
              本ページでは、<strong>{prefecture}{city}</strong>で開催された
              <strong>{payLabel}</strong>のポイント還元キャンペーンの詳細をアーカイブとして掲載しています。
              終了済みですが、<strong>次回開催の傾向</strong>や<strong>他の自治体の動向</strong>を把握する上で参考になります。
            </p>
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
              <p className="font-semibold text-gray-900">
                開催期間：{formatJapaneseDate(startDate)} 〜 {formatJapaneseDate(endDate)}
              </p>
              <p>
                最大還元率：{offer}％ ／ 付与上限：1回あたり{onepoint}円・期間あたり{fullpoint}円
              </p>
            </div>
          </section>

          <nav aria-label="終了後のキャンペーン案内" className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
            <p className="font-semibold">このキャンペーンは終了しました。</p>
            <p className="mt-2 text-sm text-gray-700">
              現在利用できるキャンペーンは、各地域の最新情報をご確認ください。
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <a href={`/campaigns/${prefectureSlug}`} className="text-brand-primary font-semibold underline">
                {prefecture}のキャンペーンを探す
              </a>
              <a href="/campaigns" className="text-brand-primary font-semibold underline">
                全国の開催中・開催予定キャンペーンを探す
              </a>
            </div>
          </nav>

          <div className="mt-4">
            <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />
          </div>

          <AdUnit />

          {/* ✅ 情報ブロック */}
          <section className="mt-8 space-y-10">
            <CampaignSummaryCard campaign={campaign} />
            <CampaignOverviewTable campaign={campaign} />
            <CampaignNotice campaign={campaign} />

            {paytypeId === "rakutenpay" && <RakutenPayAffiliate />}
            {paytypeId === "paypay" && <PayPayAffiliate />}
            {paytypeId === "dbarai" && <DbaraiAffiliate />}
            {paytypeId === "aupay" && <AuPayAffiliate />}
            {paytypeId === "aeonpay" && <AeonPayAffiliate />}
          </section>

          <AdUnit />

          {/* 🗺️ 現在開催中の都道府県内キャンペーン */}
          {(() => {
            const prefectureActiveList = getActiveCampaignsByPrefecture(
              prefectureSlug,
              campaigns
            ).filter(
              (c) => getCampaignStatus(c.startDate, c.endDate) === "active"
            );

            return (
              <section className="mt-10">
                <h2 className="headline2 mb-3">{prefecture}で現在開催されているキャンペーンをチェック</h2>

                {prefectureActiveList.length > 0 ? (
                  <div className="prefecture-page-card-container mb-6">
                    <CampaignCardList campaigns={prefectureActiveList} />
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm mb-6">
                    現在、{prefecture}内で実施中のキャンペーンはありません。
                  </p>
                )}

                <a
                  href={`/campaigns/${prefectureSlug}`}
                  className="text-brand-primary font-semibold underline"
                >
                  ▶ {prefecture}の開催中キャンペーン一覧を見る
                </a>
              </section>
            );
          })()}

          {/* 🔮 次回開催の見通し */}
          <section className="mt-10">
            <h2 className="headline2 mb-3">次回開催の見通し・過去実績からわかる傾向</h2>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              {trendText}
              最新情報が発表され次第、このページでもお知らせします。
            </p>
          </section>

          {/* 🎫 同県内の商品券情報 */}
          {(() => {
            const now = new Date();
            const prefectureVoucherCampaigns = voucherCampaignMaster
              .filter(
                (v) =>
                  v.prefectureSlug === prefectureSlug &&
                  now <= new Date(v.applyEndDate)
              )
              .sort(
                (a, b) =>
                  new Date(a.applyStartDate).getTime() -
                  new Date(b.applyStartDate).getTime()
              );

            if (prefectureVoucherCampaigns.length === 0) return null;

            return (
              <section className="mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-6 border-l-4 border-brand-primary pl-4">
                  {prefecture}のオトクなPayPay商品券の情報はこちら
                </h2>
                <VoucherCampaignCardList campaigns={prefectureVoucherCampaigns} />
              </section>
            );
          })()}

          {/* 🏪 CTA */}
          <section className="mt-12 space-y-6">
            <CTAShopList prefectureSlug={prefectureSlug} citySlug={citySlug} paytype={paytypeId} />
            <StoreRegistrationCTA />
            <SampleShopExample />
          </section>

          <div className="mt-10">
            <SNSShareButtons url={pageUrl} title={shareTitle} hashtags={shareHashtags} />
          </div>

          <RecommendedCampaigns
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
            currentPaytype={paytypeId}
            city={city}
          />

          <CityCampaignFAQ prefecture={prefecture} city={city} payLabel={payLabel} />
          <BackNavigationButtons prefecture={prefecture} prefectureSlug={prefectureSlug} />
        </main>
      </div>
    </>
  );
}
