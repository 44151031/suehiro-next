// /app/api/revalidate/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 全ページ再検証（最短）
    await Promise.all([
      // 必要なパスを列挙（例）
      // 必要に応じて細かく絞ってOK
      fetch(`https://paycancampaign.com/api/revalidate-path?path=/campaigns`, {
        method: "POST",
      })
    ]);

    return NextResponse.json({ revalidated: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
