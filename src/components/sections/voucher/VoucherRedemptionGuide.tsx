import React from "react";

export function VoucherRedemptionGuide() {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 my-6">
      <h2 className="text-xl font-bold mb-4">当選後の利用方法</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-800">
        <li>
          アプリの「地域商品券」→「My商品券」で残高や期限を確認
        </li>
        <li>
          加盟店での支払い時には、商品券を優先して使用されるので、
          支払いアプリを立ち上げた後、「スキャン」または「支払う」から
          店舗QRを読み取って金額を確定し「支払う」をタップ
        </li>
        <li>
          PayPay残高やクレジット払いと併用も可能（※商品券分にはポイント付与はされません）
        </li>
        <li>
          ※そのまま利用することなく有効期限を迎えた商品券残高は失効となり返金されません。
        </li>
      </ul>
    </section>
  );
}
