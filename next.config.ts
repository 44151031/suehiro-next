// next.config.js
import type { NextConfig } from "next";

/**
 * Next.js の設定オブジェクト
 */
const nextConfig: NextConfig = {
  // ✅ 画像の外部ドメイン設定（例: Unsplash）
  images: {
    domains: ["source.unsplash.com"],
  },

  // ✅ 本番ビルド時に ESLint エラーで build を止めないようにする
  // 開発中に未使用の変数や import などで止まるのを防ぐ
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
