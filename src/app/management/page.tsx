// /app/management/page.tsx

import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { getManagementPageMetadata } from "@/lib/metadataStaticGenerators";

export const metadata = getManagementPageMetadata();

export default function AdminPage() {
  return (
    <div className="w-full bg-[#f8f7f2] text-secondary-foreground py-16">
      <Container>
        <h1 className="headline1">
          運営管理
        </h1>

        <div className="max-w-xl mx-auto bg-white border border-border rounded-2xl shadow-md p-6 space-y-6 text-sm sm:text-base">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">サイト名</span>
            <span className="text-gray-900 font-semibold text-left">
              Payキャン
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">管理者</span>
            <span className="text-gray-900 font-semibold text-left">
              「Payキャン」運営事務局
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">URL</span>
            <a
              href="https://paycancampaign.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-semibold text-left"
            >
              https://paycancampaign.com
            </a>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-600 font-medium">MAIL</span>
            <a
              href="mailto:info@paycancampaign.com"
              className="text-primary underline font-semibold text-left"
            >
              info@paycancampaign.com
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
