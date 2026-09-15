import ClientShopLists from "./ClientShopLists";
import { ShopCommunityProvider } from "./ShopCommunity";
import { getCommunity } from "@/lib/shopCommunity";
import type { Shop } from "@/types/shop";
import type { ShopDetail } from "@/hooks/useShopDetails";

export default async function CommunityShopLists({ pagePath, shopListByGenre, detailsMap }: {
  pagePath: string; shopListByGenre: Record<string, Shop[]>; detailsMap: Record<string, ShopDetail>;
}) {
  const community = await getCommunity(pagePath);
  return <ShopCommunityProvider community={community}>
    <ClientShopLists shopListByGenre={shopListByGenre} detailsMap={detailsMap} />
  </ShopCommunityProvider>;
}
