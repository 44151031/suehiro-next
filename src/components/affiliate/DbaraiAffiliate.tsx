"use client";

export default function DbaraiAffiliate() {
  return (
    <aside className="mt-8 mb-10 bg-white border border-red-300 rounded-md p-4 shadow-sm space-y-2 text-gray-800 leading-snug text-[13px] md:text-sm">
      <h3 className="font-bold mb-2 text-[#a26300] text-sm md:text-base">
        【ドコモユーザー必見】dカード利用で還元率がアップ！
      </h3>

      <p className="text-sm md:text-sm">
        d払いを使う際、銀行口座やセブン銀行ATMからチャージしていませんか？
        <strong>実はそれ、かなり損をしています。</strong>
      </p>

      <ul className="list-disc ml-5 font-bold space-y-0.5">
        <li>銀行・ATMチャージ：還元率 0.5%</li>
        <li>
          dカードチャージ：
          <span className="text-[#d70000]">
            還元率 1.0%（チャージ0.5%＋利用0.5%）
          </span>
        </li>
      </ul>

      <p className="text-sm md:text-sm">
        <strong>dカードからチャージするだけで、ポイントの二重取りができて</strong>
        <strong className="text-[#d70000]">還元率が約2倍</strong>
        になります。
      </p>

      <p className="text-sm md:text-sm">
        d払いを使うなら、dカードの設定は必須です。
        まだ持っていない方は、今のうちに作っておくのがおすすめです。
      </p>

<p className="text-sm text-gray-600">
  ※公式サイトよりも「ハピタス」を経由した方が、カード発行時に数千円分のポイントを獲得できてお得です。
</p>

<div className="text-center pt-2">
  <a
    href="https://hapitas.jp/appinvite/?i=10545115"
    target="_blank"
    rel="nofollow sponsored noopener"
    onClick={() => {
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "affiliate_click",
          event_category: "hapitas",
          event_label: "dcard_ref_link",
          value: 1,
        });
      }
    }}
    className="inline-block px-4 py-1.5 bg-[#d70000] text-white text-xs md:text-sm font-bold rounded-md hover:bg-[#b50000] transition"
  >
    ハピタスに無料登録してdカードを探す
    <span className="block text-[11px] mt-0.5 font-normal text-gray-100">
      （カード発行で数千円分のポイントを獲得可能）
    </span>
  </a>
</div>
    </aside>
  );
}
