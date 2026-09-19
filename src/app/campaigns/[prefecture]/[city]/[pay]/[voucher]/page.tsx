import { notFound } from "next/navigation";
import VoucherCampaignPage from "../VoucherCampaignPage";
import { getVoucherMetadata } from "@/lib/voucherMetadateGenerators";
type Props = { params: Promise<{ prefecture: string; city: string; pay: string; voucher: string }> };
export async function generateMetadata({ params }: Props) {
  const p = await params;
  if (p.pay !== "paypay-voucher") return {};
  return getVoucherMetadata(p.prefecture, p.city, "paypay-voucher", p.voucher);
}
export default async function Page({ params }: Props) {
  const p = await params;
  if (p.pay !== "paypay-voucher") notFound();
  return <VoucherCampaignPage params={{ ...p, campaignSlug: p.voucher }} />;
}
