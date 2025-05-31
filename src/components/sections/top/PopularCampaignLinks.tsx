import Link from "next/link";
import { popularSearches } from "@/lib/popularSearches";
import { PayTypeSlugMap, PayTypeId } from "@/lib/payType";

export default function PopularSearches() {
  return (
    <section className="w-full py-16 bg-muted text-muted-foreground">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* タイトル */}
        <h2 className="text-2xl font-bold text-primary drop-shadow-md mb-10 text-center">
          よく検索されているキャンペーン
        </h2>

        {/* 人気検索キーワードリスト */}
        <div className="flex flex-wrap justify-center gap-3">
          {popularSearches.map((item, index) => {
            // ✅ PayTypeIdの型補完＆フォールバック（1=PayPay）
            const paytype: PayTypeId = (item.paytype ?? 1) as PayTypeId;
            const slug = PayTypeSlugMap[paytype];

            return (
              <Link
                key={index}
                href={`/campaigns/${item.prefectureSlug}/${item.citySlug}/${slug}`}
                className="px-4 py-2 rounded-full bg-white border border-border text-primary font-medium text-sm hover:bg-accent/10 transition"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
