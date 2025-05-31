import Link from "next/link";
import { popularSearches } from "@/lib/popularSearches";
import Container from "@/components/layout/Container";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-12 px-4">
      <Container className="flex flex-col items-center gap-6 text-center">
        {/* サイト名 */}
        <p className="text-lg font-bold text-primary">PayPay・auPay・楽天pay・d払い市区町村キャンペーン体験「キャンPay」</p>

        {/* ナビゲーション */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-accent transition">トップ</Link>
          <Link href="/campaigns" className="hover:text-accent transition">キャンペーン一覧</Link>
          <Link href="/about" className="hover:text-accent transition">サイトについて</Link>
          <Link href="/contact" className="hover:text-accent transition">お問い合わせ</Link>
        </nav>

        {/* よく検索されるリンク */}
        <div className="text-sm text-muted-foreground mt-2 flex flex-wrap justify-center gap-x-2 gap-y-1">
          <span className="font-medium text-gray-500">よく検索されるキャンペーン:</span>
          {popularSearches.map((item, index) => (
            <Link
              key={index}
              href={`/campaigns/${item.prefectureSlug}/${item.citySlug}`}
              className="text-primary hover:text-accent transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* コピーライト */}
        <p className="text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} キャンペイ実行委員会
        </p>
      </Container>
    </footer>
  );
}
