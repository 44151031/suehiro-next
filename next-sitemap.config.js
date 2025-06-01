/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://paycancampaign.com", // ←あなたの独自ドメインに変更
  generateRobotsTxt: true,
  sitemapSize: 7000, // 大規模サイト対応（任意）
  exclude: ["/404", "/500"], // 除外するパス（任意）
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};