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
  const [benefitFilter, setBenefitFilter] = useState("all");
  const benefits = useMemo(() => {
    const distinct = new Map<string, NonNullable<Shop["benefit"]>>();
    Object.values(shopListByGenre).flat().forEach(shop => {
      if (shop.benefit) distinct.set(`${shop.benefit.type}:${shop.benefit.rate}`, shop.benefit);
    });
    return [...distinct.entries()].sort((a, b) => b[1].rate - a[1].rate);
  }, [shopListByGenre]);
  const hasVoucherTypes = Object.values(shopListByGenre).flat().some(shop => shop.voucherTypes?.length);
  const hasBenefitRates = benefits.length > 1;
  const filteredShops = useMemo(() => Object.fromEntries(
    Object.entries(shopListByGenre).map(([genre, shops]) => [genre,
      shops.filter(shop => (voucherFilter === "all" || shop.voucherTypes?.includes(voucherFilter)) &&
        (benefitFilter === "all" || (shop.benefit && `${shop.benefit.type}:${shop.benefit.rate}` === benefitFilter)))
    ] as const).filter(([, shops]) => shops.length > 0)
  ), [shopListByGenre, voucherFilter, benefitFilter]);
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
    <div className="relative">
      {(hasVoucherTypes || hasBenefitRates) && (
        <div data-shop-filters className="sticky top-16 z-50 my-5 rounded-lg border border-gray-200 bg-white p-3 shadow-sm" role="region" aria-label="対象店舗の絞り込み">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
            <span className="font-semibold text-sm">対象店舗を絞り込み</span>
            <p className="text-sm" role="status">表示対象：{displayedCount}店舗</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {hasVoucherTypes && (
              <label className="flex flex-1 min-w-0 items-center gap-2 text-sm">
                <span className="shrink-0">商品券</span>
                <select name="voucher-type" value={voucherFilter}
                  onChange={e => setVoucherFilter(e.target.value as typeof voucherFilter)}
                  className="min-w-0 w-full rounded border border-gray-300 bg-white px-2 py-2">
                  <option value="all">すべて（絞り込みなし）</option>
                  <option value="common">共通券が使える店舗</option>
                  <option value="local">地元応援券が使える店舗</option>
                </select>
              </label>
            )}
            {hasBenefitRates && (
              <label className="flex flex-1 min-w-0 items-center gap-2 text-sm">
                <span className="shrink-0">還元率・割引率</span>
                <select name="benefit-rate" value={benefitFilter} onChange={e => setBenefitFilter(e.target.value)}
                  className="min-w-0 w-full rounded border border-gray-300 bg-white px-2 py-2">
                  <option value="all">すべての率</option>
                  {benefits.map(([value, benefit]) => <option key={value} value={value}>
                    {benefit.type === "cashback" ? `最大${benefit.rate}％還元` : `${benefit.rate}％割引`}
                  </option>)}
                </select>
              </label>
            )}
          </div>
        </div>
      )}
      {loading && <p className="text-sm text-gray-600" role="status">応援情報を読み込み中…</p>}
      {error && <p role="alert">応援情報を取得できませんでした。<button className="underline" onClick={() => setAttempt(x => x + 1)}>再試行</button></p>}
      <fieldset disabled={loading || error} className="min-w-0">
        <ShopSupportContext.Provider value={updateSupport}>
          {displayedCount === 0 && (hasVoucherTypes || hasBenefitRates) ? <p>選択した条件に一致する店舗はありません。</p> :
            <GenreShopLists shopListByGenre={filteredShops} detailsMap={detailsMap} ranking={[]} likesMap={likesMap} likedShopIds={likedShopIds} />}
        </ShopSupportContext.Provider>
      </fieldset>
    </div>
  );
}
