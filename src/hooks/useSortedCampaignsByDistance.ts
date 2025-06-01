"use client";

import { useEffect, useState } from "react";
import { prefectures } from "@/lib/prefectures";
import { getDistanceKm } from "@/lib/campaignUtils";
import { Campaign } from "@/types/campaign";

export function useSortedCampaignsByDistance(campaigns: Campaign[]): Campaign[] {
  const [sorted, setSorted] = useState<Campaign[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setSorted(campaigns);
      return;
    }

    const geoOptions = {
      timeout: 3000, // 3秒でタイムアウト
      maximumAge: 0,
      enableHighAccuracy: false,
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const userLat = coords.latitude;
        const userLng = coords.longitude;

        const distanceMap = prefectures.map((pref) => ({
          slug: pref.slug,
          distance: getDistanceKm(userLat, userLng, pref.lat, pref.lng),
        }));

        const sortedCampaigns = [...campaigns].sort((a, b) => {
          const aDist = distanceMap.find((d) => d.slug === a.prefectureSlug)?.distance ?? Infinity;
          const bDist = distanceMap.find((d) => d.slug === b.prefectureSlug)?.distance ?? Infinity;
          return aDist - bDist;
        });

        setSorted(sortedCampaigns);
      },
      (err) => {
        console.warn("位置情報の取得に失敗しました", err);
        setSorted(campaigns); // fallback
      },
      geoOptions
    );
  }, [campaigns]);

  return sorted;
}
