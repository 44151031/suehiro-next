"use client";

import { useEffect, useState } from "react";
import { toggleSupport } from "@/lib/supportService";
import { toast } from "sonner";
import { supabaseClient } from "@/lib/supabase/client";
import { getOrSetSessionId } from "@/lib/sessionClient";

type Props = { shopid: string };

export default function SupportButton({ shopid }: Props) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false); // ✅ 初期化完了フラグ

  // ✅ JST の 0:00～翌日0:00 を UTC に変換して返す
  const getJSTRangeUTC = () => {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const startJST = new Date(jst.getFullYear(), jst.getMonth(), jst.getDate());
    const endJST = new Date(startJST);
    endJST.setDate(endJST.getDate() + 1);

    const startUTC = new Date(startJST.getTime() - 9 * 60 * 60 * 1000);
    const endUTC = new Date(endJST.getTime() - 9 * 60 * 60 * 1000);

    return { start: startUTC.toISOString(), end: endUTC.toISOString() };
  };

  // ✅ Google Analytics (GTM) イベント送信用ヘルパー
  const trackSupportEvent = (action: "added" | "removed") => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: action === "added" ? "support_added" : "support_removed",
        shop_id: shopid,
        event_category: "support",
        event_label: "support_button",
        value: 1,
      });
      console.log(`🟢 GA4 event pushed: ${action} (${shopid})`);
    } else {
      console.warn("⚠️ dataLayer is not available — GTM not loaded yet.");
    }
  };

  // ✅ 初期ロード（SupabaseとCookie準備が完了してから実行）
  useEffect(() => {
    const init = async () => {
      try {
        const sid = await getOrSetSessionId();
        if (!sid) throw new Error("session id 未生成");

        // ✅ 店舗の総いいね数（集計テーブルから取得）
        const { data: stat, error: statErr } = await supabaseClient
          .from("shop_stats")
          .select("likes_total")
          .eq("shopid", shopid)
          .maybeSingle();

        if (statErr) throw statErr;
        setLikes(stat?.likes_total ?? 0);

        // ✅ JST基準で「今日」応援したかチェック
        const { start, end } = getJSTRangeUTC();
        const { data: existing, error: existErr } = await supabaseClient
          .from("support_events")
          .select("id")
          .eq("session_id", sid)
          .eq("shopid", shopid)
          .gte("created_at", start)
          .lt("created_at", end)
          .maybeSingle();

        if (existErr) throw existErr;
        setLiked(!!existing);

        setReady(true); // ✅ 初期化完了
      } catch (e) {
        console.warn("初期化待機中:", e);
        setTimeout(() => setReady(true), 3000);
      }
    };

    init();
  }, [shopid]);

  // ✅ 応援ボタン押下時の処理
  const handleClick = async () => {
    if (!ready) {
      toast.error("接続準備中です。数秒後にお試しください。");
      return;
    }

    if (pending) return;
    setPending(true);

    try {
      const result = await toggleSupport(shopid);

      if (result.status === "added") {
        setLiked(true);
        setLikes((prev) => prev + 1);
        trackSupportEvent("added"); // ✅ GA4イベント送信
        toast.success("応援ありがとう！明日になれば同じお店を応援できるよ！");
      } else if (result.status === "removed") {
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
        trackSupportEvent("removed"); // ✅ GA4イベント送信
      } else if (result.status === "daily_limit") {
        toast.error("応援は1日3回までです。明日になれば、同じお店も応援できます！");
      } else if (result.status === "shop_limit") {
        toast.error("この店舗は応援上限に達しました。");
      }
    } catch (e) {
      console.error(e);
      toast.error("通信エラーが発生しました");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending || !ready}
      aria-disabled={pending || !ready}
      className={`flex items-center space-x-1 transition
        ${liked ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"}
        ${pending ? "opacity-60 pointer-events-none" : ""}
        ${!ready ? "opacity-40" : ""}
        px-2 py-[2px] text-xs rounded-md
        sm:px-3 sm:py-1 sm:text-sm sm:rounded-full
      `}
    >
      <span className="text-sm sm:text-lg">{liked ? "♥" : "♡"}</span>
      <span>{likes >= 10 ? "10+" : likes}</span>
    </button>
  );
}
