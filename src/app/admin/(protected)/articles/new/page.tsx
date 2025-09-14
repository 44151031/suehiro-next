// src/app/admin/(protected)/articles/new/page.tsx
import Link from "next/link";
import { createClientServerRSC } from "@/lib/supabase/rsc";
import NewClient from "./NewClient";

export const revalidate = 0;

export default async function Page() {
  // （protected レイアウトで認証チェック済み。必要なら user 取得）
  const supabase = await createClientServerRSC();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Article</h1>
        <Link href="/admin/articles" className="text-sm underline">
          Back
        </Link>
      </div>

      <NewClient authorId={user?.id ?? null} />
    </div>
  );
}
