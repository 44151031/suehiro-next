// ✅ /middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ true にすると全ページがメンテナンスモードになる
const isMaintenanceMode = true;

// ✅ 除外したいパス（メンテ中でも表示させたいページ）
const exactExcludePaths = ['/favicon.png'];
const prefixExcludePaths = [
  '/maintenance',
  '/_next',
  '/images',
  '/api',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ 除外パスを許可（完全一致 or パスの先頭一致）
  if (
    exactExcludePaths.includes(pathname) ||
    prefixExcludePaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // ✅ メンテナンスモード中なら強制的に /maintenance へリダイレクト
  if (isMaintenanceMode) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = '/maintenance';
    return NextResponse.rewrite(maintenanceUrl);
  }

  return NextResponse.next();
}
