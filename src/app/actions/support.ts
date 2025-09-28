"use server";

import { createClientServer } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

export async function toggleSupport(shopid: string) {
  const supabase = await createClientServer();
  const sid = await getOrSetSessionId(); // ← await 必須

  const { data, error } = await supabase.rpc("toggle_support", {
    p_shopid: shopid,
    p_session_id: sid,
  });

  if (error) {
    console.error("toggleSupport error:", error);
    return {
      ok: false,
      liked: false,
      likes: 0,
      message: "エラーが発生しました。",
    };
  }

  // ✅ Supabase の RPC は配列で返るので先頭を取り出す
  const result =
    data && Array.isArray(data) && data.length > 0 ? data[0] : null;

  return result as {
    ok: boolean;
    liked: boolean;
    likes: number;
    message: string;
  };
}
