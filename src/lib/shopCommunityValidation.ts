export type CommunityKind = "support" | "visit" | "correction" | "report";
export type PublicShopMessage = {
  id: string; shopid: string; kind: "support" | "visit";
  nickname: string; body: string; visit_month: string | null; created_at: string;
};
export const correctionReasons = ["店名・住所", "閉店・移転", "対象店舗・券の種類", "その他"] as const;

export function validateCommunityInput(value: unknown, now = new Date()) {
  if (!value || typeof value !== "object") throw new Error("入力内容を確認してください。");
  const v = value as Record<string, unknown>;
  if (v.consent !== "yes") throw new Error("送信への同意を確認してください。");
  const string = (key: string) => typeof v[key] === "string" ? (v[key] as string).trim() : "";
  const kind = string("kind") as CommunityKind;
  if (!["support", "visit", "correction", "report"].includes(kind)) throw new Error("投稿の種類を選んでください。");
  const body = string("body"), nickname = string("nickname") || "まちのお客さん";
  if (!body || [...body].length > (kind === "correction" || kind === "report" ? 300 : 100)) throw new Error("文字数を確認してください。");
  if ([...nickname].length > 20 || /[\r\n]/.test(nickname)) throw new Error("ニックネームは20文字以内で入力してください。");
  if (/(?:https?:\/\/|www\.|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\d[\d\s()-]{8,}\d)/i.test(body + " " + nickname)) throw new Error("URL・メールアドレス・電話番号は投稿できません。");
  const visitMonth = kind === "visit" ? string("visitMonth") : "";
  const currentMonth = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit" }).format(now);
  if (visitMonth && (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(visitMonth) || visitMonth > currentMonth)) throw new Error("訪問月を確認してください。");
  const reason = string("reason");
  if (kind === "correction" && !correctionReasons.includes(reason as typeof correctionReasons[number])) throw new Error("訂正の種類を選んでください。");
  const targetId = string("targetId");
  if (kind === "report" && !/^[0-9a-f-]{36}$/i.test(targetId)) throw new Error("対象の投稿を確認してください。");
  return { kind, body, nickname, visitMonth: visitMonth || null, reason: kind === "correction" ? reason : null, targetId: kind === "report" ? targetId : null };
}
