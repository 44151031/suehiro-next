"use server";
import { revalidateTag, revalidatePath } from "next/cache";
import { createClientServerRSC } from "@/lib/supabase/rsc";
import { communityDatabase, communityTag } from "@/lib/shopCommunity";

export async function requireCommunityAdmin() {
  const auth = await createClientServerRSC();
  const { data: { user }, error } = await auth.auth.getUser();
  if (error || !user) throw new Error("管理者ログインが必要です。");
  const { data: profile } = await auth.from("profiles").select("is_admin").eq("id",user.id).single();
  if (!profile?.is_admin) throw new Error("管理者権限が必要です。");
  return user.id;
}
export async function reviewCommunityPost(form: FormData) {
  const reviewer = await requireCommunityAdmin();
  const id = String(form.get("id") ?? ""), status = String(form.get("status") ?? "");
  if (!/^[a-f0-9-]{36}$/i.test(id) || !["approved","hidden","resolved"].includes(status)) throw new Error("操作を確認してください。");
  const db = communityDatabase();
  const { data: post, error } = await db.from("shop_community_posts").select("kind,page_path").eq("id",id).single();
  if (error || !post || (status === "approved" && !["support","visit"].includes(post.kind))) throw new Error("この投稿は公開できません。");
  const { error: updateError } = await db.from("shop_community_posts").update({ status, reviewed_at: new Date().toISOString(), reviewed_by: reviewer }).eq("id",id);
  if (updateError) throw new Error("保存に失敗しました。再度お試しください。");
  revalidateTag(communityTag);
  revalidatePath(post.page_path);
  revalidatePath("/admin/community");
}
