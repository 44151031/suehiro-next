import { Campaign } from "@/types/campaign";

type Props = {
  campaigns: Campaign[];
  areaLabel: string;
};

const formatNumber = (num: number) => num.toLocaleString("ja-JP");

export default function CampaignTotalPointSummary({ campaigns, areaLabel }: Props) {
  const activeCampaigns = campaigns.filter(
    (c) =>
      new Date(c.startDate) <= new Date() &&
      new Date(c.endDate) >= new Date()
  );

  const totalFullpoint = activeCampaigns.reduce((sum, c) => {
    const pt = Number(c.fullpoint);
    return sum + (isNaN(pt) ? 0 : pt);
  }, 0);

  if (totalFullpoint === 0) return null;

  return (
    <div className="mt-6 mb-10 bg-white border border-neutral-300 rounded-xl shadow-sm px-6 py-4">
      <p className="text-base sm:text-lg font-medium text-neutral-800 text-center leading-snug">
        <span className="font-semibold">{areaLabel}</span>
        のキャンペーン開催中に獲得できるポイントは
        <span className="ml-1 text-4xl text-red-600 font-extrabold">
          {formatNumber(totalFullpoint)}
        </span>円
        <span className="ml-1 text-sm text-neutral-500">
          （相当のポイントまたは残高）
        </span>
      </p>
    </div>
  );
}
