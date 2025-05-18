"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";

export default function SearchForm() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const lowerKeyword = keyword.trim().toLowerCase();
    const prefecture = prefectures.find((p) => p.name.includes(lowerKeyword));
    if (prefecture) {
      router.push(`/campaigns/${prefecture.slug}`);
      return;
    }

    const city = cities.find((c) => c.name.includes(lowerKeyword));
    if (city) {
      router.push(`/campaigns/${city.prefectureSlug}/${city.slug}`);
      return;
    }

    alert("一致する都道府県または市区町村がありません。");
  };

  return (
    <section className="max-w-[600px] mx-auto py-16 px-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="都道府県名や市区町村名を入力"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap"
        >
          検索
        </button>
      </form>
    </section>
  );
}
