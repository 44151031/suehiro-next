// ✅ /app/campaign/page.tsx

import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/campaign/CampaignGroupSection";

export default function CampaignTopPage() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">PayPayキャンペーン都道府県一覧</h1>

        <div className="space-y-12">
          {prefectureGroups.map((group) => (
            <CampaignGroupSection key={group} groupName={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
