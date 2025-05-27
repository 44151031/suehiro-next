const genreClassMap: Record<string, string> = {
  飲食: "bg-red-100 text-red-700 border border-red-200",
  宿泊: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  小売: "bg-green-100 text-green-700 border border-green-200",
  サービス: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  その他: "bg-gray-100 text-gray-700 border border-gray-200",
};

export default function GenreBadges({ genres }: { genres: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {genres.map((genre) => (
        <span
          key={genre}
          className={`text-xs sm:text-sm px-3 py-1 rounded-full font-medium ${
            genreClassMap[genre] || "bg-gray-100 text-gray-700 border"
          }`}
        >
          {genre}
        </span>
      ))}
    </div>
  );
}
