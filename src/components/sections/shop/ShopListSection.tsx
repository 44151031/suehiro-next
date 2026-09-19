import ShopList from "./ShopList";
import { getShopDetails } from "@/hooks/useShopDetails";
import type { Shop } from "@/types/shop";

type Props = {
  genre: string;
  shops: Shop[];
  detailsJsonPath: string;
  likesMap?: Record<string, number>;
  likedShopIds?: Set<string>;
};

/** 店舗詳細をサーバーで取得し、表示と開閉操作は共通のShopListに委譲する。 */
export default async function ShopListSection({
  genre,
  shops,
  detailsJsonPath,
  likesMap = {},
  likedShopIds = new Set<string>(),
}: Props) {
  const detailsMap = await getShopDetails(detailsJsonPath);

  return (
    <ShopList
      genre={genre}
      shops={shops}
      detailsMap={detailsMap}
      likesMap={likesMap}
      likedShopIds={likedShopIds}
    />
  );
}
