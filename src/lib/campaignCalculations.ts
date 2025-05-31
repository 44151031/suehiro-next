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

// 小数第2位まで四捨五入する共通関数
function roundToTwoDecimalPlaces(num: number): number {
  return Math.round(num * 100) / 100;
}