import { popularSearches } from "@/lib/popularSearches";
import Link from "next/link";

export default function PopularSearches() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-center">よく検索されているキャンペーン</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {popularSearches.map((item, index) => (
          <Link
            key={index}
            href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}