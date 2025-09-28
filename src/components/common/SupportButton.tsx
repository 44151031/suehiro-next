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

  // ✅ 初期ロードで「いいね数」と「自分が押したか」を取得
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const sid = getOrSetSessionId();

        // 店舗の総いいね数
        const { count: likesCount } = await supabaseClient
          .from("support_events")
          .select("*", { count: "exact", head: true })
          .eq("shopid", shopid);

        setLikes(likesCount ?? 0);

        // 自分が今日押したか？
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const { data: existing } = await supabaseClient
          .from("support_events")
          .select("id")
          .eq("session_id", sid)
          .eq("shopid", shopid)
          .gte("created_at", today) // 今日以降のデータがあれば「押した」と判断
          .maybeSingle();

        setLiked(!!existing);
      } catch (e) {
        console.error("Failed to fetch initial like state:", e);
      }
    };

    fetchInitial();
  }, [shopid]);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      const result = await toggleSupport(shopid);

      if (result.status === "added") {
        setLiked(true);
        setLikes((prev) => prev + 1);
        toast.success("応援ありがとうございます！");
      } else if (result.status === "removed") {
        setLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
      } else if (result.status === "daily_limit") {
        toast.error("応援は1日3回までです。また明日お願いします。");
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
      disabled={pending}
      aria-disabled={pending}
      className={`flex items-center space-x-1 transition
        ${liked ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"}
        ${pending ? "opacity-60 pointer-events-none" : ""}
        px-2 py-[2px] text-xs rounded-md       /* 📱スマホ基準: 小さめ・枠なし */
        sm:px-3 sm:py-1 sm:text-sm sm:rounded-full /* 💻PC基準: 従来サイズ・枠あり */
      `}
    >
      <span className="text-sm sm:text-lg">{liked ? "♥" : "♡"}</span>
      <span>{likes > 50 ? "50+" : likes}</span>
    </button>
  );
}
