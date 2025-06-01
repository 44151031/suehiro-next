"use client";

import { useLocationStore } from "@/stores/locationStore";
import { useState } from "react";
import { Compass } from "lucide-react";

export default function GetLocationButton() {
  const { fetched, setLocation } = useLocationStore();
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
      },
      () => {
        alert("位置情報の取得に失敗しました");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center mt-10">
      <p className="text-sm text-neutral-600">
        {fetched
          ? "移動したら現在地を再取得してください。"
          : "このページを便利に使うために一度位置情報を取得してください。"}
      </p>
      <button
        onClick={handleGetLocation}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-full shadow transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]
          ${fetched ? "bg-gray-400 hover:bg-gray-500 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}
        `}
        disabled={loading}
      >
        <Compass className="w-5 h-5" />
        {loading
          ? "取得中…"
          : fetched
          ? "位置を再取得"
          : "現在地から探す"}
      </button>
    </div>
  );
}
