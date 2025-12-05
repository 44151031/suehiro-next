export const dynamic = "force-dynamic";
// /app/campaigns/[prefecture]/[city]/[pay]/StandardCampaignPage.tsx
// ✅ 最終完全版（楽天ペイ誘導ブロック追加）

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { loadShopList } from "@/lib/loadShopList";
import { loadGenres } from "@/lib/loadGenres";
import { CampaignOverviewTable } from "@/components/sections/city/CampaignOverviewTable";
import CampaignNotice from "@/components/sections/city/CampaignNotice";
import CampaignSummaryCard from "@/components/sections/city/CampaignSummaryCard";
import OtherPaytypesCampaigns from "@/components/sections/city/OtherPaytypesCampaigns";
import { RecommendedCampaigns } from "@/components/sections/city/RecommendedCampaigns";
import GenreHeaderNav from "@/components/sections/city/GenreHeaderNav";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import StoreRegistrationCTA from "@/components/common/StoreRegistrationCTA";
import CTAShopList from "@/components/sections/city/CTAShopList";
import { generateShareContent } from "@/lib/generateShareContent";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import SampleShopExample from "@/components/sections/shop/SampleShopExample";
import CampaignStatusNotice from "@/components/common/CampaignStatusNotice";
import { getPaytypeMetadata } from "@/lib/metadataGenerators";
import PaytypeCampaignStructuredData from "@/components/structured/PaytypeCampaignStructuredData";
import CityCampaignFAQ from "@/components/sections/city/CampaignFAQ";
import AdUnit from "@/components/common/AdUnit";

// ▼ 商品券データ
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import VoucherCampaignCardList from "@/components/common/VoucherCampaignCardList";

// ✅ 追加: ランキング付きのクライアントコンポーネント
import ClientShopLists from "@/components/sections/shop/ClientShopLists";

// ✅ 追加: 楽天ペイ専用アフィリエイトブロック
import RakutenPayAffiliate from "@/components/affiliate/RakutenPayAffiliate";
// ✅ 追加: PayPay専用アフィリエイトブロック
import PayPayAffiliate from "@/components/affiliate/PayPayAffiliate";
// ✅ 追加: dbarai専用アフィリエイトブロック
import DbaraiAffiliate from "@/components/affiliate/DbaraiAffiliate";
// ✅ 追加: aupay専用アフィリエイトブロック
import AuPayAffiliate from "@/components/affiliate/AuPayAffiliate";
// ✅ 追加: aepm@au専用アフィリエイトブロック
import AeonPayAffiliate from "@/components/affiliate/AeonPayAffiliate";

type Props = {
  params: { prefecture: string; city: string; pay: string };
};

export function generateMetadata({ params }: Props) {
  return getPaytypeMetadata(params.prefecture, params.city, params.pay);
}

export default async function CityPaytypePage({
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

  const shopListByGenre = await loadShopList(
    params.prefecture,
    params.city,
    paytypeId
  );
  const genres = await loadGenres(params.prefecture, params.city, paytypeId);

  const {
    prefecture,
    city,
    startDate,
    endDate,
    offer,
    fullpoint,
    onepoint,
    campaigntitle,
    prefectureSlug,
    citySlug,
    datePublished,
    dateModified,
    lastUpdated,
  } = campaign as Record<string, any>;

  const modified = dateModified ?? lastUpdated ?? datePublished;

  const pageUrl = `https://paycancampaign.com/campaigns/${prefectureSlug}/${citySlug}/${paytypeId}`;
  const detailsJsonPath = `/data/shopsdetails/${prefectureSlug}-${citySlug}-shops-details.json`;

  const { title: shareTitle, hashtags: shareHashtags } = generateShareContent({
    city,
    payLabel,
    offer,
    style: "impact",
  });

  return (
    <>
      {/* ✅ 統合構造化データ出力（FAQ含む） */}
      <PaytypeCampaignStructuredData
        prefecture={prefecture}
        prefectureSlug={prefectureSlug}
        city={city}
        citySlug={citySlug}
        paytype={paytypeId}
        headline={`${city} × ${payLabel} 最大${offer}％還元キャンペーン【${formatJapaneseDate(
          endDate
        )}まで】`}
        articleDescription={`本記事では、${prefecture}${city}で開催される${payLabel}ポイント還元キャンペーンの概要、対象条件、注意事項、対象店舗一覧などを解説します。`}
        offerDescription={`${formatJapaneseDate(
          startDate
        )}から${formatJapaneseDate(
          endDate
        )}まで、${prefecture}${city}内の対象店舗で${payLabel}決済を行うと、最大${offer}％のポイントが還元されるキャンペーンが実施されます。`}
        validFrom={startDate}
        validThrough={endDate}
        url={pageUrl}
        offerRate={Number(offer)}
        onePayLimit={String(onepoint)}
        fullPayLimit={String(fullpoint)}
        datePublished={datePublished}
        dateModified={modified}
        officialUrl={campaign.officialUrl}
      />

      <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
        <main className="max-w-[1200px] mx-auto px-4 py-10">
          <h1 className="headline1">
            {city}の{payLabel}キャンペーン対象店舗一覧 (最大{offer}%還元)
          </h1>

          {datePublished && (
            <p className="m-1 text-sm text-right text-gray-800">
              最終更新日：{formatJapaneseDate(modified)}｜ 公開：
              {formatJapaneseDate(datePublished)}
            </p>
          )}
          <p className="text-xs md:text-base leading-relaxed text-gray-800 mb-2">
            <span className="font-semibold">
              {prefecture}
              {city}
            </span>
            で
            <span className="text-brand-primary font-bold">
              {formatJapaneseDate(startDate)}から
              {formatJapaneseDate(endDate)}
            </span>
            までの期間で、
            <span className="font-semibold">
              {payLabel}
              {offer}％還元
            </span>
            キャンペーンが開催。このページでは効率よくポイントを獲得できるように対象店舗をジャンルに分けて紹介しています。
          </p>

          <CTAShopList
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
            paytype={paytypeId}
          />
          <CampaignStatusNotice campaign={campaign} />
          <CampaignSummaryCard campaign={campaign} />
          <GenreHeaderNav
            genres={genres}
            paytypeLabel={payLabel}
            paytype={paytypeId}
          />
          <SNSShareButtons
            url={pageUrl}
            title={shareTitle}
            hashtags={shareHashtags}
          />
          <AdUnit />

          <section className="mt-10 text-base text-gray-800 space-y-6 leading-relaxed">
            <h2 className="headline2">
              キャンペーン概要|{city}の{payLabel}還元キャンペーンとは？
            </h2>
            <p>
              <strong>
                {prefecture}
                {city}「{campaigntitle}」
              </strong>{" "}
              は、
              <span className="text-brand-primary font-bold">
                {formatJapaneseDate(startDate)}から
                {formatJapaneseDate(endDate)}
              </span>
              までの期間で、{city}の対象店舗で{payLabel}でお支払いすると、
              <span className="text-brand-primary font-bold">{offer}％</span>
              が還元されるお得なキャンペーンです。最大
              {formatNumber(fullpoint)}円分のポイントを獲得できます。
            </p>
          </section>

          <div className="mt-10">
            <CampaignOverviewTable campaign={campaign} />
          </div>

          <div className="mt-10">
            <CampaignNotice campaign={campaign} />
          </div>

          {/* ✅ 楽天ペイ専用アフィリエイトブロック */}
          {paytypeId === "rakutenpay" && <RakutenPayAffiliate />}

          {/* ✅ PayPay専用アフィリエイトブロックの追加 */}
          {paytypeId === "paypay" && <PayPayAffiliate />}

          {/* ✅ dbarai専用アフィリエイトブロックの追加 */}
          {paytypeId === "dbarai" && <DbaraiAffiliate />}

          {/* ✅ aupay専用アフィリエイトブロックの追加 */}
          {paytypeId === "aupay" && <AuPayAffiliate />}

          {/* ✅ aeonpay専用アフィリエイトブロックの追加 */}
          {paytypeId === "aeonpay" && <AeonPayAffiliate />}

          <h2 id="shop-list-section" className="headline2 mb-4 scroll-mt-34">
            {payLabel}が使える{city}の{offer}%還元対象店舗一覧
          </h2>
          <AdUnit />

          {shopListByGenre && (
            <p className="mb-4 text-sm text-gray-700">
              ♡のついている気になるお店を♥で応援しよう。♥の多いお店は今後いいことが…(開発中)
            </p>
          )}
          {!shopListByGenre ? (
            <p className="mt-10 text-gray-700 text-base">
              現時点では対象店舗情報が公表されていません。
              <br />
              公表されましたらこのページで紹介いたします。
            </p>
          ) : (
            <ClientShopLists
              shopListByGenre={shopListByGenre}
              detailsJsonPath={detailsJsonPath}
            />
          )}

          <OtherPaytypesCampaigns
            prefectureSlug={prefectureSlug}
            citySlug={citySlug}
            currentPaytype={paytypeId}
          />

          {/* ▼ 同じ都道府県のPayPay商品券情報 */}
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
          <StoreRegistrationCTA />
          <SampleShopExample />
          <SNSShareButtons
            url={pageUrl}
            title={shareTitle}
            hashtags={shareHashtags}
          />
          <CityCampaignFAQ
            prefecture={prefecture}
            city={city}
            payLabel={payLabel}
          />
          <div className="mt-20">
            <RecommendedCampaigns
              prefectureSlug={prefectureSlug}
              citySlug={citySlug}
              currentPaytype={paytypeId}
              city={city}
            />
          </div>
          <BackNavigationButtons
            prefecture={prefecture}
            prefectureSlug={prefectureSlug}
          />
        </main>
      </div>
    </>
  );
}

function formatNumber(value: number | string) {
  return Number(value).toLocaleString("ja-JP");
}
