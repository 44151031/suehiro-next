import { Campaign } from "@/types/campaign";
import { sumFullpoint } from "@/lib/campaignCalculations";
import Link from "next/link";

type Props = {
  campaigns: Campaign[];
  areaLabel: string;
};

const formatNumber = (num: number) => num.toLocaleString("ja-JP");

export default function CampaignTotalPointSummary({ campaigns, areaLabel }: Props) {
  const now = new Date();

  const activeCampaigns = campaigns.filter(
    (c) => new Date(c.startDate) <= now && new Date(c.endDate) >= now
  );

  const scheduledCampaigns = campaigns.filter(
    (c) => new Date(c.startDate) > now
  );

  const totalFullpoint = sumFullpoint(activeCampaigns);
  const totalScheduledFullpoint = sumFullpoint(scheduledCampaigns);
  const totalAllFullpoint = totalFullpoint + totalScheduledFullpoint;

  const hasActive = totalFullpoint > 0;
  const hasScheduled = totalScheduledFullpoint > 0;

  return (
    <div className="mt-6 mb-5 bg-white border border-neutral-300 rounded-xl shadow-sm px-6 py-4">
      {hasActive ? (
        // ✅ 開催中あり（開催予定があってもなくてもOK）
        <p className="text-base sm:text-lg font-medium text-neutral-800 text-center leading-snug">
          {areaLabel}の開催中のキャンペーンで
          <span className="sm:hidden"><br /></span>
          獲得できるポイントの合計は
          <span className="sm:hidden"><br /></span>
          <span className="ml-1 text-4xl text-red-600 font-extrabold">
            {formatNumber(totalFullpoint)}
          </span>
          円
          <br className="sm:hidden" />
          <span className="text-sm text-neutral-500">
            （相当のポイントまたは残高）
          </span>

          {hasScheduled && (
            <>
              <br />
              <span className="text-sm text-neutral-500">
                ちなみに開催予定も含めるとナント
                <span className="sm:hidden"><br /></span>
                <span className="mx-1 text-green-600 font-bold">
                  {formatNumber(totalAllFullpoint)}
                </span>
                円！
              </span>
            </>
          )}
        </p>
      ) : hasScheduled ? (
        // ✅ 開催中はないが、開催予定はある場合
        <p className="text-base sm:text-lg font-medium text-neutral-700 text-center leading-snug">
          <span className="font-semibold">{areaLabel}</span>
          では
          <span className="sm:hidden"><br /></span>
          近日開催予定のキャンペーンがあります！
          <br />
          <span className="text-ls text-neutral-500">
            合計で
            <span className="mx-1 text-green-600 font-bold">
              {formatNumber(totalScheduledFullpoint)}
            </span>
            円分（相当）のポイント還元を予定しています。
          </span>
        </p>
      ) : (
        // ✅ 開催中も開催予定もない場合
        <p className="text-base sm:text-lg font-medium text-neutral-500 leading-snug">
          <span className="font-semibold">{areaLabel}</span>
          で現在開催中・開催予定のキャンペーンはありません。開催中・開催予定の
          <Link href="/campaigns" className="text-blue-600 ml-1 hover:underline">
            全国のキャンペーン一覧
          </Link>
          をご覧ください。
        </p>
      )}
    </div>
  );
}
