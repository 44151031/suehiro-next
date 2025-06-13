// /lib/campaignCalculations.ts

export function calculateOnePay(onepoint: number, offer: number): number {
  const result = onepoint / (offer / 100);
  return roundToTwoDecimalPlaces(result);
}

export function calculateFullPay(fullpoint: number, offer: number): number {
  const result = fullpoint / (offer / 100);
  return roundToTwoDecimalPlaces(result);
}

export function calculatePayTime(fullpay: number, onepay: number): number {
  if (onepay === 0) return 0;
  const result = fullpay / onepay;
  return roundToTwoDecimalPlaces(result);
}

export function sumFullpoint(campaigns: { fullpoint?: string }[]): number {
  return campaigns.reduce((sum, c) => {
    const pt = Number(c.fullpoint);
    return sum + (isNaN(pt) ? 0 : pt);
  }, 0);
}

// 小数第2位まで四捨五入する共通関数
function roundToTwoDecimalPlaces(num: number): number {
  return Math.round(num * 100) / 100;
}

/**
 * 開催予定（startDateが未来）のキャンペーンの fullpoint 合計
 */
export function sumFutureFullpoint(campaigns: { startDate: string; fullpoint?: string }[]): number {
  const now = new Date();
  return campaigns.reduce((sum, c) => {
    const start = new Date(c.startDate);
    const pt = Number(c.fullpoint);
    return start > now && !isNaN(pt) ? sum + pt : sum;
  }, 0);
}