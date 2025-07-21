type GenerateShareContentParams = {
  city?: string;
  payLabel?: string;
  offer?: number;
  prefecture?: string;
  style?: "prefecture" | "city" | "impact" | "formal" | "limited" | "default" | "voucher"; // ← ✅ "voucher" を追加
};

export function generateShareContent({
  city,
  payLabel,
  offer,
  prefecture,
  style = "default",
}: GenerateShareContentParams): {
  title: string;
  hashtags: string[];
} {
  const offerText = offer !== undefined ? `${offer}%` : "";
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
    case "prefecture":
      title = `${prefecture}のキャッシュレス還元キャンペーンまとめ！`;
      break;
    case "city":
      title = `${city}のキャッシュレス還元キャンペーン一覧はこちら👇`;
      break;
    case "default":
    default:
      title = `${city}で${payLabel}使うと最大${offerText}戻る！今すぐチェック👇`;
      break;
  }

  const hashtags = ["Payキャン", "キャッシュレス還元"];

  if (payLabel) hashtags.push(payLabel);
  if (payLabel && offer) hashtags.push(`${payLabel}${offer}パーセント還元`);
  if (city) hashtags.push(city);
  if (!city && prefecture) hashtags.push(prefecture);

  return { title, hashtags };
}
