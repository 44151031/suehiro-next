import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import CampaignCard from "@/components/common/CampaignCard";

type Props = {
  prefectureSlug: string;
  excludeCitySlug?: string;
};

export function PrefectureCampaignList({ prefectureSlug, excludeCitySlug }: Props) {
  const relatedCampaigns = campaigns.filter(
    (c) => c.prefectureSlug === prefectureSlug && c.citySlug !== excludeCitySlug
  );

  if (relatedCampaigns.length === 0) return null;

  return (
    <section className="mt-12 bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">
          同じ都道府県で開催中のキャンペーン
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {relatedCampaigns.map((c) => (
            <Link
              key={c.citySlug}
              href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`}
              className="block hover:opacity-90"
            >
              <CampaignCard
                prefecture={c.prefecture}
                city={c.city}
                offer={c.offer}
                startDate={c.startDate}
                endDate={c.endDate}
                fullpoint={c.fullpoint}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
