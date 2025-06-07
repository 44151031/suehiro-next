"use client";

import { formatJapaneseDate } from "@/lib/campaignUtils";
import { PayTypeId, PayTypeBadgeMap } from "@/lib/payType";

type Props = {
  prefecture: string;
  city: string;
  offer: number;
  startDate: string;
  endDate: string;
  onepoint?: string;
  fullpoint?: string;
  isActive?: boolean;
  showPrefecture?: boolean;
  paytype: PayTypeId;
};

export default function CampaignLineCard({
  prefecture,
  city,
  offer,
  startDate,
  endDate,
  onepoint,
  fullpoint,
  isActive,
  showPrefecture = false,
  paytype,
}: Props) {
  const start = formatJapaneseDate(startDate, undefined, { omitYear: true });
  const end = formatJapaneseDate(endDate, undefined, { omitYear: true });

  const onePt = Number(onepoint);
  const fullPt = Number(fullpoint);

  const pointClass = (pt: number) =>
    pt >= 10000
      ? "font-semibold text-red-600"
      : "font-semibold text-neutral-900";

  const badge = PayTypeBadgeMap[paytype];

  return (
    <div className="w-full bg-white border border-border rounded-xl shadow-sm px-4 py-2 text-sm text-neutral-800 transition-transform hover:scale-[1.02]">
      <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-x-[6px] whitespace-nowrap leading-snug">
        {/* 市区町村 */}
        <span className="font-semibold text-neutral-900">
          {showPrefecture ? `${prefecture}${city}` : city}
        </span>

        {/* 日付 */}
        <span>
          <span className="font-semibold">{start}</span> -{" "}
          <span className="font-semibold">{end}</span>
        </span>

        {/* 還元率 */}
        <span>
          <span className="text-red-600 font-semibold">{offer}%</span>
          <span className="font-semibold text-neutral-900">還元</span>
        </span>

        {/* 付与上限 + 決済サービスバッジ */}
        {onepoint && fullpoint && (
          <span className="text-neutral-700 inline-flex items-center gap-x-1">
            
            <span className={pointClass(onePt)}>
              {onePt.toLocaleString()}P
            </span>
            /回・
            <span className={pointClass(fullPt)}>
              {fullPt.toLocaleString()}P
            </span>
            /期間
            {/* ✅ 丸型バッジ：存在する場合のみ表示 */}
            {badge && (
              <span
                className="ml-1 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                style={{ backgroundColor: badge.bg }}
                title={badge.label}
              >
                {badge.label}
              </span>
            )}
          </span>
        )}

        {/* 開催中ラベル */}
        {isActive && (
          <span className="text-xs text-white font-semibold bg-accent py-0.5 px-0.5">
            開催中
          </span>
        )}
      </div>
    </div>
  );
}
