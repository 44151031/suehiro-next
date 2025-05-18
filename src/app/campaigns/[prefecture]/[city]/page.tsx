import { Metadata } from "next";
import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";
import { notFound } from "next/navigation";

// ✅ generateMetadata 修正（any化）
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { prefecture, city } = params;

  const prefectureData = prefectures.find(p => p.slug === prefecture);
  const cityData = cities.find(c => c.prefectureSlug === prefecture && c.slug === city);

  const title = prefectureData && cityData
    ? `${prefectureData.name} ${cityData.name}のPayPayキャンペーン情報`
    : "キャンペーン情報が見つかりません";

  return { title, description: title };
}

// ✅ ページ本体 修正（any化）
export default function CityPage({ params }: any) {
  const prefectureData = prefectures.find(p => p.slug === params.prefecture);
  const cityData = cities.find(c => c.prefectureSlug === params.prefecture && c.slug === params.city);

  if (!prefectureData || !cityData) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {prefectureData.name} {cityData.name} キャンペーン詳細
      </h1>
      <p>※キャンペーン詳細は準備中です。</p>
    </div>
  );
}
