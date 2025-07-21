// /app/campaigns/[prefecture]/[city]/[pay]/page.tsx

import StandardCampaignPage from "./StandardCampaignPage";
import VoucherCampaignPage from "./VoucherCampaignPage";

type Props = {
  params: {
    prefecture: string;
    city: string;
    pay: string;
  };
};

export default function Page({ params }: Props) {
  const { pay } = params;

  if (pay.endsWith("-voucher")) {
    return <VoucherCampaignPage params={params} />;
  }

  return <StandardCampaignPage params={params} />;
}
