import { formatJapaneseDate } from "@/lib/campaignUtils";

export default function VoucherCampaignHeader({
  title,
  published,
  modified,
}: {
  title: string;
  published: string;
  modified: string;
}) {
  return (
    <>
      <h1 className="headline1">{title}</h1>
      <p className="m-1 text-sm text-right text-gray-800">
        最終更新日：{formatJapaneseDate(modified)}｜ 公開：{formatJapaneseDate(published)}
      </p>
    </>
  );
}