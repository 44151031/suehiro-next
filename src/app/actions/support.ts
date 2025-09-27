"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrSetSessionId } from "@/lib/session";

export async function pushSupport(cardId: string) {
  const supabase = createClient();
  const sid = getOrSetSessionId();

  const { data, error } = await supabase.rpc("attempt_support", {
    p_card_id: cardId,
    p_session_id: sid,
  });

  if (error) {
    return { ok: false, message: "エラーが発生しました。", likes: null };
  }
  return data as { ok: boolean; message: string; likes: number | null };
}
