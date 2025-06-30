// app/page.tsx

import Header from "@/components/layout/Header";
import HeroTop from "@/components/sections/top/HeroTop";
import SearchForm from "@/components/sections/top/TopSearchForm";
import PrefectureList from "@/components/sections/top/TopPrefectureList";
import YourAreaCampaigns from "@/components/sections/top/YourAreaCampaigns";
import HighDiscountCampaigns from "@/components/sections/top/HighDiscountCampaigns";
import EndingSoonCampaigns from "@/components/sections/top/EndingSoonCampaigns";
import PopularSearches from "@/components/sections/top/PopularCampaignLinks";
import Cta from "@/components/sections/top/TopCta";
import LocationSortSection from "@/components/sections/top/GetLocationButtonSection";
import { getTopPageMetadata } from "@/lib/metadataStaticGenerators";
import TopPageStructuredData from "@/components/structured/TopPageStructuredData"; // ✅ 追加

export const metadata = getTopPageMetadata();

export default function HomePage() {
  return (
    <>
      <Header />
      <TopPageStructuredData /> {/* ✅ 構造化データ挿入 */}
      <main className="pt-16"> {/* ヘッダーの高さ分マージン */}
        <HeroTop />
        <SearchForm />
        <LocationSortSection />
        <YourAreaCampaigns />
        <PrefectureList />
        <HighDiscountCampaigns />
        <EndingSoonCampaigns />
        <PopularSearches />
        <Cta />
      </main>
    </>
  );
}
