import { campaigns } from "@/lib/campaignMaster";
import CampaignCard from "@/components/common/CampaignCard";
import { formatJapaneseDate } from "@/lib/campaignUtils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function CityCampaignsPage({
  params,
}: {
  params: { prefecture: string; city: string };
}) {
  const { prefecture, city } = params;

  const list = campaigns.filter(
    (c) => c.prefectureSlug === prefecture && c.citySlug === city
  );

  if (list.length === 0) return notFound();

  return (
    <main className="w-full bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-800 mb-10">
          {list[0].city}のキャンペーン一覧
        </h1>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link
              key={`${c.prefectureSlug}-${c.citySlug}-${c.paytype}`}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}/${c.paytype}`}
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
      </div>
    </main>
  );
}
