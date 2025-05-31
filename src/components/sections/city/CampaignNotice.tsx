// ✅ /components/sections/campaign/CampaignNotice.tsx

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import { PayTypeLabels } from "@/lib/payType";
import type { CampaignWithCalc } from "@/types/campaign";

type Props = {
  campaign: CampaignWithCalc;
};

export default function CampaignNotice({ campaign }: Props) {
  const {
    prefecture,
    city,
    startDate,
    endDate,
    paytype,
  } = campaign;

  const formattedStart = formatJapaneseDate(startDate);
  const formattedEnd = formatJapaneseDate(endDate);
  const payLabel = PayTypeLabels[paytype];

  return (
    <section className="bg-white border border-yellow-300 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-yellow-500" />
        <h2 className="text-lg font-bold text-yellow-700">
          ご注意点（{campaign.prefecture}{campaign.city}の{payLabel}還元キャンペーン対象店舗一覧）
        </h2>
      </div>
      <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
        <li>キャンペーン期間は{formattedStart}から{formattedEnd}までです。</li>
        <li>本ページでは最新の情報が反映されていない場合があります。また掲載されていない店舗もあります。</li>
        <li>店舗様の諸事情により、掲載内容と実際の利用状況が相違している場合があります。</li>
        <li>
          本キャンペーンを確実に利用するためにも、
          <span className="font-medium text-gray-800">入店時に店舗様へご希望の決済方法で支払いが可能かどうかご確認ください。</span>
        </li>
      </ul>
    </section>
  );
}
