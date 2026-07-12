"use client";

import { useEffect, useState } from "react";
import { toggleSupport as toggleSupportAction } from "@/app/actions/support";
import { toast } from "sonner";
import { supabaseClient } from "@/lib/supabase/client";
import { getOrSetSessionId } from "@/lib/sessionClient";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type SupportActionResult = {
  ok: boolean;
  liked: boolean;
  likes: number;
  message: string;
};

type Props = {
  shopid: string;
  /** 親から渡す初期いいね数（渡された場合 shop_stats クエリをスキップ） */
  initialLikes?: number;
  /** 親から渡す今日押し済みフラグ（渡された場合 support_events クエリをスキップ） */
  initialLiked?: boolean;
};

export default function SupportButton({ shopid, initialLikes, initialLiked }: Props) {
  const [likes, setLikes] = useState<number>(initialLikes ?? 0);
  const [liked, setLiked] = useState<boolean>(initialLiked ?? false);
  const [pending, setPending] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [isLimit, setIsLimit] = useState<boolean>((initialLikes ?? 0) >= 10);

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
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
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
    // 両方の初期値が親から渡された場合、Supabase クエリを完全スキップ
    if (initialLikes !== undefined && initialLiked !== undefined) {
      setReady(true);
      return;
    }

    const init = async () => {
      try {
        const sid = getOrSetSessionId();
        if (!sid) throw new Error("session id 未生成");

        // initialLikes が未提供の場合のみ shop_stats を取得
        if (initialLikes === undefined) {
          const { data: stat } = await supabaseClient
            .from("shop_stats")
            .select("likes_total")
            .eq("shopid", shopid)
            .maybeSingle();
          const total = stat?.likes_total ?? 0;
          setLikes(total);
          setIsLimit(total >= 10);
        }

        // initialLiked が未提供の場合のみ今日押し済みを確認
        if (initialLiked === undefined) {
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
        }

        setReady(true);
      } catch {
        setTimeout(() => setReady(true), 3000);
      }
    };

    init();
  }, [shopid, initialLikes, initialLiked]);

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
      const result = (await toggleSupportAction(shopid)) as SupportActionResult;

      if (!result.ok) {
        toast.error(result.message || "応援を更新できませんでした");
        return;
      }

      const wasLiked = liked;
      setLiked(result.liked);
      setLikes(result.likes);
      setIsLimit(result.likes >= 10);
      localStorage.removeItem("shop_ranking_cache");
      trackSupportEvent(result.liked ? "added" : "removed");

      if (!wasLiked && result.liked) {
        toast.success(result.message || "応援ありがとうございます！");
      }
    } catch {
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
