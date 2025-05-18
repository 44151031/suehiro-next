import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// ✅ 動的メタデータ生成
export async function generateMetadata({ params }: { params: { prefecture: string; city: string } }): Promise<Metadata> {
  const prefecture = prefectures.find(p => p.slug === params.prefecture);
  const city = cities.find(c => c.prefectureSlug === params.prefecture && c.slug === params.city);

  const title = prefecture && city
    ? `${prefecture.name} ${city.name}のPayPayキャンペーン情報`
    : "キャンペーン情報が見つかりません";
  const description = title;

  return { title, description };
}

// ✅ ページ表示処理
export default function CityPage({ params }: { params: { prefecture: string; city: string } }) {
  const prefecture = prefectures.find(p => p.slug === params.prefecture);
  const city = cities.find(c => c.prefectureSlug === params.prefecture && c.slug === params.city);

  if (!prefecture || !city) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{prefecture.name} {city.name} キャンペーン詳細</h1>
      <p>※キャンペーン詳細は準備中です。</p>
    </div>
  );
}
