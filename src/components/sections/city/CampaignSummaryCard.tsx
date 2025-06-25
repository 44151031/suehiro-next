import { calculateOnePay, calculateFullPay, calculatePayTime } from "@/lib/campaignCalculations";
import { PayTypeLabels } from "@/lib/payType";
import { getCampaignImagePath, getCampaignStatus, type CampaignStatus } from "@/lib/campaignUtils";
import { loadGenres } from "@/lib/loadGenres";
import type { Campaign } from "@/types/campaign";
import Image from "next/image";

type Props = {
  campaign: Campaign;
};

const formatNumber = (num: number | string) =>
  Number(num).toLocaleString("ja-JP");

const formatJapaneseDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// ✅ ステータスバッジのラベルと色
const statusMap: Record<CampaignStatus, { label: string; color: string }> = {
  scheduled: { label: "開催予定", color: "bg-blue-600" },
  active: { label: "開催中", color: "bg-red-600" },
  ended: { label: "終了しました", color: "bg-gray-500" },
};

export default function CampaignSummaryCard({ campaign }: Props) {
  const genres = loadGenres(campaign.prefectureSlug, campaign.citySlug);
  const onepay = calculateOnePay(Number(campaign.onepoint), campaign.offer);
  const fullpay = calculateFullPay(Number(campaign.fullpoint), campaign.offer);
  const paytime = calculatePayTime(fullpay, onepay);
  const payLabel = PayTypeLabels[campaign.paytype];

  const status = getCampaignStatus(campaign.startDate, campaign.endDate);
  const statusBadge = statusMap[status];

  return (
    <section className="bg-white rounded-t-2xl shadow-md border-t border-l border-r border-gray-100 overflow-hidden relative">
      {/* ✅ 右上ステータスバッジ */}
      <div className={`absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow ${statusBadge.color}`}>
        {statusBadge.label}
      </div>

      <div className="flex flex-col md:flex-row">
        {/* 左画像＋バッジ */}
        <div className="relative w-full md:w-72 h-48 md:h-auto">
          {/* テキストオーバーレイ */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 text-black text-center px-4 py-3 rounded-2xl shadow-2xl leading-tight font-extrabold">
              <div className="text-base sm:text-lg text-black">
                {campaign.prefecture}{campaign.city}×{payLabel}
              </div>
              <div className="leading-tight">
                最大 <span className="text-5xl sm:text-7xl font-extrabold text-red-600">{campaign.offer}</span>％
              </div>
              <div className="mt-0.5">戻ってくる</div>
              <div className="mt-1 text-ms font-semibold text-gray-600">
                @
                <span className="text-red-600">Pay</span>
                <span className="text-black text-[0.7rem]">キャン</span>
              </div>
            </div>
          </div>

          {/* 背景画像 */}
          <Image
            src={getCampaignImagePath(campaign.prefectureSlug, campaign.citySlug)}
            alt={`${campaign.prefecture}${campaign.city}の${payLabel}最大${campaign.offer}%還元キャンペーン画像`}
            fill
            sizes="(min-width: 768px) 288px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* 右テキスト */}
        <div className="flex-1 px-6 py-3 sm:px-8 sm:py-4 space-y-4 relative">
          <p className="text-sm text-gray-500 mb-0">
            <span className="font-bold text-base text-gray-800">{campaign.prefecture}{campaign.city}</span>の対象店舗での{payLabel}支払いで
          </p>

          <p className="text-2xl sm:text-3xl font-bold text-brand-primary mb-0">
            最大 <span className="text-red-600 text-4xl">{formatNumber(campaign.fullpoint)}</span> pt 還元
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-2 mt-2">
            <div className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-sm">
              {formatJapaneseDate(campaign.startDate)} ～ {formatJapaneseDate(campaign.endDate)}
            </div>
            {campaign.notice && (
              <div className="mt-1 text-sm text-red-700 font-semibold leading-snug">
                {campaign.notice}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-800">
              期間上限：<span className="font-bold">{formatNumber(campaign.fullpoint)}</span> 円相当
            </div>
            <div className="bg-green-50 border border-green-200 rounded-full px-4 py-1 text-sm text-green-800">
              1回上限：<span className="font-bold">{formatNumber(campaign.onepoint)}</span> 円相当
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 mt-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              最も効率的なポイント獲得方法
            </h3>
            <p className="text-sm text-gray-800 leading-normal">
              1回 <span className="text-red-600 text-lg font-bold">{formatNumber(onepay)}</span> 円の買い物を{" "}
              <span className="text-red-600 text-lg font-bold">{paytime}</span> 回、合計{" "}
              <span className="text-red-600 text-lg font-bold">{formatNumber(fullpay)}</span> 円使うと最大{" "}
              <span className="text-red-600 text-lg font-bold">{formatNumber(campaign.fullpoint)}</span> 円分の{payLabel}ポイントが獲得できます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
