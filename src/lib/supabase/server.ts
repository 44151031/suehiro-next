// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * RSC/サーバーコンポーネント用（読み取り専用）
 * - cookie の set/remove は no-op
 * - auth の自動更新/永続化も無効化（内部で cookie 書き込みをさせない）
 */
export async function createClientServerReadOnly() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},        // ← 何もしない
        remove: () => {},     // ← 何もしない
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

/**
 * Server Action / Route Handler 用（cookie 書き込みが必要なときだけ使う）
 */
export async function createClientServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options: CookieOptions) =>
          cookieStore.set({ name, value: "", ...options }),
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}
