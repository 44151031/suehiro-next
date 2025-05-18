import Link from "next/link";
import { campaigns } from "@/lib/campaigns";

type Props = {
  prefectureSlug: string;
};

export default function PrefectureCampaignList({ prefectureSlug }: Props) {
  const relatedCampaigns = campaigns.filter(c => c.prefectureSlug === prefectureSlug);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">同じ都道府県の開催中キャンペーン</h2>
      <ul className="space-y-2">
        {relatedCampaigns.map(c => (
          <li key={c.citySlug}>
            <Link href={`/campaigns/${c.prefectureSlug}/${c.citySlug}`} className="text-blue-500 underline">
              {c.prefecture}{c.city} {c.offer}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}