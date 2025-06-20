import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import { prefectures } from "@/lib/prefectures";

// 距離計算（Haversine）
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useFilteredAndSortedCampaigns(campaigns: Campaign[]) {
  const [sorted, setSorted] = useState<Campaign[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: userLat, longitude: userLng } = position.coords;

      const upcomingOrActive = campaigns.filter((c) => {
        const now = new Date();
        return new Date(c.endDate) >= now || new Date(c.startDate) > now;
      });

      const enriched = upcomingOrActive
        .map((c) => {
          const pref = prefectures.find((p) => p.slug === c.prefectureSlug);
          if (!pref) return null; // ← 一致しない場合除外
          const distance = getDistance(userLat, userLng, pref.lat, pref.lng);
          return { ...c, distance };
        })
        .filter((c): c is Campaign & { distance: number } => c !== null)
        .sort((a, b) => a.distance - b.distance);

      setSorted(enriched.slice(0, 6));
    });
  }, [campaigns]);

  return sorted;
}
