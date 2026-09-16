import Link from "next/link";
import { redirect } from "next/navigation";
import { communityDatabase } from "@/lib/shopCommunity";
import { requireCommunityAdmin, reviewCommunityPost } from "./actions";

export const dynamic = "force-dynamic";
const statusLabels: Record<string,string> = { pending: "未確認", approved: "公開中", hidden: "非公開", resolved: "対応済み" };
const kindLabels: Record<string,string> = { support: "応援", visit: "来店", correction: "情報訂正", report: "通報・削除依頼" };
export default async function CommunityAdmin({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  try { await requireCommunityAdmin(); }
  catch { redirect("/admin/login"); }
  const query = await searchParams;
  const status = query.status && statusLabels[query.status] ? query.status : "pending";
  const page = Math.max(1, Math.min(10000, Number.parseInt(query.page || "1",10) || 1));
  let result;
  try {
    result = await communityDatabase().from("shop_community_posts").select("id,campaign_key,page_path,shopid,shop_name,kind,nickname,body,visit_month,reason,target_id,status,created_at", { count: "exact" }).eq("status",status).order("created_at",{ascending:false}).range((page-1)*30,page*30-1);
  } catch { return <p>投稿機能は未設定です。Supabaseの保存先とサーバー環境変数を設定してください。</p>; }
  if (result.error) return <p>投稿を読み込めません。保存先の設定を確認してから再読み込みしてください。</p>;
  return <section className="space-y-5">
    <h1 className="text-xl font-bold">店舗への投稿管理</h1>
    <p className="text-sm">公開前に個人情報・宣伝・誹謗中傷・事実と異なる断定がないか確認してください。訂正依頼の「対応済み」は店舗データを自動変更しません。</p>
    <nav aria-label="投稿の状態" className="flex flex-wrap gap-4">{Object.entries(statusLabels).map(([key,label]) => <Link key={key} aria-current={status===key?"page":undefined} href={`/admin/community?status=${key}`} className="underline">{label}</Link>)}</nav>
    <p>{result.count ?? 0}件 · {page}ページ目</p>
    {result.data?.length === 0 && <p>この状態の投稿はありません。</p>}
    {result.data?.map(post => <article key={post.id} className="rounded border bg-white p-4 space-y-2">
      <h2 className="font-bold">{post.shop_name} · {kindLabels[post.kind]}</h2>
      <Link className="text-blue-700 underline text-sm" href={post.page_path}>掲載ページを見る</Link>
      <p className="text-xs break-all">開催回：{post.campaign_key}</p>
      <p className="text-sm">{post.nickname} · {new Date(post.created_at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}{post.visit_month && ` · ${post.visit_month}訪問`}</p>
      {post.reason && <p>訂正の種類：{post.reason}</p>}
      <p className="whitespace-pre-wrap break-words">{post.body}</p>
      {post.target_id && <ReportedPost id={post.target_id} />}
      <form action={reviewCommunityPost} className="flex flex-wrap gap-3">
        <input type="hidden" name="id" value={post.id} />
        {["support","visit"].includes(post.kind) && post.status !== "approved" && <button className="rounded bg-green-800 text-white px-3 py-2" name="status" value="approved">確認して公開</button>}
        {post.status !== "hidden" && <button className="rounded border px-3 py-2" name="status" value="hidden">非公開にする</button>}
        {["correction","report"].includes(post.kind) && post.status !== "resolved" && <button className="rounded border px-3 py-2" name="status" value="resolved">対応済みにする</button>}
      </form>
    </article>)}
    <nav className="flex gap-5">{page>1 && <Link href={`/admin/community?status=${status}&page=${page-1}`}>前へ</Link>}{(result.count ?? 0)>page*30 && <Link href={`/admin/community?status=${status}&page=${page+1}`}>次へ</Link>}</nav>
  </section>;
}
async function ReportedPost({ id }: { id: string }) {
  const { data } = await communityDatabase().from("shop_community_posts").select("nickname,body,status").eq("id",id).single();
  if (!data) return <p>対象投稿が見つかりません。</p>;
  return <aside className="border-l-4 pl-3">
    <p>通報対象：{data.nickname}（{statusLabels[data.status]}）</p><p className="whitespace-pre-wrap break-words">{data.body}</p>
    <form action={reviewCommunityPost}><input type="hidden" name="id" value={id}/><button className="underline py-2" name="status" value="hidden">対象の投稿を非公開にする</button></form>
  </aside>;
}
