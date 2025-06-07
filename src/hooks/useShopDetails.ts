import { useEffect, useState } from "react";

type ShopDetail = {
  shopid: string;
  name: string;
  address: string;
  description: string;
  paytypes: string[];
  note?: string;
  homepage?: string;
  instagram?: string;
  x?: string;
  line?: string;
};

export function useShopDetails(jsonPath = "/data/shopsdetails/fukushima-kitakata-shops-details.json") {
  const [detailsMap, setDetailsMap] = useState<Record<string, ShopDetail>>({});

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const res = await fetch(jsonPath);
        if (!res.ok) throw new Error(`Failed to load: ${jsonPath}`);
        const data: ShopDetail[] = await res.json();
        const map = Object.fromEntries(data.map((item) => [item.shopid, item]));
        setDetailsMap(map);
      } catch (error) {
        console.error("ショップ詳細データの取得に失敗しました:", error);
      }
    };

    loadDetails();
  }, [jsonPath]);

  return { detailsMap };
}
