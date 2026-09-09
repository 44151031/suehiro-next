import sources from "../../../../public/data/shop-list-sources.json";

type Source = { url: string; checkedAt: string; sourceDate?: string; note: string; count: number };

export default function ShopListSource({ listKey }: { listKey: string }) {
  const source = (sources as Record<string, Source>)[listKey];
  if (!source) return null;
  return (
    <aside className="my-4 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 space-y-2">
      <p><a href={source.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">公式の対象店舗一覧</a>
        {source.sourceDate && `（${source.sourceDate}版）`}｜確認日：{source.checkedAt}｜掲載：{source.count}店舗</p>
      <p>{source.note}</p>
      <p>対象店舗は追加・変更される場合があります。お支払い前に店頭や決済アプリでご確認ください。</p>
    </aside>
  );
}
