"use client";

export default function AeonPayAffiliate() {
  return (
    <aside className="mt-8 mb-10 bg-white border border-pink-300 rounded-md p-4 shadow-sm space-y-2 text-gray-800 leading-snug text-[13px] md:text-sm">
      <h3 className="font-bold mb-2 text-[#e6007e] text-sm md:text-base">
        【イオンユーザー必見】イオンカード利用でAEON Pay還元率がアップ！
      </h3>

      <p className="text-sm md:text-sm">
        AEON Payを使う際、銀行口座からチャージしていませんか？
        <strong>実はそれ、かなり損をしています。</strong>
      </p>

      <ul className="list-disc ml-5 font-bold space-y-0.5">
        <li>銀行口座チャージ：還元率 0.5%</li>
        <li>
          イオンカードチャージ：
          <span className="text-[#e6007e]">
            還元率 1.5%（チャージ1.0%＋利用0.5%）
          </span>
        </li>
      </ul>

      <p className="text-sm md:text-sm">
        <strong>イオンカードからチャージするだけで、WAON POINTの二重取りができて</strong>
        <strong className="text-[#e6007e]">還元率が最大1.5倍</strong>
        になります。
      </p>

      <p className="text-sm md:text-sm">
        AEON Payを使うなら、イオンカードの設定は必須です。
        まだ持っていない方は、この機会に作っておくのがおすすめです。
      </p>

      <p className="text-sm text-gray-600">
        ※公式サイトよりも「ハピタス」を経由した方が、
        カード発行時に数千円分のポイントを獲得できてお得です。
      </p>

      <div className="text-center pt-2">
        <a
          href="https://hapitas.jp/appinvite/?i=10545115"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-block px-4 py-1.5 bg-[#e6007e] text-white text-xs md:text-sm font-bold rounded-md hover:bg-[#c4006f] transition"
        >
          ハピタスに無料登録してイオンカードを探す
          <span className="block text-[11px] mt-0.5 font-normal text-gray-100">
            （カード発行で数千円分のポイントを獲得可能）
          </span>
        </a>
      </div>
    </aside>
  );
}
