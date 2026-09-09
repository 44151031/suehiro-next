"use client";

import { useState, useEffect, useMemo } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import GenreShopLists from "./GenreShopLists";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";

type Props = { shopListByGenre: Record<string, Shop[]>; detailsMap: Record<string, ShopDetail> };

export default function ClientShopLists({ shopListByGenre, detailsMap }: Props) {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedShopIds, setLikedShopIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const ids = useMemo(() => [...new Set(Object.values(shopListByGenre).flat().flatMap(s => s.shopid ? [s.shopid] : []))], [shopListByGenre]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      setError(false);
      try {
        // Fetch this page in bounded batches, never one request per button.
        // The cookie endpoint shares its session with the toggle action.
        const map: Record<string, number> = {};
        for (let i = 0; i < ids.length; i += 100) {
          const { data, error } = await supabaseClient.from("shop_stats")
            .select("shopid,likes_total").in("shopid", ids.slice(i, i + 100));
          if (error) throw error;
          for (const row of data ?? []) map[row.shopid] = row.likes_total ?? 0;
        }
        const res = await fetch("/api/shops/likes/today", { cache: "no-store" });
        if (!res.ok) throw new Error("support state unavailable");
        const liked: string[] = await res.json();
        if (!cancelled) {
          setLikesMap(map);
          setLikedShopIds(new Set(liked));
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (ids.length) init();
    else setLoading(false);
    return () => { cancelled = true; };
  }, [ids, attempt]);

  return (
    <>
      {loading && <p className="text-sm text-gray-600" role="status">応援情報を読み込み中…</p>}
      {error && <p role="alert">応援情報を取得できませんでした。<button className="underline" onClick={() => setAttempt(x => x + 1)}>再試行</button></p>}
      <fieldset disabled={loading || error} className="min-w-0">
        <GenreShopLists shopListByGenre={shopListByGenre} detailsMap={detailsMap} ranking={[]} likesMap={likesMap} likedShopIds={likedShopIds} />
      </fieldset>
    </>
  );
}
