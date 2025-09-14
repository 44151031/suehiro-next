import ArticleList, { ArticleListItemData } from "@/components/articles/ArticleList";
// ※ RSC でも使えるサーバークライアントを利用
import { createClientServer } from "@/lib/supabase/server";

export const revalidate = 60; // 表示キャッシュ

export default async function LatestArticles() {
  const supabase = await createClientServer();

  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, hero_image_url, published_at") // ← category を外す
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) {
    return (
      <section className="py-6">
        最新記事の取得に失敗しました（{error.message}）
      </section>
    );
  }

  const items: ArticleListItemData[] = (data ?? []).map((a) => ({
    id: String(a.id),
    title: a.title,
    slug: a.slug,
    hero_image_url: a.hero_image_url,
    published_at: a.published_at as string,
    // category はテーブルにないので渡さない（ArticleListItem 側は未指定OK）
  }));

  return <ArticleList items={items} heading="新着記事" className="py-6" />;
}
