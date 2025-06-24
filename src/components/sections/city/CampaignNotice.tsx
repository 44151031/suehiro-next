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
          ご注意点（{prefecture}{city}の{payLabel}還元キャンペーン対象店舗一覧）
        </h2>
      </div>

      <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
        <li>キャンペーン期間は<strong>{formattedStart}</strong>から<strong>{formattedEnd}</strong>までです。</li>
        <li>掲載内容は最新情報と異なる場合があります。店舗様の事情により実施状況が変わる可能性もあります。</li>
        <li><span className="font-medium text-red-600">タバコ・商品券・金券などはポイント還元対象外となる場合があります。</span></li>
        <li>対象決済方法・還元条件などは、ご利用前に<span className="font-medium text-gray-800">必ず店舗様へ直接ご確認ください。</span></li>
        <li className="text-xs text-gray-500">キャンペーンの適用条件・還元内容は各公式ページに記載の内容が優先されます。</li>
        <li className="text-xs text-gray-500">当サイトは公式情報の要約・整理を目的としたものであり、内容に相違がある場合がございます。</li>
      </ul>
    </section>
  );
}
