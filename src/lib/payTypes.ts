export const PayTypes = {
  paypay: {
    label: "PayPay",
    badge: { label: "P", bg: "#ef2a36" },
  },
  aupay: {
    label: "au PAY",
    badge: { label: "au", bg: "#f58220" },
  },
  rakuten: {
    label: "楽天ペイ",
    badge: { label: "楽", bg: "#bf0000" },
  },
  dbarai: {
    label: "d払い",
    badge: { label: "d", bg: "#b11f27" },
  },
} as const;

export type PayTypeId = keyof typeof PayTypes;