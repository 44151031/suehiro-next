import Hero from "@/components/sections/Hero";
import SearchForm from "@/components/sections/SearchForm";
import CampaignCards from "@/components/sections/CampaignCards";
import PrefectureList from "@/components/sections/PrefectureList";
import Cta from "@/components/sections/Cta";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <SearchForm />
      <CampaignCards />
      <PrefectureList />
      <Cta />
    </main>
  );
}