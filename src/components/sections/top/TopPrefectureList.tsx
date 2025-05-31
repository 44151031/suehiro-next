import { campaigns } from "@/lib/campaignMaster";
import { prefectures, prefectureGroups } from "@/lib/prefectures";
import Link from "next/link";

export default function PrefectureList() {
  const activePrefectureSlugs = campaigns.map((c) => c.prefectureSlug);

  return (
    <section className="w-full py-10 bg-[#f8f7f2] text-secondary-foreground">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* タイトル（あなたのエリア〜と統一） */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center mb-14 text-neutral-800 dark:text-white drop-shadow-sm">
          エリア別キャンペーン
        </h2>

        {/* 各エリアグループ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {prefectureGroups.map((group) => {
            const groupPrefectures = prefectures.filter((p) => p.group === group);

            return (
              <div key={group}>
                {/* グループ名 */}
                <h3 className="text-lg font-bold text-neutral-800 mb-3 border-l-4 border-border pl-2">
                  {group}
                </h3>

                {/* 都道府県リスト */}
                <div className="flex flex-wrap gap-2">
                  {groupPrefectures.map((pref) => {
                    const isActive = activePrefectureSlugs.includes(pref.slug);

                    return isActive ? (
                      <Link
                        key={pref.slug}
                        href={`/campaigns/${pref.slug}`}
                        className="px-4 py-1.5 rounded-full text-sm font-medium text-white bg-accent hover:bg-accent/80 shadow-sm transition"
                      >
                        {pref.name}
                      </Link>
                    ) : (
                      <span
                        key={pref.slug}
                        className="px-4 py-1.5 rounded-full text-sm text-gray-400 bg-white border border-dashed border-gray-300 cursor-not-allowed"
                      >
                        {pref.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
