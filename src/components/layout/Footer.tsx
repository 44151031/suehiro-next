import Link from "next/link";
import { popularSearches } from "@/lib/popularSearches";
import Container from "@/components/layout/Container";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-12 px-4">
      <Container className="flex flex-col items-center gap-8 text-center">

        {/* サイト名 */}
        <div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
            <span className="text-accent">Pay</span>
            <span className="ml-1 text-base sm:text-lg align-bottom">キャン</span>
            <span className="text-sm text-gray-500 ml-2">（ペイキャン）</span>
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            PayPay・auPay・楽天ペイ・d払いキャンペーン体験
          </p>
        </div>

        {/* ナビゲーション */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-accent transition">トップ</Link>
          <Link href="/campaigns" className="hover:text-accent transition">キャンペーン一覧</Link>
          <Link href="/management" className="hover:text-accent transition">運営管理</Link>
        </nav>

        {/* よく検索されるリンク */}
        <div className="text-sm text-gray-600">
          <span className="block font-medium mb-2">よく検索されるキャンペーン:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((item, index) => (
              <Link
                key={index}
                href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
                className="bg-gray-100 hover:bg-accent hover:text-white text-gray-700 text-sm px-3 py-1 rounded-full transition font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* コピーライト */}
        <p className="text-xs text-gray-400 mt-4">
          &copy; {new Date().getFullYear()} Payキャン（ペイキャン）運営事務局
        </p>
      </Container>
    </footer>
  );
}
