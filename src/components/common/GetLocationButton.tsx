"use client";

import { useState } from "react";
import { useLocationStore } from "@/stores/locationStore";

export default function GetLocationButtonSection() {
  const { setLocation } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("このブラウザでは位置情報がサポートされていません。");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.error("位置情報の取得に失敗しました", err);
        setError("位置情報の取得に失敗しました。ブラウザの設定をご確認ください。");
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
      }
    );
  };

  return (
    <section className="w-full bg-[#f8f7f2] py-10 text-center">
      <button
        onClick={handleGetLocation}
        disabled={loading}
        className="inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "取得中…" : "現在地から近いキャンペーンを探す"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
