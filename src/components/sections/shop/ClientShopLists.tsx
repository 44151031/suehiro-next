"use client";

import { useState, useEffect, useMemo, useId } from "react";
import { filterShopGroups, type ShopSort } from "@/lib/shopSearch";
import { sortGenresByPriority } from "@/lib/genreSortPriority";
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
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<ShopSort>("default");
  const controlId = useId();
  const genres = useMemo(() => sortGenresByPriority(Object.keys(shopListByGenre)), [shopListByGenre]);
  const totalCount = useMemo(() => Object.values(shopListByGenre).reduce((sum, shops) => sum + shops.length, 0), [shopListByGenre]);
  const hasFilters = query.trim() !== "" || genreFilter !== "all" || voucherFilter !== "all" || benefitFilter !== "all";
  const resetFilters = () => {
    setQuery(""); setGenreFilter("all"); setVoucherFilter("all"); setBenefitFilter("all");
  };
  useEffect(() => {
    const showGenre = (event: Event) => {
      const genre = (event as CustomEvent<unknown>).detail;
      if (typeof genre !== "string" || !genres.includes(genre)) return;
      setQuery(""); setGenreFilter(genre); setVoucherFilter("all"); setBenefitFilter("all");
      // Keep the existing category anchors useful after filtering hides a category.
      requestAnimationFrame(() => document.getElementById(`genre-${genre}`)?.scrollIntoView({ block: "start" }));
    };
    window.addEventListener("shop-genre-select", showGenre);
    return () => window.removeEventListener("shop-genre-select", showGenre);
  }, [genres]);
  const benefits = useMemo(() => {
    const distinct = new Map<string, NonNullable<Shop["benefit"]>>();
    Object.values(shopListByGenre).flat().forEach(shop => {
      if (shop.benefit) distinct.set(`${shop.benefit.type}:${shop.benefit.rate}`, shop.benefit);
    });
    return [...distinct.entries()].sort((a, b) => b[1].rate - a[1].rate);
  }, [shopListByGenre]);
  const hasVoucherTypes = Object.values(shopListByGenre).flat().some(shop => shop.voucherTypes?.length);
  const hasBenefitRates = benefits.length > 1;
  const filteredShops = useMemo(() => filterShopGroups(shopListByGenre, {
    query, genre: genreFilter, voucher: voucherFilter, benefit: benefitFilter,
  }), [shopListByGenre, query, genreFilter, voucherFilter, benefitFilter]);
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
      {totalCount > 0 && (
        <div id="shop-search" data-shop-filters className="scroll-mt-40 my-5 rounded-xl border border-pink-200 bg-white p-4 sm:p-5 shadow-sm" role="search" aria-label="対象店舗を探す">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
            <h3 className="font-bold text-lg">対象店舗を探す</h3>
            <p className="text-sm" role="status" aria-live="polite" aria-atomic="true">該当：{displayedCount.toLocaleString("ja-JP")}店舗 / 掲載：{totalCount.toLocaleString("ja-JP")}店舗</p>
          </div>
          <p id={`${controlId}-help`} className="mb-4 text-sm text-gray-600">店名・住所の一部で検索できます。スペースで区切ると、すべての語を含む店舗を探せます。</p>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm font-semibold lg:col-span-2">
              店名・住所・キーワード
              <input type="search" value={query} onChange={event => setQuery(event.target.value)}
                aria-describedby={`${controlId}-help`} placeholder="例：カフェ 駅前"
                className="mt-1 block min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-normal focus-visible:outline-pink-600" />
            </label>
            <label className="text-sm font-semibold">
              業種
              <select value={genreFilter} onChange={event => setGenreFilter(event.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-normal focus-visible:outline-pink-600">
                <option value="all">すべての業種</option>
                {genres.map(genre => <option key={genre} value={genre}>{genre}（{shopListByGenre[genre].length}）</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">
              並び替え（業種内）
              <select value={sortOrder} onChange={event => setSortOrder(event.target.value as ShopSort)} className="mt-1 block min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base font-normal focus-visible:outline-pink-600">
                <option value="default">掲載順</option>
                <option value="name">店名順</option>
                <option value="address">住所順</option>
                <option value="likes" disabled={loading || error}>応援数の多い順</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {hasVoucherTypes && (
              <div role="group" aria-label="商品券で絞り込み" className="flex flex-wrap gap-2">
                {([
                  ["all", "すべて"],
                  ["common", "共通券"],
                  ["local", "地元応援券"],
                ] as const).map(([value, label]) => (
                  <button key={value} type="button" name="voucher-type" value={value}
                    aria-pressed={voucherFilter === value} onClick={() => setVoucherFilter(value)}
                    className={filterButtonClass(voucherFilter === value)}>{label}</button>
                ))}
              </div>
            )}
            {hasBenefitRates && (
              <div role="group" aria-label="還元率・割引率で絞り込み" className="flex flex-wrap gap-2">
                <button type="button" name="benefit-rate" value="all" aria-pressed={benefitFilter === "all"}
                  onClick={() => setBenefitFilter("all")} className={filterButtonClass(benefitFilter === "all")}>すべて</button>
                {benefits.map(([value, benefit]) => (
                  <button key={value} type="button" name="benefit-rate" value={value}
                    aria-pressed={benefitFilter === value} onClick={() => setBenefitFilter(value)}
                    className={filterButtonClass(benefitFilter === value)}>
                    {benefit.type === "cashback" ? `最大${benefit.rate}％還元` : `${benefit.rate}％割引`}
                  </button>
                ))}
              </div>
            )}
          </div>
          {hasFilters && <button type="button" onClick={resetFilters} className="mt-3 min-h-11 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">絞り込み条件をすべて解除</button>}
        </div>
      )}
      {loading && <p className="text-sm text-gray-600" role="status">応援情報を読み込み中…</p>}
      {error && <p role="alert">応援情報を取得できませんでした。<button className="underline" onClick={() => setAttempt(x => x + 1)}>再試行</button></p>}
      <fieldset disabled={loading || error} className="min-w-0">
        <ShopSupportContext.Provider value={updateSupport}>
          {displayedCount === 0 && hasFilters ? <p className="rounded-lg bg-gray-50 p-5">条件に一致する店舗はありません。店名を短くするか、業種や商品券などの条件を解除してお試しください。</p> :
            <GenreShopLists key={JSON.stringify([query, genreFilter, voucherFilter, benefitFilter, sortOrder])} shopListByGenre={filteredShops} detailsMap={detailsMap} ranking={[]} likesMap={likesMap} likedShopIds={likedShopIds} sortOrder={sortOrder} />}
        </ShopSupportContext.Provider>
      </fieldset>
    </div>
  );
}

function filterButtonClass(selected: boolean) {
  return "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 " +
    (selected ? "border-pink-600 bg-pink-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-pink-50");
}
