"use client";

import { useState, useEffect, useMemo } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import GenreShopLists from "./GenreShopLists";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";
import { ShopSupportContext } from "./ShopSupportContext";

type Props = { shopListByGenre: Record<string, Shop[]>; detailsMap: Record<string, ShopDetail> };

export default function ClientShopLists({ shopListByGenre, detailsMap }: Props) {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedShopIds, setLikedShopIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [voucherFilter, setVoucherFilter] = useState<"all" | "common" | "local">("all");
  const hasVoucherTypes = Object.values(shopListByGenre).flat().some(shop => shop.voucherTypes?.length);
  const filteredShops = useMemo(() => Object.fromEntries(
    Object.entries(shopListByGenre).map(([genre, shops]) => [genre,
      shops.filter(shop => voucherFilter === "all" || shop.voucherTypes?.includes(voucherFilter))
    ] as const).filter(([, shops]) => shops.length > 0)
  ), [shopListByGenre, voucherFilter]);
  const displayedCount = Object.values(filteredShops).reduce((sum, shops) => sum + shops.length, 0);
  const updateSupport = (shopid: string, likes: number, liked: boolean) => {
    setLikesMap(previous => ({ ...previous, [shopid]: likes }));
    setLikedShopIds(previous => {
      const next = new Set(previous);
      if (liked) next.add(shopid); else next.delete(shopid);
      return next;
    });
  };
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
      {hasVoucherTypes && (
        <fieldset className="my-5 rounded-lg border border-gray-200 bg-white p-4">
          <legend className="px-2 font-semibold">使える商品券で絞り込み</legend>
          <div className="flex flex-wrap gap-3">
            {([
              ["all", "すべて（絞り込みなし）"],
              ["common", "共通券が使える店舗"],
              ["local", "地元応援券が使える店舗"],
            ] as const).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 rounded border px-3 py-2 text-sm cursor-pointer">
                <input type="radio" name="voucher-type" value={value} checked={voucherFilter === value}
                  onChange={() => setVoucherFilter(value)} />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm" role="status">表示対象：{displayedCount}店舗</p>
        </fieldset>
      )}
      {loading && <p className="text-sm text-gray-600" role="status">応援情報を読み込み中…</p>}
      {error && <p role="alert">応援情報を取得できませんでした。<button className="underline" onClick={() => setAttempt(x => x + 1)}>再試行</button></p>}
      <fieldset disabled={loading || error} className="min-w-0">
        <ShopSupportContext.Provider value={updateSupport}>
          {displayedCount === 0 && hasVoucherTypes ? <p>この券種で利用できる店舗は登録されていません。</p> :
            <GenreShopLists shopListByGenre={filteredShops} detailsMap={detailsMap} ranking={[]} likesMap={likesMap} likedShopIds={likedShopIds} />}
        </ShopSupportContext.Provider>
      </fieldset>
    </>
  );
}
