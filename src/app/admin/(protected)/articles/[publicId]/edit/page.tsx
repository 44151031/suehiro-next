import { createClientServer } from "@/lib/supabase/server";
import EditClient from "./EditClient";

export type Article = {
  id: string;
  public_id: number;
  title: string;
  dek: string | null;
  slug: string;
  status: "draft" | "scheduled" | "published" | "archived";
  body_md: string;
  hero_image_url: string | null;
  og_image_url: string | null;
  published_at: string | null;
  updated_at: string | null;
};

export default async function Page({ params }: { params: { publicId: string } }) {
  const supabase = await createClientServer();

  if (process.env.NEXT_PUBLIC_SKIP_ADMIN_CHECK !== "true") {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return <div className="p-6">Login required</div>;
    const me = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!me.data?.is_admin) return <div className="p-6">Admin only</div>;
  }

  const pid = Number(params.publicId);
  if (!Number.isFinite(pid)) return <div className="p-6">Invalid ID</div>;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("public_id", pid)
    .single();

  if (error || !data) return <div className="p-6">Article not found</div>;

  return <EditClient initial={data as Article} />;
}
