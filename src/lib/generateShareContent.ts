// /lib/generateShareContent.tsx

type GenerateShareContentParams = {
  city: string;
  payLabel: string;
  offer: number;
  style?: "impact" | "formal" | "limited" | "default";
};

export function generateShareContent({
  city,
  payLabel,
  offer,
  style = "default",
}: GenerateShareContentParams): {
  title: string;
  hashtags: string[];
} {
  const offerText = `${offer}%`;
  let title = "";

  switch (style) {
    case "impact":
      title = `${city}で${offerText}還元！${payLabel}キャンペーン開催中🔥`;
      break;
    case "formal":
      title = `${city}の${payLabel}${offerText}還元キャンペーン情報（公式まとめ）`;
      break;
    case "limited":
      title = `【期間限定】${city}で${offerText}還元！${payLabel}利用でお得に🉐`;
      break;
    case "default":
    default:
      title = `${city}で${payLabel}使うと最大${offerText}戻る！今すぐチェック👇`;
      break;
  }

  const hashtags = [
  "Payキャン",
  "キャッシュレス還元",
  payLabel,
  `${payLabel}${offer}パーセント還元`,
  `${city}`,
  ];

  return { title, hashtags };
}
