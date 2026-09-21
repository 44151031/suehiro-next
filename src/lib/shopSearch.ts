import type { Shop } from "@/types/shop";

export type ShopSort = "default" | "name" | "address" | "likes";

export function normalizeShopSearch(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase("ja-JP")
    .replace(/[ァ-ヶ]/g, char => String.fromCharCode(char.charCodeAt(0) - 0x60));
}

export function filterShopGroups(groups: Record<string, Shop[]>, filters: {
  query: string; genre: string; voucher: "all" | "common" | "local"; benefit: string;
}): Record<string, Shop[]> {
  const words = normalizeShopSearch(filters.query).trim().split(/\s+/).filter(Boolean);
  return Object.fromEntries(Object.entries(groups)
    .filter(([genre]) => filters.genre === "all" || genre === filters.genre)
    .map(([genre, shops]) => [genre, shops.filter(shop => {
      const text = normalizeShopSearch(`${shop.name} ${shop.address} ${genre}`);
      return words.every(word => text.includes(word)) &&
        (filters.voucher === "all" || shop.voucherTypes?.includes(filters.voucher)) &&
        (filters.benefit === "all" || (shop.benefit && `${shop.benefit.type}:${shop.benefit.rate}` === filters.benefit));
    })] as const).filter(([, shops]) => shops.length > 0));
}

export function sortShops(shops: Shop[], order: ShopSort, likes: Record<string, number>): Shop[] {
  const result = [...shops];
  if (order === "default") return result;
  return result.sort((a, b) => {
    if (order === "likes") return (likes[b.shopid ?? ""] ?? 0) - (likes[a.shopid ?? ""] ?? 0);
    const aValue = order === "address" ? a.address : a.name;
    const bValue = order === "address" ? b.address : b.name;
    if (!aValue || !bValue) return aValue ? -1 : bValue ? 1 : 0;
    return aValue.localeCompare(bValue, "ja", { numeric: true }) || a.name.localeCompare(b.name, "ja");
  });
}
