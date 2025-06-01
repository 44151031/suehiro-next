// ✅ /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// メンテナンス中かどうかを切り替えるフラグ
const IS_MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // メンテナンスページ自体は除外
  if (IS_MAINTENANCE_MODE && !pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}
