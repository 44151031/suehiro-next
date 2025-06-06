// ✅ /app/api/og/campaigns/[prefecture]/[city]/[pay]/route.tsx
import { ImageResponse } from "next/og";
import { campaigns } from "@/lib/campaignMaster";

export const runtime = "edge";

export async function GET(req: Request, { params }: { params: { prefecture: string; city: string; pay: string } }) {
  const { prefecture, city, pay } = params;

  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === prefecture &&
      c.citySlug === city &&
      c.paytype === pay
  );

  if (!campaign) {
    return new ImageResponse(
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#111",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 48,
        }}
      >
        キャンペーンが見つかりませんでした
      </div>,
      { width: 1200, height: 630 }
    );
  }

  const bgUrl = `https://paycancampaign.com/images/campaigns/${prefecture}-${city}.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          backgroundColor: "#f8f7f2",
          color: "#111",
          fontSize: 50,
          fontWeight: "bold",
        }}
      >
        <div style={{ backgroundColor: "rgba(255,255,255,0.75)", padding: "20px", borderRadius: "12px" }}>
          {campaign.city}の{campaign.paytype?.toUpperCase()} {campaign.offer}% 還元キャンペーン
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
