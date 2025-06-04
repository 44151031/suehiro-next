// /components/sections/shop/ShopIntroCard.tsx

export function ShopIntroCard({ shop }: { shop: Shop }) {
  return (
    <div className="bg-white border border-neutral-300 rounded-2xl p-6 shadow-md space-y-4">
      <h2 className="text-lg font-bold">{shop.name}</h2>
      <p className="text-sm text-gray-600">{shop.address}</p>
      <div className="text-sm whitespace-pre-wrap text-gray-800">{shop.introduction}</div>
      {shop.tags && (
        <div className="flex flex-wrap gap-2 text-xs text-white">
          {shop.tags.map((tag) => (
            <span key={tag} className="bg-blue-500 rounded-full px-2 py-1">{tag}</span>
          ))}
        </div>
      )}
      {shop.images?.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {shop.images.map((url, i) => (
            <img key={i} src={url} alt={`店舗画像${i + 1}`} className="rounded-md" />
          ))}
        </div>
      )}
    </div>
  );
}
