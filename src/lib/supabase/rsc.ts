import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Server Component(RSC) 専用: cookie は get だけ。set/remove は no-op */
export async function createClientServerRSC() {
  const cookieStore = await cookies(); // RSCでの参照はOK

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        // ★ RSCでは cookie 変更禁止。no-op にすることでエラー回避
        set: () => {},
        remove: () => {},
      },
    }
  );
}
