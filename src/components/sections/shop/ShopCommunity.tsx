"use client";

import { createContext, useContext, useId, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Shop } from "@/types/shop";
import { correctionReasons, type CommunityKind, type PublicShopMessage } from "@/lib/shopCommunityValidation";

type Request = { shop: Shop; kind: CommunityKind; targetId?: string };
type Community = { key: string; pagePath: string; messages: PublicShopMessage[] };
const Context = createContext<{ messages: PublicShopMessage[]; open: (request: Request) => void } | null>(null);
export function useShopCommunity() { return useContext(Context); }

export function ShopCommunityProvider({ community, children }: { community: Community | null; children: ReactNode }) {
  const [request, setRequest] = useState<Request | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [composerKind, setComposerKind] = useState<"support" | "visit">("support");
  const trigger = useRef<HTMLElement | null>(null);
  const submitting = useRef(false);
  const uid = useId();
  if (!community) return <>{children}</>;
  const open = (next: Request) => {
    trigger.current = document.activeElement as HTMLElement;
    setRequest(next); setMessage(""); setSent(false); setComposerKind("support");
  };
  const privatePost = request?.kind === "correction" || request?.kind === "report";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request || !community || submitting.current) return;
    const data = new FormData(event.currentTarget);
    submitting.current = true; setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/shops/community", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...Object.fromEntries(data), pagePath: community.pagePath, campaignKey: community.key,
        shopid: request.shop.shopid, targetId: request.targetId, kind: privatePost ? request.kind : data.get("kind"),
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "保存できませんでした。");
      setSent(true);
      setMessage(privatePost ? "受け付けました。管理者が内容を確認します。自動で店舗情報が変更されることはありません。" : "ありがとうございます。管理者の確認後に公開します。内容によっては公開されない場合があります。");
      window.dataLayer?.push({ event: "shop_community_submitted", contribution_kind: privatePost ? request.kind : composerKind });
    } catch (error) { setMessage(error instanceof Error ? error.message : "通信に失敗しました。"); }
    finally { submitting.current = false; setBusy(false); }
  }
  return <Context.Provider value={{ messages: community.messages, open }}>
    {children}
    <Dialog.Root open={!!request} onOpenChange={value => { if (!value && !busy) setRequest(null); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
          <Dialog.Content onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }} className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%_-_2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 max-h-[85dvh] overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
          <Dialog.Title className="text-lg font-bold">{request?.kind === "report" ? "投稿の通報・削除依頼" : privatePost ? "店舗情報の訂正・追加" : "お店への応援・来店のひとこと"}</Dialog.Title>
          <Dialog.Description className="my-3 text-sm">{request?.shop.name}への{privatePost ? "連絡です。内容は一般公開されません。" : "メッセージです。投稿は任意です。"}</Dialog.Description>
          {!sent && <form onSubmit={submit} className="space-y-3">
            {!privatePost && <>
              <label className="block" htmlFor={`${uid}-kind`}>投稿の種類</label>
              <select id={`${uid}-kind`} name="kind" value={composerKind} onChange={event => setComposerKind(event.target.value as "support" | "visit")} className="w-full border rounded p-2"><option value="support">応援しています</option><option value="visit">行ってきました</option></select>
              <label className="block" htmlFor={`${uid}-nickname`}>ニックネーム（任意・20文字以内）</label>
              <input id={`${uid}-nickname`} name="nickname" maxLength={20} placeholder="まちのお客さん" className="w-full border rounded p-2" />
              {composerKind === "visit" && <><label className="block" htmlFor={`${uid}-month`}>訪問月（任意）</label>
              <input id={`${uid}-month`} name="visitMonth" type="month" className="border rounded p-2" /></>}
            </>}
            {request?.kind === "correction" && <><label className="block" htmlFor={`${uid}-reason`}>訂正の種類</label><select id={`${uid}-reason`} name="reason" className="w-full border rounded p-2">{correctionReasons.map(r => <option key={r}>{r}</option>)}</select></>}
            <label className="block" htmlFor={`${uid}-body`}>{privatePost ? "内容（300文字以内）" : "ひとこと（100文字以内）"}</label>
            <textarea id={`${uid}-body`} name="body" required maxLength={privatePost ? 300 : 100} rows={4} className="w-full border rounded p-2" placeholder={privatePost ? "確認してほしい内容を具体的にお書きください。" : "おすすめの商品や、次に訪れる人へのひとことなど"} />
            <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
            <p className="text-xs text-gray-600">本名・連絡先・URL・個人を特定する情報は書かないでください。無断転載や誹謗中傷は掲載できません。連投防止のため、通信元から作る日替わりの識別値を一時保存します。</p>
            <label className="flex gap-2 text-sm"><input type="checkbox" name="consent" value="yes" required />{privatePost ? "管理者への送信に同意します。" : "ニックネーム・本文・訪問月・投稿日が確認後に公開されることに同意します。"}</label>
            <button disabled={busy} className="rounded bg-pink-700 text-white px-4 py-2 disabled:opacity-50">{busy ? "送信中…" : "送信する"}</button>
          </form>}
          <p role="status" className="mt-3 text-sm">{message}</p>
          <Dialog.Close disabled={busy} className="mt-4 rounded border px-4 py-2">{sent ? "閉じる" : "今回は閉じる"}</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </Context.Provider>;
}

export function ShopCommunityActions({ shop }: { shop: Shop }) {
  const community = useShopCommunity();
  if (!community || !shop.shopid) return null;
  const messages = community.messages.filter(m => m.shopid === shop.shopid);
  return <div className="mt-3 border-t pt-2 text-xs" onClick={event => event.stopPropagation()}>
    <div className="flex flex-wrap gap-3">
      <button type="button" className="text-pink-700 underline py-1" onClick={() => community.open({ shop, kind: "support" })}>応援・来店のひとこと</button>
      <button type="button" className="text-gray-600 underline py-1" onClick={() => community.open({ shop, kind: "correction" })}>情報の訂正・追加</button>
    </div>
    {messages.length > 0 && <details className="mt-2"><summary className="cursor-pointer">みんなのひとこと（最新{messages.length}件）</summary>
      <p className="my-2 text-gray-500">利用者の投稿です。対象店舗・還元条件を保証するものではありません。</p>
      {messages.map(m => <div key={m.id} className="border-t py-2">
        <p className="font-semibold">{m.nickname} · {m.kind === "visit" ? "来店" : "応援"}</p>
        <p className="whitespace-pre-wrap break-words my-1">{m.body}</p>
        <p className="text-gray-500">{m.visit_month && `${m.visit_month}訪問 · `}{new Date(m.created_at).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}投稿</p>
        <button type="button" className="underline text-gray-500 mt-1" onClick={() => community.open({ shop, kind: "report", targetId: m.id })}>通報・削除依頼</button>
      </div>)}
    </details>}
  </div>;
}
