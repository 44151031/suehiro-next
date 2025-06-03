import { Campaign } from "@/types/campaign";
import { sumFullpoint } from "@/lib/campaignCalculations";

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

  return (
    <div className="mt-6 mb-10 bg-white border border-neutral-300 rounded-xl shadow-sm px-6 py-4">
      {totalFullpoint > 0 ? (
        <p className="text-base sm:text-lg font-medium text-neutral-800 text-center leading-snug">
          <span className="font-semibold">{areaLabel}</span>
          <span className="sm:hidden"><br /></span>
          で現在開催中のキャンペーンで
          <span className="sm:hidden"><br /></span>
          獲得できるポイントの合計は
          <span className="ml-1 text-4xl text-red-600 font-extrabold">
            {formatNumber(totalFullpoint)}
          </span>
          円
          <br className="sm:hidden" />
          <span className="text-sm text-neutral-500">
            （相当のポイントまたは残高）
          </span>
          <br />
          <span className="text-sm text-neutral-500">
            ちなみに、開催予定も含めるとナント
            <span className="mx-1 text-green-600 font-bold">
              {formatNumber(totalAllFullpoint)}
            </span>
            円。上手に獲得しましょう。
          </span>
        </p>
      ) : (
        <p className="text-base sm:text-lg font-medium text-neutral-500 text-center leading-snug">
          <span className="font-semibold">{areaLabel}</span>
          の現在開催中のキャンペーンはありません。
          <br className="hidden sm:inline" />
          開催日までしばらくお待ちください。
        </p>
      )}
    </div>
  );
}
