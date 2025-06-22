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
  <li>本ページでは最新の情報が反映されていない場合があります。また店舗様の事情により、掲載内容と実際の状況が異なる場合があります。</li>
  <li>取引に<span className="font-medium text-gray-800">タバコ</span>の購入が含まれる場合は当該取引へのキャンペーンの適用が取り消される場合があります。</li>
  <li>決済方法・対象可否などは、必ず<span className="font-medium text-gray-800">ご利用前に店舗様へ直接ご確認ください。</span></li>
  <li className="text-xs text-gray-500">キャンペーンの適用条件・還元内容は各公式ページの記載が優先されます。</li>
  <li className="text-xs text-gray-500">本サイトは情報整理であり、公式情報とは異なる場合があります。</li>
</ul>
    </section>
  );
}
