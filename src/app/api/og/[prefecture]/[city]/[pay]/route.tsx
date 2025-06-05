// ✅ /app/api/og/[prefecture]/[city]/[pay]/route.tsx

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeId, PayTypeLabels } from "@/lib/payType";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { prefecture: string; city: string; pay: string };
  }
) {
  const { prefecture, city, pay } = params;

  const campaign = campaigns.find(
    (c) =>
      c.prefectureSlug === prefecture &&
      c.citySlug === city &&
      c.paytype === pay
  );

  if (!campaign) {
    return new Response("Campaign not found", { status: 404 });
  }

  const { offer, city: cityName, prefecture: prefectureName } = campaign;
const payLabel = pay in PayTypeLabels ? PayTypeLabels[pay as keyof typeof PayTypeLabels] : pay;

  const bgUrl = `https://paycancampaign.com/images/campaigns/${prefecture}-${city}.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "48px 64px",
            borderRadius: 24,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: "bold" }}>
            {payLabel}を対象店舗で利用…
          </div>
          <div style={{ fontSize: 28 }}>{prefectureName}{cityName}</div>
          <div
            style={{
              backgroundColor: "#ffe600",
              color: "#111",
              padding: "14px 32px",
              borderRadius: "9999px",
              fontWeight: "bold",
              fontSize: 28,
            }}
          >
            {payLabel}キャンペーンを見る
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
