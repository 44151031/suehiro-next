// src/components/sections/LatestArticles.tsx
import Link from "next/link";
import { createClientServerReadOnly } from "@/lib/supabase/server"; // ← これに変更

export const revalidate = 60; // 表示キャッシュ

type Row = {
  id: string | number;
  title: string;
  slug: string;
  hero_image_url: string | null;
  published_at: string; // timestamptz
};

function formatJPDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

function articlePath(iso: string, slug: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `/articles/${y}/${m}/${slug}`;
}

export default async function LatestArticles() {
  const supabase = await createClientServerReadOnly(); // ← こちらを使用
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, hero_image_url, published_at")
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          最新記事の取得に失敗しました（{error.message}）
        </div>
      </section>
    );
  }

  const rows = (data ?? []) as Row[];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* 見出し（トンマナ合わせ） */}
      <header className="mb-6 flex items-center gap-3">
        <h2 className="text-lg font-semibold tracking-wide">新着記事</h2>
        <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-600">
          NEW
        </span>
      </header>

      {/* 記事カード（白カード / 角丸2xl / 微ボーダー / 淡い影） */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((a) => {
          const href = articlePath(a.published_at, a.slug);
          return (
            <Link
              key={a.id}
              href={href}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
            >
              {/* サムネイル 16:9（画像なしは淡グラデ） */}
              <div className="relative aspect-[16/9] w-full bg-slate-100">
                {a.hero_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.hero_image_url}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-200" />
                )}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
              </div>

              {/* テキスト */}
              <div className="space-y-2 p-4">
                <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
                  {a.title}
                </h3>
                <time dateTime={a.published_at} className="block text-xs text-gray-500">
                  {formatJPDate(a.published_at)}
                </time>
                <div className="flex items-center justify-end">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                    記事を読む
                    <svg
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L13.586 11H4a1 1 0 1 1 0-2h9.586l-3.293-3.293a1 1 0 0 1 0-1.414Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
