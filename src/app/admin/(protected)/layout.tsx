// src/app/admin/(protected)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClientServerRSC } from "@/lib/supabase/rsc";

export const revalidate = 0;

export default async function AdminProtectedLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createClientServerRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: me } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!me?.is_admin) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-semibold">Admin</Link>
            <span className="text-gray-300">|</span>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/admin/articles" className="hover:underline">記事管理</Link>
              <Link href="/admin/logout" className="text-red-600 hover:underline">ログアウト</Link>
            </nav>
          </div>
        <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
