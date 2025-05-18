import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { campaigns } from "@/lib/campaigns";

export default function CampaignCards() {
  return (
    <section className="p-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {campaigns.map((c) => (
        <Card key={c.citySlug}>
          <CardContent className="p-4">
            <CardTitle>{c.prefecture} {c.city}</CardTitle>
            <p>{c.offer}</p>
            <p className="text-sm text-gray-600">{c.period}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}