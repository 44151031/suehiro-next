"use client";

import { formatJapaneseDate, getCampaignStatus } from "@/lib/campaignUtils";
import { PayTypeId, PayTypeBadgeMap } from "@/lib/payType";

type Props = {
  prefecture: string;
  city: string;
  offer: number;
  startDate: string;
  endDate: string;
  onepoint?: string;
  fullpoint?: string;
  showPrefecture?: boolean;
  paytype: PayTypeId;
  isActive?: boolean;
};

export default function CampaignLineCard({
  prefecture,
  city,
  offer,
  startDate,
  endDate,
  onepoint,
  fullpoint,
  showPrefecture = false,
  paytype,
}: Props) {
  const start = formatJapaneseDate(startDate, { omitYear: true });
  const end = formatJapaneseDate(endDate, { omitYear: true });

  const onePt = Number(onepoint);
  const fullPt = Number(fullpoint);

  const badge = PayTypeBadgeMap[paytype];
  const status = getCampaignStatus(startDate, endDate);

  const pointClass = (pt: number) =>
    pt >= 10000
      ? "font-semibold text-red-600"
      : "font-semibold text-neutral-900";

  return (
    <div className="w-full bg-white border border-border rounded-xl shadow-sm px-4 py-2 text-sm text-neutral-800 transition-transform hover:scale-[1.02] flex items-center justify-between">
      <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-x-[6px] whitespace-nowrap leading-snug">
        <span className="font-semibold text-neutral-900">
          {showPrefecture ? `${prefecture}${city}` : city}
        </span>

        <span>
          <span className="font-semibold">{start}</span> -{" "}
          <span className="font-semibold">{end}</span>
        </span>

        <span>
          <span className="text-red-600 font-semibold">{offer}%</span>
          <span className="font-semibold text-neutral-900">還元</span>
        </span>

        {onepoint && fullpoint && (
          <span className="text-neutral-700 inline-flex items-center gap-x-1">
            <span className={pointClass(onePt)}>{onePt.toLocaleString()}P</span>
            /回・
            <span className={pointClass(fullPt)}>{fullPt.toLocaleString()}P</span>
            /期間
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

        {status === "active" && (
          <span className="text-xs text-white font-semibold bg-accent py-0.5 px-0.5">
            開催中
          </span>
        )}
      </div>

      {/* ✅ xl以下（= 1279px以下）でのみ表示 */}
      <span className="block xl:hidden text-xl text-neutral-400 ml-2 pointer-events-none">
        ›
      </span>
    </div>
  );
}
