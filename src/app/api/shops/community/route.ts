import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { communityDatabase, communityEnabled, communityScope } from "@/lib/shopCommunity";
import { validateCommunityInput } from "@/lib/shopCommunityValidation";
import { loadShopList } from "@/lib/loadShopList";

export async function POST(req: Request) {
  if (!communityEnabled()) return NextResponse.json({ error: "現在、投稿の受付を停止しています。" }, { status: 503 });
  const allowedOrigins = new Set([new URL(process.env.NEXT_PUBLIC_SITE_URL || req.url).origin]);
  if (process.env.VERCEL_ENV === "preview") {
    for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
      if (host && /^[a-z0-9.-]+\.vercel\.app$/i.test(host)) allowedOrigins.add(`https://${host}`);
    }
  }
  if (!allowedOrigins.has(req.headers.get("origin") ?? "")) return NextResponse.json({ error: "このページから送信してください。" }, { status: 403 });
  let input: Record<string, unknown>;
  try {
    const reader = req.body?.getReader();
    if (!reader) throw new Error();
    let size = 0; const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); throw new Error(); }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!input || typeof input !== "object") throw new Error();
  } catch { return NextResponse.json({ error: "入力内容を確認してください。" }, { status: 400 }); }
  if (input.website) return NextResponse.json({ error: "投稿を受け付けられませんでした。" }, { status: 400 });
  let post;
  try { post = validateCommunityInput(input); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400 }); }
  const scope = typeof input.pagePath === "string" ? communityScope(input.pagePath) : null;
  if (!scope || scope.key !== input.campaignKey || scope.end < new Date()) return NextResponse.json({ error: "受付対象のキャンペーンではありません。ページを再読み込みしてください。" }, { status: 400 });
  if (typeof input.shopid !== "string" || input.shopid.length > 150) return NextResponse.json({ error: "店舗を確認してください。" }, { status: 400 });
  const shops = await loadShopList(scope.prefecture, scope.city, scope.pay);
  const shop = Object.values(shops).flat().find(s => s.shopid === input.shopid);
  if (!shop) return NextResponse.json({ error: "掲載中の店舗を選んでください。" }, { status: 400 });
  try {
    const db = communityDatabase();
    if (post.targetId) {
      const { data, error } = await db.from("shop_community_posts").select("id").eq("id",post.targetId).eq("campaign_key",scope.key).eq("shopid",shop.shopid!).eq("status","approved").maybeSingle();
      if (error || !data) return NextResponse.json({ error: "対象の投稿が見つかりません。" }, { status: 400 });
    }
    // Vercel supplies this header; never accept the visitor's own fingerprint.
    const ip = process.env.VERCEL ? req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() : "local-development";
    if (!ip) return NextResponse.json({ error: "投稿元を確認できませんでした。" }, { status: 503 });
    const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
    const fingerprint = createHmac("sha256",process.env.SUPABASE_SERVICE_ROLE_KEY!).update(`${day}:${ip}`).digest("hex");
    const { error } = await db.rpc("submit_shop_community", { p_fingerprint: fingerprint, p_post: {
      campaign_key: scope.key, page_path: scope.pagePath, shopid: shop.shopid, shop_name: shop.name,
      kind: post.kind, nickname: post.nickname, body: post.body, visit_month: post.visitMonth, reason: post.reason, target_id: post.targetId,
    } });
    if (error) return NextResponse.json({ error: error.message.includes("community_rate_limit") ? "本日の投稿上限に達しました。明日以降にお試しください。" : "保存できませんでした。時間をおいてお試しください。" }, { status: error.message.includes("community_rate_limit") ? 429 : 503 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: "保存できませんでした。時間をおいてお試しください。" }, { status: 503 }); }
}
