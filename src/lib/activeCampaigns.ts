import type { Campaign } from "@/types/campaign";
import { getCampaignStatus, getPrefectureCoordinates, calculateDistance } from "@/lib/campaignUtils";

export function campaignPath(campaign: Campaign): string {
  return `/campaigns/${campaign.prefectureSlug}/${campaign.citySlug}/${campaign.paytype}`;
}

/** Match the detail route's latest-start selection before checking current status. */
export function getCurrentCampaigns(campaigns: Campaign[], now = new Date()): Campaign[] {
  const latest = new Map<string, Campaign>();
  for (const campaign of campaigns) {
    const key = campaignPath(campaign);
    const existing = latest.get(key);
    if (!existing || campaign.startDate > existing.startDate) latest.set(key, campaign);
  }
  return [...latest.values()].filter(c => getCampaignStatus(c.startDate, c.endDate, now) === "active")
    .sort((a, b) => a.endDate.localeCompare(b.endDate) || campaignPath(a).localeCompare(campaignPath(b)));
}

export function getCurrentRecommendations(campaigns: Campaign[], area: {
  prefectureSlug: string; citySlug: string; currentPaytype?: string;
}, now = new Date()): Campaign[] {
  const priority = (c: Campaign) => c.prefectureSlug !== area.prefectureSlug ? 2 : c.citySlug === area.citySlug ? 0 : 1;
  const origin = getPrefectureCoordinates(area.prefectureSlug);
  const distance = (c: Campaign) => {
    const destination = getPrefectureCoordinates(c.prefectureSlug);
    return origin && destination ? calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng) : 0;
  };
  return getCurrentCampaigns(campaigns, now)
    .filter(c => !(c.prefectureSlug === area.prefectureSlug && c.citySlug === area.citySlug && c.paytype === area.currentPaytype))
    .sort((a, b) => priority(a) - priority(b) || distance(a) - distance(b));
}
