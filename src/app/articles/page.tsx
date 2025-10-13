import ArticleList, { ArticleListItemData } from "@/components/articles/ArticleList";
import { createClientPublic } from "@/lib/supabase/public";

export const revalidate = 0;

export default async function ArticlesIndexPage() {
  const supabase = createClientPublic();

  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, hero_image_url, published_at")
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load: {error.message}
      </div>
    );
  }

  const items: ArticleListItemData[] = (data ?? []).map((a) => ({
    id: String(a.id),
    title: a.title,
    slug: a.slug,
    hero_image_url: a.hero_image_url,
    published_at: a.published_at as string,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <ArticleList items={items} heading="新着記事" />
    </main>
  );
}
