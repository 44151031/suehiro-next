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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        color: "white",
        fontSize: 64,
        fontWeight: 700,
        textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
      }}
    >
      <img
        src={imageUrl}
        width={1200}
        height={630}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "1200px",
          height: "630px",
          objectFit: "cover",
          zIndex: 0,
        }}
        alt=""
      />
      <span style={{ position: "relative", zIndex: 1 }}>
        {campaign.city}の{pay.toUpperCase()} {campaign.offer}% 還元！
      </span>
    </div>
  ),
  { width: 1200, height: 630 }
);
}
