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

  // ✅ TypeScriptの型エラーでビルドを止めない（開発優先）
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
