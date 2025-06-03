// ✅ /components/PopularSearches.tsx
import Link from "next/link";
import { popularSearches } from "@/lib/popularSearches";

export default function PopularSearches() {
  return (
    <section className="w-full py-16 bg-muted text-muted-foreground">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* タイトル */}
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-10 text-center">
          よく検索されているキャンペーン
        </h2>

        {/* 人気検索キーワードリスト */}
        <div className="flex flex-wrap justify-center gap-3">
          {popularSearches.map((item, index) => (
            <Link
              key={index}
              href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
              className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-base shadow-md hover:bg-primary/90 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
