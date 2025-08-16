import Image from "next/image";
import { formatJapaneseDate, getCampaignImagePath } from "@/lib/campaignUtils";
import type { VoucherCampaign } from "@/types/voucher";

type Props = {
  campaign?: VoucherCampaign;
};

const formatNumber = (num: number | string) =>
  Number(num).toLocaleString("ja-JP");

function getApplicationStatus(start: string, end: string): {
  label: string;
  color: string;
} {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (now < startDate) {
    return { label: "申込開始予定", color: "bg-blue-600" };
  } else if (now >= startDate && now <= endDate) {
    return { label: "申込受付中", color: "bg-red-600" };
  } else {
    return { label: "申込終了", color: "bg-gray-500" };
  }
}

export default function VoucherCampaignSummaryCard({ campaign }: Props) {
  if (!campaign) return null;

  const {
    prefecture,
    city,
    prefectureSlug,
    citySlug,
    ticketAmount,
    purchasePrice,
    maxUnits,
    applyStartDate,
    applyEndDate,
    useEndDate,
    resultAnnounceDate,
  } = campaign;

  const discountRate = Math.round(
    ((ticketAmount - purchasePrice) / purchasePrice) * 100
  );
  const discountPerUnit = ticketAmount - purchasePrice;
  const maxDiscount = discountPerUnit * maxUnits;
  const totalUseValue = ticketAmount * maxUnits;
  const totalPurchasePrice = purchasePrice * maxUnits;

  const status = getApplicationStatus(applyStartDate, applyEndDate);

  return (
    <section className="bg-white rounded-t-2xl shadow-md border-t border-l border-r border-gray-100 overflow-hidden relative">
      {/* ✅ ステータスバッジ */}
      <div className={`absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full shadow ${status.color}`}>
        {status.label}
      </div>

      <div className="flex flex-col md:flex-row">
        {/* ✅ 左：画像 + テキストオーバーレイ */}
        <div className="relative w-full md:w-72 h-48 md:h-auto bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/90 text-black text-center px-4 py-3 rounded-2xl shadow-2xl leading-tight font-extrabold">
              <div className="text-base sm:text-lg text-black">
                {prefecture}{city} × PayPay商品券
              </div>
              <div className="leading-tight">
                最大 <span className="text-5xl sm:text-7xl font-extrabold text-red-600">{discountRate}</span>％
              </div>
              <div className="mt-0.5">お得</div>
              <div className="mt-1 text-ms font-semibold text-gray-600">
                @<span className="text-red-600">Pay</span><span className="text-black text-[0.7rem]">キャン</span>
              </div>
            </div>
          </div>

          <Image
            src={getCampaignImagePath(prefectureSlug, citySlug)}
            alt={`${prefecture}${city}の商品券キャンペーン画像`}
            fill
            sizes="(min-width: 768px) 288px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* ✅ 右：テキストエリア */}
        <div className="flex-1 px-6 py-3 sm:px-8 sm:py-4 space-y-4 relative">
          <p className="text-sm text-gray-500 mb-0">
            <span className="font-bold text-base text-gray-800">{prefecture}{city}</span>
            のPay商品券を最大 <span className="text-red-600 text-lg font-bold">{maxUnits}</span> 口購入で
          </p>

          <p className="text-2xl sm:text-3xl font-bold text-brand-primary mb-0">
            最大 <span className="text-red-600 text-4xl">{formatNumber(maxDiscount)}</span> 円お得
          </p>

          {/* ✅ 申込期間バッジ */}
          <div className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-sm mt-2">
            申込期間：{formatJapaneseDate(applyStartDate)}10:00 ～ {formatJapaneseDate(applyEndDate)}
          </div>

          {/* ✅ その他情報バッジ群 */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-green-50 border border-green-200 rounded-full px-4 py-1 text-sm text-green-800">
              利用期限：{formatJapaneseDate(useEndDate)}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-sm text-blue-800">
              当選発表：{formatJapaneseDate(resultAnnounceDate)}以降
            </div>
          </div>

          {/* ✅ お得になる方法 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 mt-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              最大限お得になる方法
            </h3>
            <p className="text-sm text-gray-800 leading-normal">
              1口<span className="text-red-600 text-lg font-bold">{formatNumber(purchasePrice)}</span>円で 
              <span className="text-red-600 text-lg font-bold">{maxUnits}</span>口購入して、
              合計<span className="text-red-600 text-lg font-bold">{formatNumber(totalPurchasePrice)}</span>円の商品券を購入すると、
              <span className="text-red-600 text-lg font-bold">{formatNumber(totalUseValue)}</span>円分使えるので、
              <span className="text-red-600 text-lg font-bold">{formatNumber(maxDiscount)}</span>円分お得です。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
