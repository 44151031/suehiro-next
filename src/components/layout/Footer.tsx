import Link from "next/link";
import { popularSearches } from "@/lib/popularSearches";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 mt-16">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 text-center">
        <p className="text-lg font-semibold">PayPay自治体キャンペーン特集</p>

        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="hover:underline">トップ</Link>
          <Link href="/campaigns" className="hover:underline">キャンペーン一覧</Link>
          <Link href="/about" className="hover:underline">サイトについて</Link>
          <Link href="/contact" className="hover:underline">お問い合わせ</Link>
        </nav>

        {/* ✅ 追加：よく検索されるリンク */}
        <div className="text-sm text-gray-400 mt-4">
          <span>よく検索されるキャンペーン: </span>
          {popularSearches.map((item, index) => (
            <Link
              key={index}
              href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
              className="hover:underline ml-1"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="text-sm text-gray-400 mt-4">&copy; {new Date().getFullYear()} PayPay自治体キャンペーン特集</p>
      </div>
    </footer>
  );
}