import React from "react";

type Props = {
  campaignUrl: string;
};

export function VoucherApplicationFlow({ campaignUrl }: Props) {
  const paypayDeepLink = `paypay://open?url=${encodeURIComponent(campaignUrl)}`;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 my-6">
      <h2 className="text-xl font-bold mb-4">申し込みの流れ</h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-800">
        <li>PayPayアプリで「地域商品券」から本キャンペーンを選択</li>
        <li>購入したい口数（最大3口）を選んで「次のステップへ」</li>
        <li>メールアドレスを入力し、認証メールを送信</li>
        <li>本人確認書類で確認手続き（1～7日程度かかることも）</li>
        <li>内容を最終確認して「申し込む」をタップ</li>
        <li>申し込み完了後、確認メールが届きます</li>
        <li>
          当選した場合、アプリ上に購入権が表示されます。
          {/* モバイル時のみ表示 */}
          <a
            href={paypayDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-600 underline block md:hidden"
          >
            今すぐアプリで確認
          </a>
        </li>
      </ol>
    </section>
  );
}
