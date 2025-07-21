import { voucherCampaignMaster } from "@/lib/voucherCampaignMaster";
/**
 * 指定した都道府県の、市区町村の中で「商品券キャンペーンの申込がこれから or 現在受付中」の市区町村のみを返す
 */
export function getActiveOrUpcomingVoucherCities(prefectureSlug: string): {
  city: string;
  citySlug: string;
}[] {
  const now = new Date();

  return voucherCampaignMaster
    .filter((campaign) => {
      // 都道府県一致 + 申込期間が未来または現在中のもの
      if (campaign.prefectureSlug !== prefectureSlug) return false;
      const start = new Date(campaign.applicationStartDate ?? campaign.startDate);
      const end = new Date(campaign.applicationEndDate ?? campaign.endDate);
      return start > now || (start <= now && now <= end);
    })
    .reduce((acc, cur) => {
      // 重複する citySlug を除外
      if (!acc.some((c) => c.citySlug === cur.citySlug)) {
        acc.push({ city: cur.city, citySlug: cur.citySlug });
      }
      return acc;
    }, [] as { city: string; citySlug: string }[]);
}
/**
 * 商品券キャンペーンが存在するかを判定する
 */
export function hasVoucherCampaign(prefectureSlug: string, citySlug: string): boolean {
  return voucherCampaignMaster.some(
    (campaign) =>
      campaign.prefectureSlug === prefectureSlug &&
      campaign.citySlug === citySlug
  );
}

/**
 * voucherキャンペーンのURLを返す（存在しない場合は null）
 * /campaigns/[prefecture]/[city]/paypay-voucher 形式
 */
export function getVoucherCampaignUrl(
  prefectureSlug: string,
  citySlug: string
): string | null {
  const match = voucherCampaignMaster.find(
    (campaign) =>
      campaign.prefectureSlug === prefectureSlug &&
      campaign.citySlug === citySlug
  );

  if (!match) return null;

  return `/campaigns/${match.prefectureSlug}/${match.citySlug}/paypay-voucher`;
}


/**
 * 商品券の割引率（％）を計算します。
 *
 * 例：5,000円の商品券を4,000円で購入 → 割引率は 25%
 *
 * @param ticketAmount - 1口あたりの利用可能額（例：5000）
 * @param purchasePrice - 1口あたりの購入金額（例：4000）
 * @returns 割引率（整数％）を返す。不正な入力（0や負数、NaN等）の場合は 0 を返す
 */
export function calculateVoucherDiscountRate(
  ticketAmount: number,
  purchasePrice: number
): number {
  // 入力の妥当性チェック
  const isValidNumber = (n: number) =>
    typeof n === "number" && Number.isFinite(n) && n > 0;

  if (!isValidNumber(ticketAmount) || !isValidNumber(purchasePrice)) {
    return 0;
  }

  // 割引額
  const discount = ticketAmount - purchasePrice;

  // 割引がマイナスまたは0なら無効（値上げの場合など）
  if (discount <= 0) {
    return 0;
  }

  // 割引率計算：購入金額に対する割引額の割合
  const rate = (discount / purchasePrice) * 100;

  // 四捨五入し整数で返す
  return Math.round(rate);
}
