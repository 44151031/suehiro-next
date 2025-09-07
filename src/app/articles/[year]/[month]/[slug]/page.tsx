// src/app/articles/[year]/[month]/[slug]/page.tsx
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClientServer } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/url";
import Markdown from "@/components/articles/Markdown"; // ★ 追加

type Params = { year: string; month: string; slug: string };

async function fetchArticleBySlug(slug: string) {
  const supabase = createClientServer();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, public_id, title, dek, slug, status, body_md, hero_image_url, og_image_url, published_at, updated_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) return null;
  return data;
}

/** メタ生成（SSR） */
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const a = await fetchArticleBySlug(params.slug);
  if (!a || !a.published_at) return {};

  // 正規の年月に揃えたパス
  const pub = new Date(a.published_at);
  const y = String(pub.getFullYear());
  const m = String(pub.getMonth() + 1).padStart(2, "0");
  const canonicalPath = `/articles/${y}/${m}/${a.slug}`;

  const siteName = "Payキャン（ペイキャン）";
  const title = a.title ?? siteName;
  const description = a.dek || `${siteName}のキャンペーン情報`;
  const ogImg =
    a.og_image_url || a.hero_image_url || absoluteUrl("/og-default.jpg"); // ←無ければデフォルト画像

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: a.published_at || undefined,
      modifiedTime: a.updated_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImg],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const a = await fetchArticleBySlug(params.slug);
  if (!a || !a.published_at) notFound();

  // カノニカルな年月に強制
  const pub = new Date(a.published_at);
  const y = String(pub.getFullYear());
  const m = String(pub.getMonth() + 1).padStart(2, "0");
  if (params.year !== y || params.month !== m) {
    redirect(`/articles/${y}/${m}/${a.slug}`);
  }

  // JSON-LD（Article）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek || undefined,
    datePublished: a.published_at,
    dateModified: a.updated_at || a.published_at,
    mainEntityOfPage: absoluteUrl(`/articles/${y}/${m}/${a.slug}`),
    image: a.og_image_url || a.hero_image_url || undefined,
    author: { "@type": "Organization", name: "Payキャン（ペイキャン）" },
    publisher: {
      "@type": "Organization",
      name: "Payキャン（ペイキャン）",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* JSON-LD を head に出す（App RouterではここでOK） */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">{a.title}</h1>
          {a.dek ? <p className="mt-2 text-gray-600">{a.dek}</p> : null}
          <p className="mt-2 text-sm text-gray-500">
            公開日：{new Date(a.published_at).toLocaleDateString("ja-JP")}
            {a.updated_at ? (
              <>（最終更新：{new Date(a.updated_at).toLocaleDateString("ja-JP")}）</>
            ) : null}
          </p>
        </header>

        {a.hero_image_url ? (
          <div className="mb-6">
            <img src={a.hero_image_url} alt={a.title} className="w-full rounded" />
          </div>
        ) : null}

        {/* ★ ここを Markdown コンポーネントに置き換え */}
        <section className="prose prose-neutral max-w-none">
          <Markdown source={a.body_md ?? ""} />
        </section>
      </article>
    </main>
  );
}
