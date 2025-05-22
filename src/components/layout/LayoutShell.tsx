// ✅ /components/layout/LayoutShell.tsx
"use client";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  console.log("📍 usePathname():", pathname);
  
  // トップページだけパンくずを出さない
  const isTopPage = pathname === "/";

  return (
    <>
      {!isTopPage && <Breadcrumbs />}
      <main>{children}</main>
    </>
  );
}
