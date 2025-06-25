import { useEffect, useState, useRef } from "react";
import { Campaign } from "@/types/campaign";
import { prefectures } from "@/lib/prefectures";
import { useLocationStore } from "@/stores/locationStore";

// 距離計算（Haversine）
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180; // ✅ 修正箇所
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useFilteredAndSortedCampaigns(campaigns: Campaign[]) {
  const [sorted, setSorted] = useState<Campaign[] | undefined>(undefined); // ✅ 修正箇所
  const { fetched, lat, lng } = useLocationStore();

  const lastLatRef = useRef<number | null>(null);
  const lastLngRef = useRef<number | null>(null);

  useEffect(() => {
    if (!fetched || lat == null || lng == null) return;

    // 緯度経度が前回と同じなら再処理しない
    if (lastLatRef.current === lat && lastLngRef.current === lng) return;

    lastLatRef.current = lat;
    lastLngRef.current = lng;

    const now = new Date();

    const upcomingOrActive = campaigns.filter((c) => {
      return new Date(c.endDate) >= now || new Date(c.startDate) > now;
    });

    const enriched = upcomingOrActive
      .map((c) => {
        const pref = prefectures.find((p) => p.slug === c.prefectureSlug);
        if (!pref) return null;
        const distance = getDistance(lat, lng, pref.lat, pref.lng);
        return { ...c, distance };
      })
      .filter((c): c is Campaign & { distance: number } => c !== null)
      .sort((a, b) => a.distance - b.distance);

    setSorted(enriched.slice(0, 6));
  }, [fetched, lat, lng, campaigns]);

  return sorted ?? []; // ✅ 修正箇所
}
