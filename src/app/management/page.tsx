// /app/management/page.tsx

import type { Metadata } from "next";
import Container from "@/components/layout/Container";

// ✅ metadataを追加
export const metadata: Metadata = {
  title: "運営管理",
  description: "Payキャンの管理情報を掲載しています。管理者名やURL、連絡先などを確認できます。",
};

export default function AdminPage() {
  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground py-16">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-10 text-center">
          運営管理
        </h1>

        <div className="max-w-xl mx-auto bg-white border border-border rounded-2xl shadow-md p-6 space-y-6 text-sm sm:text-base">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">サイト名</span>
            <span className="text-gray-900 font-semibold text-right">
              PayPay・auPay・楽天ペイ・d払い「Payキャン」
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">管理者</span>
            <span className="text-gray-900 font-semibold text-right">
              「Payキャン」運営事務局
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">URL</span>
            <a
              href="https://paycancampaign.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-semibold text-right"
            >
              https://paycancampaign.com
            </a>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">MAIL</span>
            <a
              href="mailto:info@paycancampaign.com"
              className="text-primary underline font-semibold text-right"
            >
              info@paycancampaign.com
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
