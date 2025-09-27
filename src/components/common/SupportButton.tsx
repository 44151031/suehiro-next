"use client";

import { useState, useTransition } from "react";
import { pushSupport } from "@/app/actions/support";

type Props = {
  shopid: string;
  initialLikes?: number;
};

export function SupportButton({ shopid, initialLikes = 0 }: Props) {
  const [pending, start] = useTransition();
  const [likes, setLikes] = useState(initialLikes);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleClick() {
    start(async () => {
      const res = await pushSupport(shopid);
      setMsg(res.message);
      if (res.ok && res.likes !== null) {
        setLikes(res.likes);
      }
    });
  }

  // ❤️ アイコンのスタイル
  const heartIcon =
    likes > 0 ? (
      <span className="text-red-500">❤️</span> // 通常（赤）
    ) : (
      <span className="text-gray-400">♡</span> // 0件のときはグレーのハート（白抜き風）
    );

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        disabled={pending}
        onClick={handleClick}
        className="flex items-center gap-1 hover:scale-105 transition disabled:opacity-50"
      >
        {heartIcon}
        <span className={likes > 0 ? "text-red-500" : "text-gray-400"}>
          {likes >= 50 ? "50+" : likes}
        </span>
      </button>
      {msg && <p className="text-xs text-gray-700">{msg}</p>}
    </div>
  );
}
