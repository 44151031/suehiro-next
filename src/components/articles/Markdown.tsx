// src/components/articles/Markdown.tsx
import { mdToHtml } from "@/lib/markdown";

type Props = { source: string };

export default async function Markdown({ source }: Props) {
  const html = await mdToHtml(source ?? "");
  // typography を使っていない場合でも崩れにくいよう最低限の余白
  return (
    <div
      className="prose max-w-none leading-relaxed [&>h1]:mt-8 [&>h2]:mt-7 [&>h3]:mt-6 [&>p]:my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
