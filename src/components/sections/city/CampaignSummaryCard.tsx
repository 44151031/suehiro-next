import Image from "next/image";
import { getCampaignImagePath } from "@/lib/campaignUtils";
import type { campaigns } from "@/lib/campaigns";

type Campaign = typeof campaigns[0];
type Props = { campaign: Campaign };

const formatNumber = (num: number | string) =>
  Number(num).toLocaleString("ja-JP");

export default function CampaignSummaryCard({ campaign }: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* 左画像 */}
        <div className="relative w-full md:w-72 h-48 md:h-auto">
          <Image
            src={getCampaignImagePath(campaign.prefectureSlug, campaign.citySlug)}
            alt={`${campaign.city}のキャンペーン画像`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 右テキスト */}
        <div className="flex-1 px-6 py-2.5 sm:px-8 sm:py-3 space-y-3">
          {/* 概要テキスト */}
          <p className="text-sm text-gray-500 mb-0">
            {campaign.prefecture}{campaign.city}の対象店舗でのPayPay支払いで
          </p>

          {/* 最大ポイント */}
          <p className="text-2xl sm:text-3xl font-bold text-brand-primary mb-0">
            最大 <span className="text-red-600 text-4xl">{formatNumber(campaign.fullpoint)}</span> pt 還元
          </p>

          {/* 開催期間バッジ */}
          <div className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-sm mt-2">
            {campaign.startDate} ～ {campaign.endDate}
          </div>

          {/* 上限2種 */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-800">
              期間上限：<span className="font-bold">{formatNumber(campaign.fullpoint)}</span> 円相当
            </div>
            <div className="bg-green-50 border border-green-200 rounded-full px-4 py-1 text-sm text-green-800">
              1回上限：<span className="font-bold">{formatNumber(campaign.onepoint)}</span> 円相当
            </div>
          </div>

          {/* 最も効率的な方法 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 mt-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              最も効率的なポイント獲得方法
            </h3>
            <p className="text-sm text-gray-800 leading-normal">
              1回{" "}
              <span className="text-red-600 text-lg font-bold">{formatNumber(campaign.onepay)}</span> 円の買い物を{" "}
              <span className="text-red-600 text-lg font-bold">{campaign.paytime}</span> 回、合計{" "}
              <span className="text-red-600 text-lg font-bold">{formatNumber(campaign.fullpay)}</span> 円使うと最大{" "}
              <span className="text-red-600 text-lg font-bold">{formatNumber(campaign.fullpoint)}</span> 円分のPayPayポイントが獲得できます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
