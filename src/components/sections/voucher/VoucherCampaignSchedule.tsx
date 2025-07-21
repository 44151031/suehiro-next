import { formatJapaneseDate } from "@/lib/campaignUtils";

export default function VoucherCampaignSchedule({
  applyStartDate,
  applyEndDate,
  useStartDate,
  useEndDate,
  resultAnnounceDate,
}: {
  applyStartDate: string;
  applyEndDate: string;
  useStartDate: string;
  useEndDate: string;
  resultAnnounceDate?: string;
}) {
  return (
    <section className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">スケジュール</h2>
      <ul className="list-disc list-inside text-sm space-y-1">
        <li>
          <strong>申込期間：</strong>
          {formatJapaneseDate(applyStartDate)} ～ {formatJapaneseDate(applyEndDate)}
        </li>
        <li>
          <strong>利用期間：</strong>
          {formatJapaneseDate(useStartDate)} ～ {formatJapaneseDate(useEndDate)}
        </li>
        <li>
          <strong>当選発表：</strong>
          {resultAnnounceDate ? formatJapaneseDate(resultAnnounceDate) : "未定"}
        </li>
      </ul>
    </section>
  );
}