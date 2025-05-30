import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import { formatJapaneseDate, isNowInCampaignPeriod } from "@/lib/campaignUtils";
import { CampaignListByPrefecture } from "@/components/common/CampaignListByPrefecture.tsx";
import BackNavigationButtons from "@/components/common/BackNavigationButtons";

export default function PrefecturePage({
  params,
}: {
  params: { prefecture: string };
}) {
  const list = campaigns.filter((c) => c.prefectureSlug === params.prefecture);
  if (list.length === 0) return notFound();

  const prefectureName = list[0].prefecture;
  const active = list.filter((c) => isNowInCampaignPeriod(c.startDate, c.endDate));
  const upcoming = list.length - active.length;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6">
          {prefectureName}のPayPayキャンペーン一覧
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <p className="text-base sm:text-lg text-neutral-700 leading-snug">
            <span className="text-[17px] sm:text-xl font-semibold">
              {prefectureName}では、現在{" "}
              <span className="text-orange-600 font-bold">{active.length}件</span> のキャンペーンが開催中です。
            </span>
            <span className="ml-1 text-[17px] sm:text-xl font-semibold">
              <span className="text-green-700 font-bold">{upcoming}件</span> は開催予定となっています。
            </span>
          </p>
        </div>

        <CampaignListByPrefecture prefectureSlug={params.prefecture} />

        <BackNavigationButtons />
      </div>
    </div>
  );
}
