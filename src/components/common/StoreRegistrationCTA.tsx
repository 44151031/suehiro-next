// /components/sections/common/StoreRegistrationCTA.tsx
export default function StoreRegistrationCTA() {
  return (
    <section className="bg-[#fffdf8] border border-yellow-300 rounded-xl p-6 mt-14 shadow-sm text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
        あなたのお店も掲載しませんか？
      </h2>
      <p className="text-sm sm:text-base text-gray-700 mb-4">
        「Payキャン」は地域のキャッシュレスキャンペーンを紹介しています。<br className="hidden sm:inline" />
        該当キャンペーンの対象店舗であれば、<span className="font-semibold text-pink-600">無料で掲載申請</span>が可能です。
      </p>

      <ul className="text-sm text-left text-gray-700 mx-auto mb-4 max-w-md space-y-1 list-disc list-inside">
        <li>検索・ジャンル別表示で見つけられやすい</li>
        <li>あなたのビジネスのサイテーション対策にも</li>
        <li>お申し込みはわずか1分。スマホから簡単</li>
      </ul>

      <a
        href="https://lin.ee/PwfONyl"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 px-6 py-3 rounded-full bg-pink-500 text-white text-sm sm:text-base font-bold hover:bg-pink-400 transition"
      >
        📩 無料で店舗掲載！LINEで申し込む
      </a>
    </section>
  );
}
