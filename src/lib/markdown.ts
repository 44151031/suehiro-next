// src/lib/markdown.ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

// 画像など最低限の属性を許可（必要に応じて拡張）
const schema: any = structuredClone(defaultSchema);
schema.attributes = {
  ...schema.attributes,
  img: [
    ...(schema.attributes?.img || []),
    ["alt", "className", "height", "width", "loading", "decoding"],
    ["src", "href"],
  ],
  a: [
    ...(schema.attributes?.a || []),
    ["target", "rel"],
  ],
};

export async function mdToHtml(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkSmartypants)
    .use(remarkRehype, { allowDangerousHtml: true }) // Markdown中のHTMLをHASTへ
    .use(rehypeRaw)                                   // そのHTMLもマージ
    .use(rehypeSanitize, schema)                      // 🔒 サニタイズ
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify)
    .process(md);

  return String(file);
}
