type GenerateShareContentParams = {
  city?: string;
  payLabel?: string;
  offer?: number;
  prefecture?: string;
  style?: "prefecture" | "city" | "impact" | "formal" | "limited" | "default" | "voucher" | "archive";
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
  const area = `${prefecture ?? ""}${city ?? ""}`; // 都道府県 + 市区町村（どちらか欠けてもOK）
  const offerText = offer !== undefined ? `${offer}%` : "";
  const pay = payLabel ?? "キャンペーン";

  let title = "";
  switch (style) {
    case "archive":
      title = `【終了】${area}の${pay}${offerText}還元キャンペーン開催実績`;
      break;
    case "impact":
      title = `${area}で${offerText}還元！${pay}開催中🔥`;
      break;
    case "formal":
      title = `${area}の${pay}${offerText}還元キャンペーン情報（公式まとめ）`;
      break;
    case "limited":
      title = `【期間限定】${area}で${offerText}還元！${pay}利用でお得に🉐`;
      break;
    case "prefecture":
      title = `${prefecture ?? ""}のキャッシュレス還元キャンペーンまとめ！`;
      break;
    case "city":
      title = `${area}のキャッシュレス還元キャンペーン一覧はこちら👇`;
      break;
    case "voucher":
      title = `${area}の${pay}${offerText ? ` 最大${offerText}お得` : ""}情報はこちら👇`.replace(/\s+/g, " ").trim();
      break;
    case "default":
    default:
      title =
        offerText && payLabel
          ? `${area}で${payLabel}使うと最大${offerText}戻る！今すぐチェック👇`
          : `${area}のお得情報をチェック👇`;
      break;
  }

  // 都道府県は必ずハッシュタグに含める
  const hashtagsBase = ["Payキャン", "キャッシュレス還元"];
  const hashtags = [
    ...hashtagsBase,
    ...(payLabel ? [payLabel] : []),
    ...(payLabel && offer !== undefined ? [`${payLabel}${offer}パーセント還元`] : []),
    ...(prefecture ? [prefecture] : []),
    ...(city ? [city] : []),
  ];

  // 重複除去
  const uniqueHashtags = Array.from(new Set(hashtags));

  return { title, hashtags: uniqueHashtags };
}
