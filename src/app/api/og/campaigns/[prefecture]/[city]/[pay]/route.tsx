import { ImageResponse } from "next/og";
import { campaigns } from "@/lib/campaignMaster";
import { PayTypeLabels, PayTypeId } from "@/lib/payType";

export const runtime = "edge";

// バッジの色設定（決済サービスごと）
const paytypeColors: Record<PayTypeId, string> = {
  paypay: "#ef2a36",
  aupay: "#f39800",
  rakutenpay: "#bf0000",
  dbarai: "#b11f27",
};

// 背景色は還元率で決定
function getBackgroundColor(offer: number) {
  if (offer >= 30) return "#e60033";
  if (offer >= 20) return "#f39800";
  if (offer >= 10) return "#0095d9";
  return "#444";
}

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

  const paytypeId = pay as PayTypeId;
  const payLabel = PayTypeLabels[paytypeId];
  const bgColor = getBackgroundColor(campaign.offer);
  const badgeColor = paytypeColors[paytypeId] || "#888";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: bgColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          fontSize: 60,
          fontWeight: 700,
          padding: "40px",
        }}
      >
        <div>{campaign.city}の</div>
        <div>{payLabel} {campaign.offer}%還元キャンペーン</div>

        {/* バッジ */}
        <div
          style={{
            marginTop: "40px",
            backgroundColor: badgeColor,
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "9999px",
            fontSize: 36,
            fontWeight: 700,
            display: "inline-block",
          }}
        >
          {payLabel}
        </div>

        {/* 開催期間 */}
        <div
          style={{
            fontSize: 32,
            marginTop: "30px",
            fontWeight: 400,
          }}
        >
          {campaign.startDate}〜{campaign.endDate}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
