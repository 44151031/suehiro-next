import { campaigns } from "@/lib/campaigns";
import { prefectures, prefectureGroups } from "@/lib/prefectures";
import Link from "next/link";

export default function PrefectureList() {
  // キャンペーン掲載中の都道府県slugリスト
  const activePrefectureSlugs = campaigns.map((c) => c.prefectureSlug);

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-8 text-center">エリア別キャンペーン</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {prefectureGroups.map((group) => {
          const groupPrefectures = prefectures.filter((p) => p.group === group);

          return (
            <div key={group}>
              <h3 className="text-lg font-semibold mb-2">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {groupPrefectures.map((pref) => {
                  const isActive = activePrefectureSlugs.includes(pref.slug);

                  return isActive ? (
                    <Link
                      key={pref.slug}
                      href={`/campaigns/${pref.slug}`}
                      className="text-blue-500 underline"
                    >
                      {pref.name}
                    </Link>
                  ) : (
                    <span key={pref.slug} className="text-gray-400">
                      {pref.name}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
