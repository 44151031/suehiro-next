import { campaigns } from "@/lib/campaigns";
import { prefectures, prefectureGroups } from "@/lib/prefectures";
import Link from "next/link";

export default function PrefectureList() {
  const activePrefectureSlugs = campaigns.map((c) => c.prefectureSlug);

  return (
    <section className="w-full py-16 bg-muted text-muted-foreground">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* タイトル */}
        <h2 className="text-2xl font-bold text-primary drop-shadow-md mb-10 text-center">
          エリア別キャンペーン
        </h2>

        {/* エリアグループごと */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {prefectureGroups.map((group) => {
            const groupPrefectures = prefectures.filter((p) => p.group === group);

            return (
              <div key={group}>
                <h3 className="text-lg font-bold text-accent mb-3">{group}</h3>
                <div className="flex flex-wrap gap-2">
                  {groupPrefectures.map((pref) => {
                    const isActive = activePrefectureSlugs.includes(pref.slug);

                    return isActive ? (
                      <Link
                        key={pref.slug}
                        href={`/campaigns/${pref.slug}`}
                        className="px-3 py-1 rounded-full text-sm font-medium text-primary bg-white border border-border hover:bg-accent/10 transition"
                      >
                        {pref.name}
                      </Link>
                    ) : (
                      <span
                        key={pref.slug}
                        className="px-3 py-1 rounded-full text-sm text-muted-foreground bg-gray-100 border border-dashed border-border cursor-default"
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
