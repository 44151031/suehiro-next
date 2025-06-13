import type { Metadata } from "next";
import CampaignsContent from "./CampaignsContent";
import { getCampaignsPageMetadata } from "@/lib/metadataStaticGenerators";
export const metadata = getCampaignsPageMetadata();

export default function CampaignsPage() {
  return <CampaignsContent />;
}
