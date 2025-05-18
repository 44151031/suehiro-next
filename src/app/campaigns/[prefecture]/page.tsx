import { prefectures } from "@/lib/prefectures";
import { cities } from "@/lib/cities";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// ✅ 動的メタデータ生成
export async function generateMetadata({ params }: { params: { prefecture: string } }): Promise<Metadata> {
  const prefecture = prefectures.find(p => p.slug === params.prefecture);

  const title = prefecture
    ? `${prefecture.name}のPayPayキャンペーン一覧`
    : "キャンペーン情報が見つかりません";
  const description = title;

  return { title, description };
}

// ✅ ページ表示処理
export default function PrefecturePage({ params }: { params: { prefecture: string } }) {
  const prefecture = prefectures.find(p => p.slug === params.prefecture);

  if (!prefecture) {
    notFound();
  }

  const prefectureCities = cities.filter(c => c.prefectureSlug === params.prefecture);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{prefecture.name}のキャンペーン一覧</h1>
      <ul>
        {prefectureCities.map(city => (
          <li key={city.slug}>
            <Link href={`/campaigns/${prefecture.slug}/${city.slug}`}>
              {city.name}のキャンペーンを見る
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
