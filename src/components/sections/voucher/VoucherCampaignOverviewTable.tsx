import React from "react";

type Props = {
  ticketUnit: string;
  purchasePrice: number;
  ticketAmount: number;
  maxUnits: number;
  campaigntitle: string;
  eligiblePersons: string;
  distributionMethod: string;
  applicationUrl: string;
};

export default function VoucherCampaignOverviewTable({
  ticketUnit,
  purchasePrice,
  ticketAmount,
  maxUnits,
  campaigntitle,
  eligiblePersons,
  distributionMethod,
  applicationUrl,
}: Props) {
  const discount = Math.round(((ticketAmount - purchasePrice) / purchasePrice) * 100);

  return (
    <section className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">商品券の概要</h2>
      <table className="w-full text-sm border">
        <tbody>
          <tr className="border-b">
            <th className="text-left p-2">キャンペーン名</th>
            <td className="p-2">{campaigntitle}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">券種</th>
            <td className="p-2">{ticketUnit}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">販売価格</th>
            <td className="p-2">{purchasePrice.toLocaleString()}円</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">利用可能額</th>
            <td className="p-2">{ticketAmount.toLocaleString()}円（{discount}%お得）</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">購入上限</th>
            <td className="p-2">{maxUnits}口まで</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">対象者</th>
            <td className="p-2">{eligiblePersons}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left p-2">配布形式</th>
            <td className="p-2">{distributionMethod}</td>
          </tr>
          <tr>
            <th className="text-left p-2">申込URL</th>
            <td className="p-2">
              <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {applicationUrl}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
