"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";
import Link from "next/link";

export default function SearchForm() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  // 入力に応じて都道府県・市区町村を検索し、一覧表示
  const results = cities
    .map((city) => {
      const prefecture = prefectures.find((p) => p.slug === city.prefectureSlug);
      return {
        ...city,
        prefectureName: prefecture?.name || "",
      };
    })
    .filter((c) => {
      const targetText = `${c.prefectureName}${c.name}`;
      return targetText.includes(keyword);
    });

  // フォーム送信時のURLリダイレクト処理（/campaigns/search/[slug] 対応）
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerKeyword = keyword.trim().toLowerCase();

    // 都道府県スラッグを検索
    const prefecture = prefectures.find((p) => p.name.includes(lowerKeyword));
    if (prefecture) {
      router.push(`/campaigns/search/${prefecture.slug}`);
      return;
    }

    // 市区町村スラッグを検索
    const city = cities.find((c) => c.name.includes(lowerKeyword));
    if (city) {
      router.push(`/campaigns/search/${city.slug}`);
      return;
    }

    // 一致しない場合はアラート
    alert("一致する都道府県または市区町村がありません。");
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="都道府県名や市区町村名を入力"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          検索
        </button>
      </form>

      <ul>
        {results.map((c) => (
          <li key={c.slug}>
            <Link href={`/campaigns/${c.prefectureSlug}/${c.slug}`}>
              {c.prefectureName} {c.name}
            </Link>
          </li>
        ))}
        {keyword && results.length === 0 && (
          <p>一致するキャンペーンがありません。</p>
        )}
      </ul>
    </div>
  );
}
