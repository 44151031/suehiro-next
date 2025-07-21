import Link from "next/link";
import { formatJapaneseDate } from "@/lib/campaignUtils";

type Props = {
    targetAudience: string;
    resultAnnounceDate?: string;
    applicationUrl?: string;
    applicationStart: string;
    applicationEnd: string;
    usageStart: string;
    usageEnd: string;
};

function getApplicationStatus(
    start: string,
    end: string
): { label: string; isActive: boolean } {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate || now > endDate) {
        return { label: "申込期間外です", isActive: false };
    } else {
        return { label: "申込受付中", isActive: true };
    }
}

export default function VoucherCampaignHighlight({
    targetAudience,
    resultAnnounceDate,
    applicationUrl,
    applicationStart,
    applicationEnd,
    usageStart,
    usageEnd,
}: Props) {
    const status = getApplicationStatus(applicationStart, applicationEnd);
    const isLottery = !!resultAnnounceDate;

    return (
        <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <div>
                    <p className="text-sm font-semibold text-gray-500">対象者</p>
                    <p className="text-lg font-bold text-gray-900">{targetAudience}</p>

                    {isLottery && (
                        <div className="mt-2 inline-flex items-center gap-x-4 bg-yellow-50 border border-yellow-100 rounded-md px-4 py-2">
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-200 text-yellow-800">
                                抽選方式です
                            </span>
                            {resultAnnounceDate && (
                                <span className="text-sm font-semibold text-gray-700">
                                    当選発表：{formatJapaneseDate(resultAnnounceDate)}以降
                                </span>
                            )}
                        </div>
                    )}

                    {!isLottery && (
                        <p className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
                            先着順です！お早めに！
                        </p>
                    )}
                </div>

                {applicationUrl && status.isActive && (
                    <div>
                        <Link
                            href={applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                        >
                            購入申し込み
                        </Link>
                    </div>
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                    className={`rounded-xl p-4 border ${status.isActive
                            ? "bg-gray-50 border-gray-200"
                            : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                >
                    <p className="text-sm text-gray-600">申し込み期間</p>
                    <p
                        className={`text-base font-semibold ${status.isActive ? "text-gray-800" : "text-gray-400"
                            }`}
                    >
                        {formatJapaneseDate(applicationStart)} ～ {formatJapaneseDate(applicationEnd)}
                    </p>
                    {!status.isActive && (
                        <p className="mt-1 text-xs font-medium text-gray-500">{status.label}</p>
                    )}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600">商品券の利用期間</p>
                    <p className="text-base font-semibold text-gray-800">
                        {formatJapaneseDate(usageStart)} ～ {formatJapaneseDate(usageEnd)}
                    </p>
                </div>
            </div>
        </section>
    );
}
