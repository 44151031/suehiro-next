export type Campaign = {
  prefectureSlug: string;
  citySlug: string;
  prefecture: string;
  city: string;
  offer: number;           // ✅ 数値型に変更（例: 30）
  startDate: string;       // ISO日付形式
  endDate: string;
  onepoint: string;        // 単発上限ポイント
  fullpoint: string;       // 期間上限ポイント
  fullpay: string;         // 還元対象金額（例: "15000"）
  onepay: string;          // 単回の還元対象金額
  paytime: string;         // 回数（例: "3"）
};