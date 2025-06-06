// /app/api/og/campaigns/[prefecture]/[city]/[pay]/route.tsx

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { campaigns } from "@/lib/campaignMaster";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: { prefecture: string; city: string; pay: string } }
) {
  const { prefecture, city, pay } = params;
  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === prefecture &&
      c.citySlug === city &&
      c.paytype === pay
  );

  if (!campaign) {
    return new Response("Not Found", { status: 404 });
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/images/campaigns/${prefecture}-${city}.jpg`;

  // ✅ 画像を取得（Edge関数でOK）
  const imgRes = await fetch(imageUrl);
  const imgBuffer = await imgRes.arrayBuffer();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url("data:image/jpeg;base64,${Buffer.from(
            imgBuffer
          ).toString("base64")}")`,
          backgroundSize: "cover",
          color: "white",
          fontSize: 64,
          fontWeight: "bold",
          textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
        }}
      >
        {campaign.city}の{pay.toUpperCase()} {campaign.offer}% 還元！
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
