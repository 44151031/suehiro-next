// ✅ /components/layout/Breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { breadcrumbLabels } from "@/lib/breadcrumbLabels";
import { campaigns } from "@/lib/campaigns";

export default function Breadcrumbs() {
  const path = usePathname();
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const prevSeg = segments[i - 1];
    const cityMatch = campaigns.find(
      (c) => c.prefectureSlug === prevSeg && c.citySlug === seg
    );

    const label =
      breadcrumbLabels[seg] ||
      campaigns.find((c) => c.prefectureSlug === seg)?.prefecture ||
      cityMatch?.city ||
      decodeURIComponent(seg);

    return { href, label };
  });

  return (
    <nav className="relative z-40 mt-16 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-gray-700">
          <li>
            <Link href="/" className="text-blue-600 hover:underline">
              トップ
            </Link>
            {crumbs.length > 0 && <span className="mx-1 text-gray-400">/</span>}
          </li>
          {crumbs.map((c, i) => (
            <li key={c.href}>
              <Link href={c.href} className="text-blue-600 hover:underline">
                {c.label}
              </Link>
              {i < crumbs.length - 1 && (
                <span className="mx-1 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
