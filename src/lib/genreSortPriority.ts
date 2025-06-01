// lib/shopGenrePriority.ts
export const genrePriority = [
  "ガソリンスタンド",
  "リカーショップ・酒屋",
  "量販店",
  "ドラッグストア",
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
  return [...genres].sort((a, b) => {
    const indexA = genrePriority.indexOf(a);
    const indexB = genrePriority.indexOf(b);
    const aIndex = indexA === -1 ? genrePriority.length : indexA;
    const bIndex = indexB === -1 ? genrePriority.length : indexB;
    return aIndex - bIndex;
  });
}