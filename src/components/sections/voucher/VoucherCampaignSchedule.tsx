import { formatJapaneseDate } from "@/lib/campaignUtils";

export default function VoucherCampaignSchedule({
  applyStartDate,
  applyEndDate,
  useEndDate,
  resultAnnounceDate,
  eligiblePersons,
  applicationUrl,
}: {
  applyStartDate: string;
  applyEndDate: string;
  useEndDate: string;
  resultAnnounceDate?: string;
  eligiblePersons: string;
  applicationUrl?: string;
}) {
  return (
    <section className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">購入可能な対象者なら申込まなきゃ損！</h2>
      <ul className="list-none space-y-2 text-sm sm:text-base">
        <li>
          <strong>申込可能な対象者：</strong>
          {eligiblePersons}
        </li>

        {/* 横並びグループ */}
        <li>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
            <span>
              <strong>申込期間：</strong>
              {formatJapaneseDate(applyStartDate)} ～ {formatJapaneseDate(applyEndDate)}
            </span>
            <span>
              <strong>当選発表：</strong>
              {resultAnnounceDate ? formatJapaneseDate(resultAnnounceDate) : "未定"}
            </span>
          </div>
        </li>



        {applicationUrl && (
          <li>
            <strong>購入申し込みページ：</strong>
            <a
              href={applicationUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue-600 underline break-all"
            >
              {applicationUrl}
            </a>
          </li>
        )}
        <li>
          <strong>商品券の利用期限：</strong>
          {formatJapaneseDate(useEndDate)}まで
        </li>
      </ul>
    </section>
  );
}
