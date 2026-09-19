// next.config.ts
import type { NextConfig } from "next";

/**
 * Next.js の設定オブジェクト（TypeScript用）
 */
const nextConfig: NextConfig = {
  // ✅ 外部画像のドメイン設定（例：Unsplashの画像を使うとき）
  images: {
    domains: ["source.unsplash.com"],
  },

  // ✅ ESLintのエラーでビルドを止めない（開発優先）
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 型エラーがある場合はビルドを停止する。
  typescript: {
    ignoreBuildErrors: false,
  },

  // ✅ 末尾スラッシュなしでURLを統一（SEO対策）
  trailingSlash: false,
};

export default nextConfig;
