// src/app/admin/(protected)/articles/new/page.tsx
import { createClientServerRSC } from "@/lib/supabase/rsc";
import NewClient from "./NewClient";

export const revalidate = 0;

export default async function Page() {
  // （protected レイアウトで認証チェック済み。必要なら user 取得）
  const supabase = await createClientServerRSC();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-6">
      <NewClient authorId={user?.id ?? null} />
    </div>
  );
}
