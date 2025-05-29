"use client";

import { formatJapaneseDate } from "@/lib/campaignUtils";

type Props = {
  prefecture: string;
  city: string;
  offer: number;
  startDate: string;
  endDate: string;
  onepoint?: string;
  fullpoint?: string;
  isActive?: boolean; // ✅ 開催中ラベル用
  showPrefecture?: boolean; // ✅ オプションで都道府県表示切り替え
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
  showPrefecture = false, // ✅ デフォルトは false（＝非表示）
}: Props) {
const start = formatJapaneseDate(startDate, undefined, { omitYear: true });
const end = formatJapaneseDate(endDate, undefined, { omitYear: true });

  // 数値変換
  const onePt = Number(onepoint);
  const fullPt = Number(fullpoint);

  // 1万以上で赤
  const pointClass = (pt: number) =>
    pt >= 10000
      ? "font-semibold text-red-600"
      : "font-semibold text-neutral-900";

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

        {/* 付与上限 */}
        {onepoint && fullpoint && (
          <span className="text-neutral-700">
            ［上限］
            <span className={pointClass(onePt)}>
              {onePt.toLocaleString()}P
            </span>
            ／回・
            <span className={pointClass(fullPt)}>
              {fullPt.toLocaleString()}P
            </span>
            ／期間
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
