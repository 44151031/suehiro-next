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
export const metadata = getTopPageMetadata();

export default function HomePage() {
  return (
    <>
      <Header />
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