"use client";

import { useEffect, useState } from "react";
import { toggleSupport, getUserSupportsToday } from "@/app/actions/support";
import GenreShopLists from "@/components/sections/shop/GenreShopLists";
import type { Shop } from "@/types/shop";

type Props = {
  shopListByGenre: Record<string, Shop[]>;
  detailsJsonPath: string;
};

export default function ClientShopLists({ shopListByGenre, detailsJsonPath }: Props) {
  // 今日♥したショップID
  const [supportedShopIds, setSupportedShopIds] = useState<string[]>([]);
  // 各ショップのlikes数を管理
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  // 初期ロード時に今日の♥済みショップとlikesをセット
  useEffect(() => {
    (async () => {
      const ids = await getUserSupportsToday();
      setSupportedShopIds(ids);

      const initLikes: Record<string, number> = {};
      Object.values(shopListByGenre).forEach((shops) => {
        shops.forEach((shop) => {
          initLikes[shop.shopid] = shop.likes;
        });
      });
      setLikesMap(initLikes);
    })();
  }, [shopListByGenre]);

  // 応援クリック処理
  const handleToggle = async (shopid: string) => {
    const result = await toggleSupport(shopid);
    if (!result.ok) {
      alert(result.message);
      return;
    }

    // ♥状態を更新
    setSupportedShopIds((prev) =>
      result.liked ? [...prev, shopid] : prev.filter((id) => id !== shopid)
    );

    // likes数を更新
    setLikesMap((prev) => ({
      ...prev,
      [shopid]: result.likes,
    }));
  };

  return (
    <GenreShopLists
      shopListByGenre={shopListByGenre}
      detailsJsonPath={detailsJsonPath}
      supportedShopIds={supportedShopIds}
      likesMap={likesMap}
      onToggle={handleToggle}
    />
  );
}
