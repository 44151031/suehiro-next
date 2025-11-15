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
  const [ready, setReady] = useState<boolean>(false);
  const [isLimit, setIsLimit] = useState<boolean>(false); // ← 上限フラグ

  // JST 0:00～翌日0:00 を UTC に変換
  const getJSTRangeUTC = () => {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const startJST = new Date(jst.getFullYear(), jst.getMonth(), jst.getDate());
    const endJST = new Date(startJST);
    endJST.setDate(endJST.getDate() + 1);

    return {
      start: new Date(startJST.getTime() - 9 * 60 * 60 * 1000).toISOString(),
      end: new Date(endJST.getTime() - 9 * 60 * 60 * 1000).toISOString(),
    };
  };

  // GTM イベント送信
  const trackSupportEvent = (action: "added" | "removed") => {
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: action === "added" ? "support_added" : "support_removed",
        shop_id: shopid,
        event_category: "support",
        event_label: "support_button",
        value: 1,
      });
    }
  };

  // 初期ロード
  useEffect(() => {
    const init = async () => {
      try {
        const sid = await getOrSetSessionId();
        if (!sid) throw new Error("session id 未生成");

        // ❤️ 店舗の「総いいね数」を取得（集計テーブル）
        const { data: stat } = await supabaseClient
          .from("shop_stats")
          .select("likes_total")
          .eq("shopid", shopid)
          .maybeSingle();

        const total = stat?.likes_total ?? 0;
        setLikes(total);
        setIsLimit(total >= 10); // ❤️ 上限到達判定

        // 今日すでに押したか？
        const { start, end } = getJSTRangeUTC();
        const { data: existing } = await supabaseClient
          .from("support_events")
          .select("id")
          .eq("session_id", sid)
          .eq("shopid", shopid)
          .gte("created_at", start)
          .lt("created_at", end)
          .maybeSingle();

        setLiked(!!existing);
        setReady(true);
      } catch (_) {
        setTimeout(() => setReady(true), 3000);
      }
    };

    init();
  }, [shopid]);

  // ❤️ ボタン押下処理
  const handleClick = async () => {
    if (!ready) {
      toast.error("接続準備中です。数秒後にお試しください。");
      return;
    }

    // ❤️ 押せるけど通信しない：上限だけを弾く
    if (isLimit) {
      toast.error("このお店は応援上限に達しています。他のお店を応援してね。");
      return; // ← 通信させない！
    }

    if (pending) return;
    setPending(true);

    try {
      const result = await toggleSupport(shopid);

      if (result.status === "added") {
        setLiked(true);
        setLikes((prev) => {
          const next = prev + 1;
          if (next >= 10) setIsLimit(true);
          return next;
        });
        trackSupportEvent("added");
        toast.success("応援ありがとう！明日になれば同じお店を応援できるよ！");

      } else if (result.status === "removed") {
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
        trackSupportEvent("removed");
      } else if (result.status === "daily_limit") {
        toast.error("応援は1日3回までです。明日になれば、同じお店も応援できます！");
      } else if (result.status === "shop_limit") {
        setIsLimit(true);
        toast.error("このお店は応援上限に達しています。他のお店を応援してね。");
      }
    } catch (e) {
      toast.error("通信エラーが発生しました");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending || !ready} // ← 上限では無効化しない！
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
