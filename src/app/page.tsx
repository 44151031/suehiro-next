import Hero from "@/components/sections/Hero";
import SearchForm from "@/components/sections/SearchForm";
import CampaignCards from "@/components/sections/CampaignCards";
import PrefectureList from "@/components/sections/PrefectureList";
import Cta from "@/components/sections/Cta";
import HighDiscountCampaigns from "@/components/sections/HighDiscountCampaigns";
import EndingSoonCampaigns from "@/components/sections/EndingSoonCampaigns";
import PopularSearches from "@/components/sections/PopularSearches";
export default function HomePage() {
  return (
    <main>
      <Hero />
      <SearchForm />
      <PopularSearches /> {/* ← 追加 */}
      <CampaignCards />
      <PrefectureList />
      <HighDiscountCampaigns />
      <EndingSoonCampaigns />
      <Cta />
    </main>
  );
}