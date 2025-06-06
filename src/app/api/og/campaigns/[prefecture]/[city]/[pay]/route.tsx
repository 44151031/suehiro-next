import { ImageResponse } from "next/og";
import { campaigns } from "@/lib/campaignMaster";

export const runtime = "edge";

export async function GET(
  req: Request,
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
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            backgroundColor: "#111",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          キャンペーンが見つかりませんでした
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#f8f7f2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#333",
            marginBottom: "20px",
          }}
        >
          {campaign.city}の
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "#ff0050",
          }}
        >
          {campaign.paytype.toUpperCase()} {campaign.offer}%還元キャンペーン
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
