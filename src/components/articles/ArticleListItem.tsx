import Link from "next/link";

type Props = {
  title: string;
  slug: string;
  hero_image_url?: string | null;
  published_at: string; // ISO
  category?: string | null;
};

function yymm(dateISO: string) {
  const d = new Date(dateISO);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return { y, m };
}

export default function ArticleListItem({
  title,
  slug,
  hero_image_url,
  published_at,
  category,
}: Props) {
  const { y, m } = yymm(published_at);
  const href = `/articles/${y}/${m}/${slug}`;
  const cat = (category ?? "まとめ").trim() || "まとめ";
  const dateText = new Date(published_at).toLocaleString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={href}
      className="group grid grid-cols-[160px_1fr] gap-4 rounded-md p-2 hover:bg-gray-50"
    >
      <div className="relative aspect-[16/10] w-[160px] overflow-hidden rounded border">
        <img
          src={hero_image_url || "/og-default.jpg"}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="min-w-0">
        <span className="inline-flex items-center rounded bg-gray-800 px-2 py-0.5 text-xs font-semibold text-white">
          {cat}
        </span>

        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">
          {title}
        </h3>

        <p className="mt-1 text-right text-xs text-gray-500">{dateText}</p>
      </div>
    </Link>
  );
}
