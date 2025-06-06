import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          color: "#222",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        こんにちは
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
