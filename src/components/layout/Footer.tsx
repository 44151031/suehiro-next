import Link from "next/link";
import { popularSearches } from "@/lib/popularSearches";
import Container from "@/components/layout/Container";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 py-12 px-4">
      <Container className="flex flex-col items-center gap-6 text-center">
        {/* サイト名 */}
        <p className="text-xl sm:text-2xl font-extrabold text-gray-800 leading-snug">
          <span className="text-red-600">Pay</span>
          <span className="text-xl text-gray-800 font-medium ml-1 align-middle">キャン</span>
          <span className="text-sm text-gray-600 font-medium align-middle">（ペイキャン）</span>
          <br />
          <span className="text-sm sm:text-base font-normal text-gray-500">
            PayPay・auPay・楽天pay・d払い 市区町村キャンペーン体験
          </span>
        </p>

        {/* ナビゲーション */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-red-600 transition">トップ</Link>
          <Link href="/campaigns" className="hover:text-red-600 transition">キャンペーン一覧</Link>
          <Link href="/management" className="hover:text-red-600 transition">運営管理</Link>
          <Link href="/contact" className="hover:text-red-600 transition">お問い合わせ</Link>
        </nav>

        {/* よく検索されるリンク */}
        <div className="text-sm text-gray-600 mt-4 flex flex-wrap justify-center gap-x-2 gap-y-1">
          <span className="font-medium text-gray-500">よく検索されるキャンペーン:</span>
          {popularSearches.map((item, index) => (
            <Link
              key={index}
              href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
              className="text-red-600 hover:underline transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* コピーライト */}
        <p className="text-xs text-gray-400 mt-8">
          &copy; {new Date().getFullYear()} Payキャン（ペイキャン）実行委員会
        </p>
      </Container>
    </footer>
  );
}
