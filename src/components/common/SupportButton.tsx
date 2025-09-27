"use client";

import { useEffect, useState } from "react";
import { toggleSupport } from "@/app/actions/support";
import { toast } from "sonner";

type Props = { shopid: string };

export default function SupportButton({ shopid }: Props) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false); // 連打防止

  // ✅ 初期ロードでいいね数を取得
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(`/api/shops/likes?shopid=${shopid}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes ?? 0);
        }
      } catch (e) {
        console.error("Failed to fetch likes:", e);
      }
    };
    fetchLikes();
  }, [shopid]);

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      const result = await toggleSupport(shopid);
      if (result.ok) {
        setLiked(result.liked);
        setLikes(result.likes);

        // ✅ 応援追加時のみトースト通知
        if (result.liked) {
          toast.success(result.message || "応援ありがとうございます！");
        }
        // ✅ 取り消し時は通知なし
      } else {
        // ✅ 上限やエラーなどはエラートースト
        toast.error(result.message || "エラーが発生しました");
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
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition ${
        liked ? "bg-pink-100 text-pink-600" : "bg-gray-100 text-gray-600"
      } ${pending ? "opacity-60 pointer-events-none" : ""}`}
    >
      <span className="text-lg">{liked ? "♥" : "♡"}</span>
      <span>{likes > 50 ? "50+" : likes}</span>
    </button>
  );
}
