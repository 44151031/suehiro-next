import fs from "fs";
import path from "path";

export function loadGenres(prefectureSlug: string, citySlug: string): string[] {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    `${prefectureSlug}-${citySlug}-shops.json`
  );

  try {
    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Object.keys(json);
  } catch {
    return [];
  }
}
