import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** ===== 設定 ===== */

// メンテナンスの ON/OFF（.env.local で管理）
// 例: NEXT_PUBLIC_MAINTENANCE=1 なら有効、未設定/0 なら無効
const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "1";

// Basic 認証（/admin, /api/admin 配下に適用）
const BASIC_USER = process.env.BASIC_AUTH_USER || "";
const BASIC_PASS = process.env.BASIC_AUTH_PASS || "";
const BASIC_REALM = process.env.BASIC_AUTH_REALM || "Restricted";
// 開発中だけ Basic を外したい場合: NEXT_PUBLIC_SKIP_BASIC=1
const skipBasic = process.env.NEXT_PUBLIC_SKIP_BASIC === "1";
const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

/** ===== メイン処理 ===== */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Vercel プレビュー / *.vercel.app では noindex ヒントを付与（任意）
  const host = req.headers.get("host") || "";
  if (host.endsWith(".vercel.app")) {
    res.headers.set("x-noindex", "true");
  }

  // --- Basic 認証（/admin 配下のみ） ---
  if (!skipBasic && BASIC_USER && BASIC_PASS && needsBasic(pathname)) {
    const header = req.headers.get("authorization");
    if (!header?.startsWith("Basic ")) {
      return unauthorized();
    }
    try {
      const [, value] = header.split(" ");
      const [user, pass] = Buffer.from(value, "base64").toString().split(":");
      if (!(user === BASIC_USER && pass === BASIC_PASS)) {
        return unauthorized();
      }
    } catch {
      return unauthorized();
    }
  }

  // --- メンテナンスモード ---
  if (isMaintenanceMode && !pathname.startsWith("/maintenance")) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    // 書き換え (rewrite) で OK（/maintenance ページの見た目で表示）
    return NextResponse.rewrite(url);
  }

  return res;
}

/** ===== ユーティリティ ===== */
function needsBasic(path: string) {
  return PROTECTED_PREFIXES.some((p) => path.startsWith(p));
}

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${BASIC_REALM}"` },
  });
}

/** ===== 適用範囲 ===== */
// 静的ファイルは除外
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images/).*)",
  ],
};
