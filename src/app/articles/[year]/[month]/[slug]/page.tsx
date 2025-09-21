// src/app/articles/[year]/[month]/[slug]/page.tsx
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClientServerRSC } from "@/lib/supabase/rsc";
import { absoluteUrl } from "@/lib/url";
import Markdown from "@/components/articles/Markdown";
import Link from "next/link";

type Params = { year: string; month: string; slug: string };

async function fetchArticleBySlug(slug: string) {
  const supabase = await createClientServerRSC();
  const { data, error } = await supabase
    .from("articles")
    .select("id, public_id, title, dek, slug, status, body_md, hero_image_url, og_image_url, published_at, updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) return null;
  return data;
}

export default async function ArticlePage({ params }: { params: Params }) {
  const a = await fetchArticleBySlug(params.slug);
  if (!a || !a.published_at) notFound();

  const pub = new Date(a.published_at);
  const y = String(pub.getFullYear());
  const m = String(pub.getMonth() + 1).padStart(2, "0");
  if (params.year !== y || params.month !== m) {
    redirect(`/articles/${y}/${m}/${a.slug}`);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 左：記事本文 */}
      <article className="lg:col-span-8">
        {a.hero_image_url && (
          <div className="mb-6">
            <img
              src={a.hero_image_url}
              alt={a.title}
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl font-bold leading-tight">{a.title}</h1>
          {a.dek && (
            <p className="mt-3 text-xl text-gray-700 leading-relaxed">{a.dek}</p>
          )}
          <p className="mt-3 text-sm text-gray-500">
            公開日：{new Date(a.published_at).toLocaleDateString("ja-JP")}
            {a.updated_at && <>（最終更新：{new Date(a.updated_at).toLocaleDateString("ja-JP")}）</>}
          </p>
        </header>

        {/* 本文 */}
        <section
          className="
            prose prose-xl max-w-none leading-loose
            prose-p:my-6 prose-li:my-2
            prose-headings:font-bold
            prose-h2:!text-2xl prose-h2:!mt-12 prose-h2:!mb-6
            prose-h3:!text-xl prose-h3:!mt-8 prose-h3:!mb-4
            prose-h4:!text-lg prose-h4:!mt-6 prose-h4:!mb-3 prose-h4:!text-gray-700
            prose-a:text-blue-600 hover:prose-a:underline
            prose-ul:pl-6 prose-ol:pl-6
          "
        >
          <Markdown source={a.body_md ?? ""} />
        </section>

        {/* シェアボタン */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href={`https://twitter.com/share?url=${encodeURIComponent(
              absoluteUrl(`/articles/${y}/${m}/${a.slug}`)
            )}&text=${encodeURIComponent(a.title)}`}
            target="_blank"
            className="rounded bg-blue-500 px-3 py-1 text-white text-sm shadow hover:bg-blue-600"
          >
            Xでシェア
          </Link>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              absoluteUrl(`/articles/${y}/${m}/${a.slug}`)
            )}`}
            target="_blank"
            className="rounded bg-blue-700 px-3 py-1 text-white text-sm shadow hover:bg-blue-800"
          >
            Facebookでシェア
          </Link>
          <Link
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
              absoluteUrl(`/articles/${y}/${m}/${a.slug}`)
            )}`}
            target="_blank"
            className="rounded bg-green-500 px-3 py-1 text-white text-sm shadow hover:bg-green-600"
          >
            LINEでシェア
          </Link>
        </div>

        {/* 関連記事 */}
        <footer className="mt-12 border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold">関連記事</h2>
          <ul className="space-y-2 text-sm text-blue-600 underline">
            <li>
              <Link href="/articles/2025/08/paypay-campaign">
                8月限定PayPayキャンペーンまとめ
              </Link>
            </li>
            <li>
              <Link href="/articles/2025/07/furusato-trend">
                ふるさと納税トレンド解説
              </Link>
            </li>
          </ul>
        </footer>
      </article>

      {/* 右：サイドバー（変更なし） */}
      <aside className="lg:col-span-4 space-y-8">
        <div className="sticky top-20 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3">人気の記事</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/articles/2025/09/paypay-satofull"
                  className="text-blue-600 hover:underline"
                >
                  9月限定！さとふる×PayPay 最大21％還元
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/2025/08/cashless-overview"
                  className="text-blue-600 hover:underline"
                >
                  キャッシュレス還元の仕組み徹底解説
                </Link>
              </li>
              <li>
                <Link
                  href="/articles/2025/07/furusato-ban"
                  className="text-blue-600 hover:underline"
                >
                  ふるさと納税 ポイント禁止の全貌
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">注目のキャンペーン</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/campaigns/tokyo/sumida/paypay"
                  className="text-blue-600 hover:underline"
                >
                  墨田区 × PayPay
                </Link>
              </li>
              <li>
                <Link
                  href="/campaigns/saitama/gyoda/paypay"
                  className="text-blue-600 hover:underline"
                >
                  行田市 × PayPay
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </main>
  );
}
