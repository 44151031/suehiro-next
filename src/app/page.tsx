// app/page.tsx

import Header from "@/components/layout/Header";
import HeroTop from "@/components/sections/top/HeroTop";
import SearchForm from "@/components/sections/SearchForm";
import PrefectureList from "@/components/sections/PrefectureList";
import YourAreaCampaigns from "@/components/sections/top/YourAreaCampaigns";
import HighDiscountCampaigns from "@/components/sections/top/HighDiscountCampaigns";
import EndingSoonCampaigns from "@/components/sections/top/EndingSoonCampaigns";
import PopularSearches from "@/components/sections/PopularSearches";
import Cta from "@/components/sections/Cta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* ヘッダーの高さ分マージン */}
        <HeroTop />
        <SearchForm />
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