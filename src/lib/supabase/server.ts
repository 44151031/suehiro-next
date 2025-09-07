import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createClientServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n) => cookieStore.get(n)?.value,
        set: (n, v, o: CookieOptions) => cookieStore.set({ name: n, value: v, ...o }),
        remove: (n, o: CookieOptions) => cookieStore.set({ name: n, value: "", ...o })
      }
    }
  );
}
