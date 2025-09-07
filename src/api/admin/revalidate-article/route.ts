// src/app/api/admin/revalidate-article/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClientServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  // 管理者チェック（開発中はスキップ）
  if (process.env.NEXT_PUBLIC_SKIP_ADMIN_CHECK !== "true") {
    const supabase = createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });

    const me = await supabase.from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    if (!me.data?.is_admin) return NextResponse.json({ ok: false }, { status: 403 });
  }

  const { path } = await req.json();
  if (typeof path !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid path" }, { status: 400 });
  }

  revalidatePath(path);
  return NextResponse.json({ ok: true, path });
}
