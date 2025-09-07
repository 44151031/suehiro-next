import Link from "next/link";
import { createClientServer } from "@/lib/supabase";

export const revalidate = 0; // 一覧は常に最新（開発中）

export default async function AdminArticlesPage() {
  const supabase = createClientServer();

  // 開発中は認証スキップ可（.env.local で true のとき）
  if (process.env.NEXT_PUBLIC_SKIP_ADMIN_CHECK !== "true") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return <div className="p-6">Login required</div>;
    const me = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!me.data?.is_admin) return <div className="p-6">Admin only</div>;
  }

  const { data = [], error } = await supabase
    .from("articles")
    .select("id, public_id, title, slug, status, updated_at, published_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Articles</h1>

      <div className="grid gap-2">
        {data.map((a) => (
          <div key={a.id} className="flex items-center justify-between border rounded p-3">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-500">
                ID:{a.public_id} / {a.slug} / {a.status}
              </div>
            </div>
            <Link href={`/admin/articles/${a.public_id}/edit`} className="underline">
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
