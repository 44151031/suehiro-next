import Link from "next/link";
import { campaigns } from "@/lib/campaigns";
import { Button } from "@/components/ui/button";

export default function PrefectureList() {
  const prefectures = [...new Set(campaigns.map(c => c.prefectureSlug))];
  return (
    <section className="p-8">
      <h2 className="text-xl font-bold mb-4">都道府県から探す</h2>
      <div className="flex flex-wrap gap-4">
        {prefectures.map(slug => (
          <Button key={slug} variant="outline" className="text-sm px-4 py-2">
            <Link href={`/campaigns/${slug}`}>{slug}</Link>
          </Button>
        ))}
      </div>
    </section>
  );
}