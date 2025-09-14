// src/app/admin/page.tsx
import Link from "next/link";

export const revalidate = 0;

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">管理ダッシュボード</h1>

      {/* 3カラムの機能カード（とりあえず1枚だけ有効） */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 記事管理（有効リンク） */}
        <Link
          href="/admin/articles"
          className="group rounded-xl border bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow"
        >
          <div className="mb-2 text-sm font-medium text-gray-900">
            記事管理
          </div>
          <p className="text-sm text-gray-500">
            記事の一覧 / 新規作成 / 編集 ができます。
          </p>
          <div className="mt-3 text-xs text-blue-600 group-hover:underline">
            開く →
          </div>
        </Link>

        {/* 予備（今はダミーの無効カード） */}
        <div className="rounded-xl border bg-white p-5 opacity-60">
          <div className="mb-2 text-sm font-medium text-gray-900">メディア管理</div>
          <p className="text-sm text-gray-500">（後日実装予定）</p>
        </div>

        {/* 予備（今はダミーの無効カード） */}
        <div className="rounded-xl border bg-white p-5 opacity-60">
          <div className="mb-2 text-sm font-medium text-gray-900">ユーザー管理</div>
          <p className="text-sm text-gray-500">（後日実装予定）</p>
        </div>
      </div>
    </div>
  );
}
