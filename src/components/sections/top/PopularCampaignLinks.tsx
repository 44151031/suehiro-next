import { popularSearches } from "@/lib/popularSearches";
import Link from "next/link";

export default function PopularSearches() {
  return (
    <section className="w-full py-16 bg-muted text-muted-foreground">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* タイトル */}
        <h2 className="text-2xl font-bold text-primary drop-shadow-md mb-10 text-center">
          よく検索されているキャンペーン
        </h2>

        {/* 人気検索キーワードリスト */}
        <div className="flex flex-wrap justify-center gap-3">
          {popularSearches.map((item, index) => (
            <Link
              key={index}
              href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
              className="px-4 py-2 rounded-full bg-white border border-border text-primary font-medium text-sm hover:bg-accent/10 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
