/**
 * 商品券の割引率（％）を計算します。
 *
 * 例：5,000円の商品券を4,000円で購入 → 割引率は 25%
 *
 * @param ticketAmount - 1口あたりの利用可能額（例：5000）
 * @param purchasePrice - 1口あたりの購入金額（例：4000）
 * @returns 割引率（パーセント整数値。例：25）不正な入力の場合は 0 を返す
 */
export function calculateVoucherDiscountRate(
  ticketAmount: number,
  purchasePrice: number
): number {
  // 入力の妥当性チェック（0、NaN、Infinityなどを排除）
  if (
    !Number.isFinite(ticketAmount) ||
    !Number.isFinite(purchasePrice) ||
    purchasePrice <= 0
  ) {
    return 0;
  }

  const discount = ticketAmount - purchasePrice;
  const rate = (discount / purchasePrice) * 100;

  return Math.round(rate);
}
