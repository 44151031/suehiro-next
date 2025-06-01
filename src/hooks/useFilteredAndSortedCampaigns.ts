// ✅ /hooks/useFilteredAndSortedCampaigns.ts
import { useEffect, useRef, useState } from "react";
import type { Campaign } from "@/types/campaign";
import { useLocationStore } from "@/stores/locationStore";
import { calculateDistance, getPrefectureCoordinates } from "@/lib/campaignUtils";

export function useFilteredAndSortedCampaigns(campaigns: Campaign[]): Campaign[] {
  const { lat, lng, fetched } = useLocationStore();
  const campaignsRef = useRef(campaigns);
  const [sorted, setSorted] = useState<Campaign[]>(campaignsRef.current);

  useEffect(() => {
    if (!fetched || lat == null || lng == null) {
      setSorted(campaignsRef.current);
      return;
    }

    const enriched = campaignsRef.current
      .map((c) => {
        const coords = getPrefectureCoordinates(c.prefectureSlug);
        if (!coords) return null;
        return {
          campaign: c,
          distance: calculateDistance(lat, lng, coords.lat, coords.lng),
        };
      })
      .filter((e): e is { campaign: Campaign; distance: number } => !!e)
      .sort((a, b) => a.distance - b.distance)
      .map((e) => e.campaign);

    setSorted(enriched);
  }, [lat, lng, fetched]);

  return sorted;
}
