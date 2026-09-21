import type { Metadata } from "next";
import Link from "next/link";
import { campaigns } from "@/lib/campaignMaster";
import { getCurrentCampaigns, campaignPath } from "@/lib/activeCampaigns";
import { prefectures } from "@/lib/prefectures";
import { PayTypeLabels } from "@/lib/payType";
import { formatJapaneseDate } from "@/lib/campaignUtils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "今開催中のキャッシュレス還元キャンペーン一覧 | Payキャン",
  description: "今開催中のPayPay・au PAY・楽天ペイ・d払いなどの地域還元キャンペーンを都道府県別に掲載。還元率・終了日を比較し、対象店舗と利用条件を確認できます。",
  alternates: { canonical: "https://paycancampaign.com/campaigns/active" },
};

export default function ActiveCampaignsPage() {
  const now = new Date();
  const active = getCurrentCampaigns(campaigns, now);
  const groups = prefectures.map(p => ({ ...p, campaigns: active.filter(c => c.prefectureSlug === p.slug) })).filter(p => p.campaigns.length);
  return <div className="mx-auto max-w-[1200px] px-4 py-8">
    <h1 className="headline1">今開催中のキャッシュレス還元キャンペーン</h1>
    <p className="my-4">{now.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}時点の掲載情報から、開催期間中のポイント還元キャンペーン{active.length}件をご案内します。</p>
    <p className="mb-5 text-sm text-gray-600">開催予定・終了済みは含みません。対象店舗、支払い方法、早期終了などの最新情報は各ページの公式案内をご確認ください。</p>
    <nav aria-label="開催中キャンペーンの地域選択" className="mb-8 flex flex-wrap gap-2">
      {groups.map(p => <a key={p.slug} href={`#active-${p.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">{p.name}（{p.campaigns.length}）</a>)}
    </nav>
    {groups.length === 0 && <p className="my-8">現在、開催中として掲載しているキャンペーンはありません。</p>}
    {groups.map(p => <section key={p.slug} id={`active-${p.slug}`} className="mb-10 scroll-mt-24">
      <h2 className="headline2">{p.name}で開催中</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {p.campaigns.map(c => <li key={campaignPath(c)}><Link href={campaignPath(c)} className="block h-full rounded-xl border border-gray-200 bg-white p-4 hover:border-red-400 hover:bg-red-50">
          <span className="text-xs font-bold text-green-800">開催中</span>
          <h3 className="my-2 font-bold">{c.city} × {PayTypeLabels[c.paytype]}</h3>
          <p className="text-lg font-bold text-red-700">最大{c.offer}%還元</p>
          <p className="text-sm">{formatJapaneseDate(c.startDate)}〜{formatJapaneseDate(c.endDate)}</p>
          <p className="mt-2 text-sm">1回上限 {Number(c.onepoint).toLocaleString("ja-JP")}円相当 / 期間上限 {Number(c.fullpoint).toLocaleString("ja-JP")}円相当</p>
          <span className="mt-3 block text-sm font-semibold text-red-700 underline">対象店舗・利用条件を見る →</span>
        </Link></li>)}
      </ul>
    </section>)}
    <Link href="/campaigns" className="inline-flex min-h-11 items-center text-red-700 underline">開催予定・商品券も含めた全国一覧を見る →</Link>
  </div>;
}
