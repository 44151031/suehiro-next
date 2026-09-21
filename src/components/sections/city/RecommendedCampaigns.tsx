import ActiveCampaignLinks from "./ActiveCampaignLinks";

export function RecommendedCampaigns({ prefectureSlug, citySlug, currentPaytype }: {
  prefectureSlug: string; citySlug: string; currentPaytype?: string; city: string;
}) {
  return <ActiveCampaignLinks prefectureSlug={prefectureSlug} citySlug={citySlug} currentPaytype={currentPaytype} limit={6} />;
}
