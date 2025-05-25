import { notFound } from "next/navigation";
import { campaigns } from "@/lib/campaigns";
import Link from "next/link";
import { formatJapaneseDate, isNowInCampaignPeriod } from "@/lib/campaignUtils";
import CampaignCard from "@/components/common/CampaignCard";

export default function PrefecturePage({
  params,
}: {
  params: { prefecture: string };
}) {
  const list = campaigns.filter(
    (c) => c.prefectureSlug === params.prefecture
  );

  if (list.length === 0) return notFound();

  const prefectureName = list[0].prefecture;

  // 開催中・開催予定のカウント
  const active = list.filter((c) =>
    isNowInCampaignPeriod(c.startDate, c.endDate)
  );
  const upcoming = list.length - active.length;

  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        {/* タイトル */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-6 border-l-4 border-neutral-800 pl-4">
          {prefectureName}のPayPayキャンペーン一覧
        </h1>

        {/* 開催件数テキスト＋全国リンク */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <p className="text-base sm:text-lg text-neutral-700 leading-snug">
            <span className="text-[17px] sm:text-xl font-semibold">
              {prefectureName}では、現在{" "}
              <span className="text-green-700 font-bold">{active.length}件</span> のキャンペーンが開催中です。
            </span>
            <span className="ml-1 text-[17px] sm:text-xl font-semibold">
              <span className="text-orange-600 font-bold">{upcoming}件</span> は開催予定となっています。
            </span>
          </p>

          <Link
            href="/campaigns"
            className="inline-block bg-white text-primary border border-border rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent/10 transition whitespace-nowrap"
          >
            全国のキャンペーン一覧へ
          </Link>
        </div>

        {/* カード一覧 */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link
              key={`${c.prefectureSlug}-${c.citySlug}`}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
              className="block transition-transform hover:scale-[1.02]"
            >
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                fullpoint={c.fullpoint}
                startDate={c.startDate}
                endDate={c.endDate}
                period={
                  c.startDate && c.endDate
                    ? `${formatJapaneseDate(c.startDate, undefined, { omitYear: true })}〜${formatJapaneseDate(c.endDate, undefined, { omitYear: true })}`
                    : ""
                }
              />
            </Link>
          ))}
        </div>

        {/* トップページへ戻る */}
        <div className="mt-12 flex justify-end">
          <Link
            href="/"
            className="inline-block bg-white text-primary border border-border rounded-full px-5 py-2 text-sm font-semibold hover:bg-accent/10 transition"
          >
            トップページへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
