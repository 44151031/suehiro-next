// ✅ /components/common/BackNavigationButtons.tsx

"use client";

import Button from "@/components/ui/Button/Button";
import { usePathname } from "next/navigation";

export default function BackNavigationButtons({ prefectureSlug, prefecture }: {
  prefectureSlug?: string;
  prefecture?: string;
}) {
  const pathname = usePathname();

  const isCityPage = pathname.match(/^\/campaigns\/[^/]+\/[^/]+$/);
  const isPrefecturePage = pathname.match(/^\/campaigns\/[^/]+$/);
  const isCampaignIndex = pathname === "/campaigns";

  return (
    <div className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
      {isCityPage && prefecture && prefectureSlug && (
        <Button href={`/campaigns/${prefectureSlug}`}>
          {prefecture}のキャンペーン一覧
        </Button>
      )}

      {(isCityPage || isPrefecturePage) && (
        <Button href="/campaigns">
          全国のキャンペーン一覧
        </Button>
      )}

      <Button href="/">トップページへ戻る</Button>
    </div>
  );
}