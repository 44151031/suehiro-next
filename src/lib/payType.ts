export type PayTypeId = 1 | 2 | 3 | 4;

export const PayTypeLabels: Record<PayTypeId, string> = {
  1: "PayPay",
  2: "au PAY",
  3: "楽天ペイ",
  4: "d払い",
};

export const PayTypeSlugMap: Record<PayTypeId, string> = {
  1: "paypay",
  2: "aupay",
  3: "rakutenpay",
  4: "dbarai",
};

export const SlugToPayTypeId: Record<string, PayTypeId> = {
  paypay: 1,
  aupay: 2,
  rakutenpay: 3,
  dbarai: 4,
};
