import { notFound } from "next/navigation";
import Link from "next/link";
import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
import { voucherAssetKey, voucherPath, voucherStatus } from "@/lib/voucherPresentation";
import { loadShopList } from "@/lib/loadShopList";
import { loadShopDetails } from "@/lib/loadShopDetails";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { calculateVoucherDiscountRate } from "@/lib/voucherUtils";
import VoucherCampaignSummaryCard from "@/components/sections/voucher/VoucherCampaignSummaryCard";
import { VoucherRedemptionGuide } from "@/components/sections/voucher/VoucherRedemptionGuide";
import VoucherCampaignStructuredData from "@/components/structured/VoucherCampaignStructuredData";
import VoucherCampaignCardList from "@/components/common/VoucherCampaignCardList";
import CommunityShopLists from "@/components/sections/shop/CommunityShopLists";
import ShopListSource from "@/components/sections/shop/ShopListSource";
import { SNSShareButtons } from "@/components/common/SNSShareButtons";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";
import ActiveCampaignLinks from "@/components/sections/city/ActiveCampaignLinks";

export default async function VoucherCampaignPage({ params }: {
  params: { prefecture: string; city: string; pay: string; campaignSlug?: string };
}) {
  const c = voucherCampaignMaster.find(v => v.prefectureSlug === params.prefecture && v.citySlug === params.city && v.paytype === params.pay && v.campaignSlug === params.campaignSlug);
  if (!c) notFound();
  const path = voucherPath(c);
  const url = `https://paycancampaign.com${path}`;
  const key = voucherAssetKey(c);
  const shops = await loadShopList(c.prefectureSlug, c.citySlug, `${c.paytype}${c.campaignSlug ? `-${c.campaignSlug}` : ""}`);
  const details = loadShopDetails(c.prefectureSlug, c.citySlug);
  const rate = calculateVoucherDiscountRate(c.ticketAmount, c.purchasePrice);
  const method = c.applicationMethod ?? (c.resultAnnounceDate ? "lottery" : "first-come");
  const official = c.officialUrl || c.applicationUrl;
  const related = voucherCampaignMaster.filter(v => v.prefectureSlug === c.prefectureSlug && v.citySlug === c.citySlug && voucherPath(v) !== path && new Date(v.useEndDate) >= new Date());
  const rows = [
    ["商品券名", c.campaigntitle],
    ["販売価格・利用額", `${c.purchasePrice.toLocaleString()}円で${c.ticketAmount.toLocaleString()}円分（プレミアム率${rate}%）`],
    ["購入上限", `1人最大${c.maxUnits}口`],
    ["対象者", c.eligiblePersons],
    ["受付方法", method === "first-come" ? "先着販売" : method === "external" ? "自治体指定の方法で事前申込" : "事前申込・抽選"],
    [method === "first-come" ? "販売期間（予定）" : "申込期間", `${formatJapaneseDate(c.applyStartDate)} ～ ${formatJapaneseDate(c.applyEndDate)}`],
    ...(c.resultAnnounceDate ? [["当選発表予定日", formatJapaneseDate(c.resultAnnounceDate)]] : []),
    ["購入期限", formatJapaneseDate(c.purchaseEndDate)],
    ["利用開始", c.useStartDate ? formatJapaneseDate(c.useStartDate) : "購入後から利用可能"],
    ["利用期限", formatJapaneseDate(c.useEndDate)],
  ];
  return <>
    <VoucherCampaignStructuredData prefecture={c.prefecture} prefectureSlug={c.prefectureSlug} city={c.city} citySlug={c.citySlug} paytype={c.paytype} campaignSlug={c.campaignSlug} officialUrl={official}
      headline={c.campaigntitle} articleDescription={`${c.campaigntitle}の対象者・購入条件・対象店舗。${c.purchasePrice.toLocaleString()}円で${c.ticketAmount.toLocaleString()}円分。${voucherStatus(c)}。`}
      validFrom={c.applyStartDate} validThrough={c.useEndDate} url={url} datePublished={c.datePublished} dateModified={c.dateModified ?? c.datePublished} />
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <p className="text-sm text-gray-600 mb-3">{c.prefecture}・{c.city} / PayPay商品券</p>
        <h1 className="headline1">{c.campaigntitle}｜最大{rate}%お得</h1>
        <p className="text-sm text-right my-3">最終更新：{formatJapaneseDate(c.dateModified ?? c.datePublished)}</p>
        <nav aria-label="商品券ページ内の案内" className="my-4 flex flex-wrap gap-3 text-sm font-semibold">
          <a href="#voucher-shops" className="inline-flex min-h-11 items-center rounded-full border border-red-300 px-4 py-2 text-red-700">対象店舗を探す</a>
          <Link href="/campaigns/active" className="inline-flex min-h-11 items-center rounded-full bg-red-600 px-4 py-2 text-white">今開催中の還元キャンペーンを見る</Link>
        </nav>
        {new Date(c.useEndDate) < new Date() && <ActiveCampaignLinks prefectureSlug={c.prefectureSlug} citySlug={c.citySlug} message="この商品券の利用期間は終了しています。" />}
        <p className="leading-relaxed mb-6">1口{c.purchasePrice.toLocaleString()}円で{c.ticketAmount.toLocaleString()}円分のお買い物ができる商品券です。対象者、受付状況と購入・利用期限をご確認ください。</p>
        <VoucherCampaignSummaryCard campaign={c} />
        <section className="rounded-b-2xl border bg-white p-5 space-y-3">
          <p className="font-bold text-lg">{voucherStatus(c)}</p>
          {c.salesStatus === "sold-out" && <p>販売予定期間内ですが、販売口数の上限に達したため購入受付は終了しています。購入済みの商品券は利用期限まで使用できます。</p>}
          {c.notice && <p className="leading-relaxed">{c.notice}</p>}
          {official && <a href={official} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg bg-red-600 px-5 py-3 text-white font-bold">公式ページで条件・受付状況を確認</a>}
        </section>
        <section className="mt-8 rounded-2xl bg-white border p-5 md:p-8">
          <h2 className="headline2">商品券の概要とスケジュール</h2>
          <dl className="divide-y">{rows.map(([label,value]) => <div key={label} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-2 py-4"><dt className="text-gray-600">{label}</dt><dd className="font-semibold break-words">{value}</dd></div>)}</dl>
          <p className="mt-4 text-sm text-gray-600">受付開始・締切の時刻、追加販売や早期終了については公式ページをご確認ください。</p>
        </section>
        <section className="mt-10 space-y-4" id="voucher-shops">
          <h2 className="headline2">この商品券が使える対象店舗</h2>
          <p>通常のPayPay加盟店でも、この商品券を使えない場合があります。券種ごとの条件とアプリ・店頭の表示をご確認ください。</p>
          {c.shopListNote && <p>{c.shopListNote}</p>}
          {c.shopListUrl && <a href={c.shopListUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-700 underline">公式の対象店舗一覧を見る</a>}
          {Object.keys(shops).length > 0 ? <><ShopListSource listKey={key} /><CommunityShopLists pagePath={path} shopListByGenre={shops} detailsMap={details} /></> : <p className="rounded-xl border bg-white p-4">対象店舗は{c.shopListUrl ? "上記の公式一覧" : "公式ページの「使えるお店」やPayPayアプリの商品券画面"}で確認できます。</p>}
        </section>
        <section className="mt-10 rounded-2xl border bg-white p-6">
          <h2 className="headline2">{method === "first-come" ? "購入方法" : "申し込み・購入方法"}</h2>
          <ol className="list-decimal pl-6 space-y-3">
            <li>対象者と受付状況を確認します。本人確認が必要な商品券は、PayPayアプリで事前に手続きを済ませます。</li>
            <li>{method === "external" ? "公式ページに記載された自治体指定の方法で申し込みます。" : `PayPayアプリの「地域商品券」から「${c.campaigntitle}」を選び、希望口数（最大${c.maxUnits}口）を入力します。`}</li>
            {method !== "first-come" && <li>{method === "external" ? "当選通知を確認し、取得した商品券コードをPayPayアプリに入力します。" : "抽選結果の通知を確認し、購入権を取得した口数を確認します。"}</li>}
            <li>購入期限までにアプリで内容を確認して支払います。購入した商品券はウォレットで確認できます。</li>
          </ol>
          {c.salesStatus === "sold-out" && <p className="mt-4 font-semibold">この募集回の販売は終了しています。</p>}
        </section>
        <section className="mt-10"><h2 className="headline2">商品券の使い方</h2><VoucherRedemptionGuide /></section>
        <div className="my-8"><SNSShareButtons url={url} title={c.campaigntitle} hashtags={["PayPay", "商品券", c.city]} /></div>
        {related.length > 0 && <section className="my-10"><h2 className="headline2">{c.city}のほかの商品券</h2><VoucherCampaignCardList campaigns={related} /></section>}
        <Link href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`} className="block text-blue-700 underline my-6">{c.city}のキャンペーン一覧へ</Link>
        <BackNavigationButtons prefecture={c.prefecture} prefectureSlug={c.prefectureSlug} />
      </main>
    </div>
  </>;
}
