// ✅ /components/common/CampaignCard.tsx

type CampaignCardProps = {
  prefecture: string;
  city: string;
  offer: string;
  period: string;
};

export default function CampaignCard({ prefecture, city, offer, period }: CampaignCardProps) {
  return (
    <div className="border rounded-2xl shadow-sm hover:shadow-md transition p-4 bg-white min-w-[220px] max-w-[240px]">
      <p className="text-sm font-semibold">{prefecture} {city}</p>
      <p className="text-lg font-bold mt-2">{offer}</p>
      <p className="text-sm mt-1">{period}</p>
    </div>
  );
}