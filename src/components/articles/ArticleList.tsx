import ArticleListItem from "./ArticleListItem";

export type ArticleListItemData = {
  id: string;
  title: string;
  slug: string;
  hero_image_url?: string | null;
  published_at: string; // ISO
  category?: string | null;
};

export default function ArticleList({
  items,
  heading = "新着記事",
  className = "",
}: {
  items: ArticleListItemData[];
  heading?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-5 border-b pb-2 text-xl font-bold">{heading}</h2>
      <div className="space-y-4">
        {items.length ? (
          items.map((a) => (
            <ArticleListItem
              key={a.id}
              title={a.title}
              slug={a.slug}
              hero_image_url={a.hero_image_url}
              published_at={a.published_at}
              category={a.category}
            />
          ))
        ) : (
          <p className="text-gray-500">記事がありません。</p>
        )}
      </div>
    </section>
  );
}
