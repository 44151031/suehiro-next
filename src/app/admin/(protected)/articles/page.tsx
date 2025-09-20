"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type Status = "draft" | "published" | "archived";

type Article = {
  id: string;
  public_id: string;
  title: string;
  slug: string;
  status: Status;
  published_at: string | null;
  updated_at: string | null;
};

// 日付フォーマット関数
function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("ja-JP");
}

// 日本語化ステータス
function getStatusLabel(status: Status) {
  switch (status) {
    case "draft":
      return "下書";
    case "published":
      return "公開";
    case "archived":
      return "非公開";
    default:
      return status;
  }
}

// 次のステータスを決定
function getNextStatus(current: Status): Status {
  if (current === "draft") return "published"; // 下書 → 公開
  if (current === "published") return "archived"; // 公開 → 非公開
  return "published"; // 非公開 → 公開
}

export default function AdminArticlesPage() {
  const searchParams = useSearchParams();

  const q = (searchParams.get("q") ?? "").trim();
  const status = searchParams.get("status") ?? "all";

  const [rows, setRows] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // 記事一覧を取得
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let query = supabaseClient
        .from("articles")
        .select("id, public_id, title, slug, status, published_at, updated_at")
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false });

      if (status !== "all") {
        query = query.eq("status", status);
      }
      if (q) {
        query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    }

    fetchData();
  }, [q, status]);

  // ステータス変更処理
  async function toggleStatus(article: Article) {
    const nextStatus = getNextStatus(article.status);

    if (!confirm(`この記事を「${getStatusLabel(nextStatus)}」に変更してよろしいですか？`)) {
      return;
    }

    setBusyId(article.id);
    try {
      const now = new Date().toISOString();
      const payload: any = {
        status: nextStatus,
        updated_at: now,
      };
      if (nextStatus === "published") {
        payload.published_at = article.published_at ?? now;
      } else {
        payload.published_at = null;
      }

      const { error } = await supabaseClient
        .from("articles")
        .update(payload)
        .eq("id", article.id);

      if (error) throw error;

      // フロント側の状態更新
      setRows((prev) =>
        prev.map((r) =>
          r.id === article.id
            ? { ...r, status: nextStatus, published_at: payload.published_at }
            : r
        )
      );
    } catch (err: any) {
      alert(err.message ?? "更新に失敗しました");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="p-6 bg-white">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">記事一覧</h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center rounded bg-gray-900 px-4 py-2 text-white hover:bg-black"
        >
          新規作成
        </Link>
      </div>

      {/* 検索フォーム */}
      <form
        className="mb-4 grid gap-3 sm:grid-cols-3"
        action="/admin/articles"
        method="get"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="タイトル/スラッグ検索"
          className="rounded border border-gray-300 px-3 py-2 bg-white"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded border border-gray-300 px-3 py-2 bg-white"
        >
          <option value="all">すべての状態</option>
          <option value="draft">下書</option>
          <option value="published">公開</option>
          <option value="archived">非公開</option>
        </select>
        <button className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
          絞り込む
        </button>
      </form>

      {/* 一覧 */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-50">
                <th className="border-b px-3 py-2">#</th>
                <th className="border-b px-3 py-2">タイトル</th>
                <th className="border-b px-3 py-2">スラグ</th>
                <th className="border-b px-3 py-2">状態</th>
                <th className="border-b px-3 py-2">公開日時</th>
                <th className="border-b px-3 py-2">更新日時</th>
                <th className="border-b px-3 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="border-b px-3 py-2 tabular-nums">
                      {r.public_id}
                    </td>
                    <td className="border-b px-3 py-2">
                      <Link
                        className="text-gray-800 hover:text-black hover:underline font-medium"
                        href={`/articles/${new Date().getFullYear()}/${String(
                          new Date().getMonth() + 1
                        ).padStart(2, "0")}/${r.slug}`}
                        target="_blank"
                      >
                        {r.title}
                      </Link>
                    </td>
                    <td className="border-b px-3 py-2 text-gray-600">
                      {r.slug}
                    </td>
                    <td
                      className="border-b px-3 py-2 cursor-pointer text-gray-800 hover:text-black hover:underline"
                      onClick={() => toggleStatus(r)}
                    >
                      {busyId === r.id ? "更新中..." : getStatusLabel(r.status)}
                    </td>
                    <td className="border-b px-3 py-2">
                      {formatDate(r.published_at)}
                    </td>
                    <td className="border-b px-3 py-2">
                      {formatDate(r.updated_at)}
                    </td>
                    <td className="border-b px-3 py-2 space-x-3">
                      <Link
                        className="text-gray-800 hover:text-black hover:underline"
                        href={`/admin/articles/${r.public_id}/edit`}
                      >
                        編集
                      </Link>
                      <Link
                        className="text-gray-800 hover:text-black hover:underline"
                        href={`/admin/articles/${r.public_id}/image`}
                      >
                        画像
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
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
      )}
    </main>
  );
}
