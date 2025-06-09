"use client";

import { getCampaignStatus } from "@/lib/campaignUtils";
import type { Campaign } from "@/types/campaign";
import Link from "next/link";

type Props = {
  campaign: Campaign;
};

export default function CampaignStatusNotice({ campaign }: Props) {
  const status = getCampaignStatus(campaign.startDate, campaign.endDate);
  if (status !== "ended") return null;

  return (
    <div className="bg-gray-700 text-white text-xs px-4 py-3 rounded-md mb-4">
      本エリアのキャンペーンは終了しています。次回、開催が決まりましたら引き続きこちらのページで紹介いたします。
      今現在、開催中・開催予定の
      <Link href="/campaigns" className="underline text-white ml-1">
        全国のキャンペーン一覧はこちら
      </Link>
      。
    </div>
  );
}
