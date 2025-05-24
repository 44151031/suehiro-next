// app/page.tsx

import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import SearchForm from "@/components/sections/SearchForm";
import YourAreaCampaigns from "@/components/sections/YourAreaCampaigns";
import PrefectureList from "@/components/sections/PrefectureList";
import Cta from "@/components/sections/Cta";
import HighDiscountCampaigns from "@/components/sections/HighDiscountCampaigns";
import EndingSoonCampaigns from "@/components/sections/EndingSoonCampaigns";
import PopularSearches from "@/components/sections/PopularSearches";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* ヘッダーの高さ分マージン */}
        <Hero />
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