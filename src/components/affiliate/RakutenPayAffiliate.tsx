"use client";

export default function RakutenPayAffiliate() {
  return (
    <aside className="mt-8 mb-10 bg-white border border-yellow-300 rounded-md p-4 shadow-sm space-y-2 text-gray-800 leading-snug text-xs md:text-sm">
      <h3 className="font-bold mb-2 text-[#a26300] text-sm md:text-base">
        【ポイント】<span className="text-black">チャージ方法で還元率が変わります</span>
      </h3>

      <p>
        楽天ペイを使う際、銀行口座やセブン銀行ATMからチャージしていませんか？
        実はそれ、すごく損をしています。
      </p>

      <ul className="list-disc ml-5 font-bold space-y-0.5">
        <li>銀行・ATMチャージ：還元率 1.0%</li>
        <li>
          楽天カードチャージ：
          <span className="text-[#d70000]">
            還元率 1.5%（チャージ0.5%＋利用1.0%）
          </span>
        </li>
      </ul>

      <p>
        <strong>楽天カードからチャージするだけで、ポイントの二重取りができて</strong>
        <strong className="text-[#d70000]">還元率が1.5倍</strong>
        になります。
      </p>

      <p>
        楽天ペイを使うなら、必須の設定です。
        まだカードを持っていない方は、この機会に作って設定しておくことを強くおすすめします。
      </p>

      <div className="text-center pt-2">
        <a
          href="https://hb.afl.rakuten.co.jp/hsc/0a7a391b.d8abab1d.15bfa422.fc1d4ce4/?link_type=text&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJ0ZXh0IiwiY29sIjoxLCJjYXQiOiIxIiwiYmFuIjoxNjc0MTQsImFtcCI6ZmFsc2V9"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-block px-4 py-1.5 bg-[#d17a00] text-white text-xs md:text-sm font-bold rounded-md hover:bg-[#b76500] transition"
        >
          年会費永年無料の楽天カードはこちら
        </a>
      </div>
    </aside>
  );
}
