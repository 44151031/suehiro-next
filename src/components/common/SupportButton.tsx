"use client";

import { useState, useTransition } from "react";
import { toggleSupport } from "@/app/actions/support";

type Props = {
  shopid: string;
  initialLikes?: number;
  initiallyLiked?: boolean;
};

export function SupportButton({ shopid, initialLikes = 0, initiallyLiked = false }: Props) {
  const [pending, start] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);

  async function handleClick() {
    start(async () => {
      const res = await toggleSupport(shopid);

      if (res.ok) {
        setLiked(res.liked);
        setLikes(res.likes);

        // ✅ 応援追加時のみアラート表示
        if (res.liked) {
          alert(res.message); // 「応援ありがとうございます！」を表示
        }
      } else {
        // ✅ 制限時などのエラーメッセージをアラート表示
        alert(res.message);
      }
    });
  }

  return (
    <button
      disabled={pending}
      onClick={handleClick}
      className="flex items-center gap-1 hover:scale-105 transition disabled:opacity-50"
    >
      {liked ? <span className="text-red-500">❤️</span> : <span className="text-gray-400">♡</span>}
      <span className={liked ? "text-red-500" : "text-gray-400"}>
        {likes >= 50 ? "50+" : likes}
      </span>
    </button>
  );
}
