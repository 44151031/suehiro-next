// /app/campaign/page.tsx

import { prefectureGroups } from "@/lib/prefectures";
import CampaignGroupSection from "@/components/campaign/CampaignGroupSection";

export default function CampaignTopPage() {
  return (
    <div className="p-4 space-y-12">
      {prefectureGroups.map(group => (
        <CampaignGroupSection key={group} groupName={group} />
      ))}
    </div>
  );
}