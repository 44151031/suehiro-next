// /lib/genreSortPriority.ts

const genrePriority = [
  "ガソリンスタンド",
  "リカーショップ・酒屋",
  "酒屋・リカーショップ",
  "スーパーマーケット",
  "スーパー・食品",
  "ドラッグストア",
  "飲食店",
  "量販店",
  "家電量販店",
  "飲食",
  "小売",
  "理美容・ヘアサロン",
  "宿泊",
  "サービス",
  "コンビニ",
  "スーパー",
  "家電量販店",
  "百貨店",
  "衣料品",
  "書店",
  "その他",
];

export function sortGenresByPriority(genres: string[]): string[] {
  const sorted = [...genres].sort((a, b) => {
    const indexA = genrePriority.indexOf(a);
    const indexB = genrePriority.indexOf(b);

    const safeIndexA = indexA === -1 ? genrePriority.length : indexA;
    const safeIndexB = indexB === -1 ? genrePriority.length : indexB;

    return safeIndexA - safeIndexB;
  });

  // 「その他」を最後に移動
  const others = sorted.filter((g) => g === "その他");
  const rest = sorted.filter((g) => g !== "その他");
  return [...rest, ...others];
}
