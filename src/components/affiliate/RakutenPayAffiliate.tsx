"use client";

export default function RakutenPayAffiliate() {
  return (
    <aside className="mt-8 mb-10 bg-white border border-yellow-300 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-base md:text-lg font-bold mb-2 text-[#a26300]">
        【ポイント】チャージ方法で還元率が変わります
      </h3>
      <p className="text-sm md:text-base mb-2">
        楽天ペイを使う際、銀行口座やセブン銀行ATMからチャージしていませんか？
        実はそれ、すごく損をしています。
      </p>

      <ul className="list-disc ml-6 mb-2 text-sm md:text-base font-bold">
        <li>銀行・ATMチャージ：還元率 1.0%</li>
        <li>楽天カードチャージ：<strong className="text-[#d70000]">還元率 1.5%（チャージ0.5%＋利用1.0%）</strong></li>
      </ul>

      <p className="text-sm md:text-base mb-2">
        楽天カードからチャージするだけで、<strong>ポイントの二重取りができて</strong>
        <strong className="text-[#d70000]">還元率が1.5倍</strong>
        になります。
      </p>

      <p className="text-sm md:text-base mb-3">
        楽天ペイを使うなら、必須の設定です。
        まだカードを持っていない方は、この機会に作って設定しておくことを強くおすすめします。
      </p>

      <div className="text-center">
        <a
          href="https://hb.afl.rakuten.co.jp/hsc/0a7a391b.d8abab1d.15bfa422.fc1d4ce4/?link_type=text&ut=eyJwYWdlIjoic2hvcCIsInR5cGUiOiJ0ZXh0IiwiY29sIjoxLCJjYXQiOiIxIiwiYmFuIjoxNjc0MTQsImFtcCI6ZmFsc2V9"
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-block px-5 py-2 bg-[#d17a00] text-white text-sm md:text-base font-bold rounded-md hover:bg-[#b76500] transition"
        >
          年会費永年無料の楽天カードはこちら
        </a>
      </div>
    </aside>
  );
}
