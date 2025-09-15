import Link from "next/link";
import { redirect } from "next/navigation";
import { createClientServerRSC } from "@/lib/supabase/rsc";

type SearchParams = {
  q?: string;
  status?: "all" | "draft" | "published" | "scheduled" | "archived";
};

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClientServerRSC();

  // 認証と管理者チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) redirect("/admin/login");

  // 検索条件
  const q = (searchParams.q ?? "").trim();
  const status = (searchParams.status ?? "all") as SearchParams["status"];

  let query = supabase
    .from("articles")
    .select("id, public_id, title, slug, status, published_at, updated_at")
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (q) {
    // タイトル/スラッグの部分一致（ilike）
    query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
  }

  const { data: rows, error } = await query.limit(50);
  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center rounded bg-gray-900 px-4 py-2 text-white hover:bg-black"
        >
          新規作成
        </Link>
      </div>

      {/* 検索フォーム（GET） */}
      <form
        className="mb-4 grid gap-3 sm:grid-cols-3"
        action="/admin/articles"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="タイトル/スラッグ検索"
          className="rounded border border-gray-300 px-3 py-2"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded border border-gray-300 px-3 py-2"
        >
          <option value="all">すべてのステータス</option>
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="scheduled">scheduled</option>
          <option value="archived">archived</option>
        </select>
        <button className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
          絞り込む
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="border-b px-3 py-2">#</th>
              <th className="border-b px-3 py-2">Title</th>
              <th className="border-b px-3 py-2">Slug</th>
              <th className="border-b px-3 py-2">Status</th>
              <th className="border-b px-3 py-2">Published</th>
              <th className="border-b px-3 py-2">Updated</th>
              <th className="border-b px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border-b px-3 py-2 tabular-nums">
                  {r.public_id}
                </td>
                <td className="border-b px-3 py-2">{r.title}</td>
                <td className="border-b px-3 py-2 text-gray-600">{r.slug}</td>
                <td className="border-b px-3 py-2">{r.status}</td>
                <td className="border-b px-3 py-2">
                  {r.published_at
                    ? new Date(r.published_at).toLocaleString("ja-JP")
                    : "-"}
                </td>
                <td className="border-b px-3 py-2">
                  {r.updated_at
                    ? new Date(r.updated_at).toLocaleString("ja-JP")
                    : "-"}
                </td>
                <td className="border-b px-3 py-2 space-x-3">
                  <Link
                    className="text-gray-900 underline"
                    href={`/admin/articles/${r.public_id}/edit`}
                  >
                    編集
                  </Link>
                  <Link
                    className="text-green-600 underline"
                    href={`/admin/articles/${r.public_id}/image`}
                  >
                    画像
                  </Link>
                </td>
              </tr>
            ))}
            {(!rows || rows.length === 0) && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-gray-500"
                >
                  記事がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
