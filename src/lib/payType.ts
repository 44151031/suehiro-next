// ✅ PayType マスター（文字列キーを使用）
export const PayTypes = {
  paypay: {
    label: "PayPay",
    badge: { label: "P", bg: "#ef2a36" },
  },
  aupay: {
    label: "au PAY",
    badge: { label: "au", bg: "#f58220" },
  },
  rakutenpay: {
    label: "楽天ペイ",
    badge: { label: "楽", bg: "#bf0000" },
  },
  dbarai: {
    label: "d払い",
    badge: { label: "d", bg: "#b11f27" },
  },
  aeonpay: {
    label: "AEON Pay",
    badge: { label: "イ", bg: "#524fa5" },
  },
} as const;

// ✅ paytype に使う型（"paypay" | "aupay" | ...）
export type PayTypeId = keyof typeof PayTypes;

// ✅ ラベルマップ
export const PayTypeLabels: Record<PayTypeId, string> = Object.fromEntries(
  Object.entries(PayTypes).map(([id, v]) => [id, v.label])
) as Record<PayTypeId, string>;

// ✅ バッジマップ
export const PayTypeBadgeMap: Record<PayTypeId, { label: string; bg: string }> = Object.fromEntries(
  Object.entries(PayTypes).map(([id, v]) => [id, v.badge])
) as Record<PayTypeId, { label: string; bg: string }>;