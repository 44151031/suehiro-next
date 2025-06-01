// ✅ 型定義として使用するIDとラベルのマスター
export const PayTypes = {
  1: { id: 1, slug: "paypay", label: "PayPay", badge: { label: "P", bg: "#ef2a36" } },
  2: { id: 2, slug: "aupay", label: "au PAY", badge: { label: "au", bg: "#f58220" } },
  3: { id: 3, slug: "rakutenpay", label: "楽天ペイ", badge: { label: "楽", bg: "#bf0000" } },
  4: { id: 4, slug: "dbarai", label: "d払い", badge: { label: "d", bg: "#b11f27" } },
} as const;

// ✅ PayTypeId の型（1 | 2 | 3 | 4）
export type PayTypeId = keyof typeof PayTypes;

// ✅ slug 型（"paypay" | "aupay" | ...）
export type PayTypeSlug = (typeof PayTypes)[PayTypeId]["slug"];

// ✅ 各種マップ展開（必要に応じて）
export const PayTypeLabels: Record<PayTypeId, string> = Object.fromEntries(
  Object.entries(PayTypes).map(([id, v]) => [id, v.label])
) as Record<PayTypeId, string>;

export const PayTypeSlugMap: Record<PayTypeId, string> = Object.fromEntries(
  Object.entries(PayTypes).map(([id, v]) => [id, v.slug])
) as Record<PayTypeId, string>;

export const SlugToPayTypeId: Record<PayTypeSlug, PayTypeId> = Object.fromEntries(
  Object.entries(PayTypes).map(([id, v]) => [v.slug, Number(id)])
) as Record<PayTypeSlug, PayTypeId>;

export const PayTypeBadgeMap: Record<PayTypeId, { label: string; bg: string }> = Object.fromEntries(
  Object.entries(PayTypes).map(([id, v]) => [id, v.badge])
) as Record<PayTypeId, { label: string; bg: string }>;
