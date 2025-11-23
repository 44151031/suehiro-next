"use client";

import React from "react";

const PAYPAY_REFERRAL_URL = "https://s.paypay.ne.jp/RdBEZE";
const PAYPAY_REFERRAL_CODE = "02-QJHF650";
const HAPITAS_REFERRAL_URL = "https://hapitas.jp/appinvite/?i=10545115";

export default function PayPayAffiliate() {
  return (
    <aside
      role="complementary"
      className="mt-8 mb-10 bg-white border border-[#f2e3c9] rounded-md p-4 shadow-sm space-y-2 text-gray-800 leading-snug text-xs md:text-sm"
    >
      <h3 className="font-bold mb-2 text-[#a26300] text-sm md:text-base">
        【PayPay】<span className="text-black">還元率を最大化する2つのステップ</span>
      </h3>

      {/* Step 1 */}
      <section>
        <p className="text-sm md:text-sm">
          <strong>① このページ経由のPayPayアプリ登録で300円分GET！</strong></p>
          <p className="text-sm md:text-sm">
          まだPayPayを登録していない方は、以下の専用リンク経由が最もお得です。
        </p>

        <div className="p-3 bg-white border border-dashed border-[#f2e3c9] rounded-md text-center">
          <p className="text-[11px] md:text-xs mb-2">↓ 特典付き登録はこちら ↓</p>
          <a
            href={PAYPAY_REFERRAL_URL}
            target="_blank"
            rel="nofollow noopener"
            className="inline-block w-full max-w-[280px] py-1.5 bg-[#00a0e9] text-white font-bold rounded-md hover:bg-[#0086c4] transition"
          >
            PayPayアプリを特典付きで登録
          </a>
          <p className="text-[11px] text-gray-500 mt-2">
            ※自動入力されない場合は以下のコードを手入力してください。
          </p>
          <div className="mt-1">
            <code className="bg-yellow-50 text-[#0056b3] font-mono px-2 py-0.5 rounded border border-yellow-200 text-[11px]">
              {PAYPAY_REFERRAL_CODE}
            </code>
          </div>
        </div>
      </section>

      {/* Step 2 */}
      <section>
        <p className="text-sm md:text-sm">
          <strong>② PayPayカード発行でポイント二重取り！</strong></p>
          <p className="text-sm md:text-sm">
          PayPayのチャージでポイントが貯まる
          <strong>「PayPayカード」</strong>を利用すると、
          <strong className="text-[#d70000]">還元率が大幅アップ</strong>
          します。
        </p>

        <p className="text-sm md:text-sm">
          公式サイトよりポイントサイト経由の方が高還元です！
        </p>

        <div className="text-center mt-2">
          <a
            href={HAPITAS_REFERRAL_URL}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="inline-block px-4 py-1.5 bg-[#ffda44] text-[#5b4b00] text-xs md:text-sm font-bold rounded-md hover:bg-[#ffd21a] transition"
          >
            ハピタスに無料登録してPayPayカードを探す
            <span className="block text-[11px] mt-0.5 font-normal text-gray-600">
              （カード発行で数千円分のポイントを獲得可能）
            </span>
          </a>
        </div>
      </section>
    </aside>
  );
}
