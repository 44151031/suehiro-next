import Link from "next/link";
import { campaigns } from "@/lib/campaignMaster";
import { campaignPath, getCurrentRecommendations } from "@/lib/activeCampaigns";
import { PayTypeLabels } from "@/lib/payType";
import { formatJapaneseDate } from "@/lib/campaignUtils";

type Props = {
  prefectureSlug: string;
  citySlug: string;
  currentPaytype?: string;
  limit?: number;
  message?: string;
};

export default function ActiveCampaignLinks({ limit = 3, message, ...area }: Props) {
  const recommended = getCurrentRecommendations(campaigns, area).slice(0, limit);
  return <section aria-label="今開催中のキャンペーン案内" className="my-6 rounded-xl border border-red-200 bg-white p-4 sm:p-5">
    {message && <p className="mb-2 font-semibold text-gray-800">{message}</p>}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-bold">今開催中のキャンペーンを探す</h2>
      <Link href="/campaigns/active" className="inline-flex min-h-11 items-center rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700">開催中の全国一覧を見る →</Link>
    </div>
    <p className="my-3 text-sm text-gray-600">掲載中のポイント還元キャンペーンから、同じ市区町村・都道府県を優先してご案内します。商品券の申込・利用期間は別途ご確認ください。</p>
    {recommended.length > 0 ? <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {recommended.map(c => <li key={campaignPath(c)}>
        <Link href={campaignPath(c)} className="block h-full rounded-lg border border-gray-200 p-3 hover:border-red-400 hover:bg-red-50 focus-visible:outline-red-600">
          <span className="text-xs font-semibold text-green-800">開催中 · {c.prefectureSlug === area.prefectureSlug ? c.citySlug === area.citySlug ? "同じ市区町村" : "同じ都道府県" : "他の都道府県"}</span>
          <span className="mt-1 block font-bold">{c.prefecture}{c.city} × {PayTypeLabels[c.paytype]}</span>
          <span className="block text-sm">最大{c.offer}%還元 · {formatJapaneseDate(c.endDate)}まで</span>
          <span className="mt-1 block text-sm text-red-700 underline">対象店舗・利用条件を見る</span>
        </Link>
      </li>)}
    </ul> : <p className="text-sm">ご案内できる他の開催中キャンペーンはありません。<Link href="/campaigns" className="ml-1 underline">開催予定を確認する</Link></p>}
  </section>;
}
