import type { Metadata } from "next";
import CampaignsArchiveContent from "./CampaignsArchiveContent";
import { getArchivePageMetadata } from "@/lib/metadataStaticGenerators";
export const metadata = getArchivePageMetadata();
export default function CampaignsArchivePage() {
  return <CampaignsArchiveContent />;
}
