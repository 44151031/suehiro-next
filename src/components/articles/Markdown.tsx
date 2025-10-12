// src/components/articles/Markdown.tsx
import { mdToHtml } from "@/lib/markdown";

/**
 * Markdown コンテンツを HTML に変換して表示するコンポーネント。
 * - SSR対応（asyncコンポーネント）
 * - Tailwind Typography（prose）をベースにPayキャン用スタイルを統一
 * - Markdown未使用環境でも崩れにくい最低限の余白を確保
 */

type Props = {
  /** Markdownソース（DBなどから取得） */
  source: string;
};

export default async function Markdown({ source }: Props) {
  const html = await mdToHtml(source ?? "");

  return (
    <div
      className="
prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed md:leading-loose
prose-headings:font-bold prose-headings:scroll-mt-24 prose-headings:text-gray-900
prose-h2:!text-[1.75rem] prose-h2:!mt-16 prose-h2:!mb-8 prose-h2:relative prose-h2:pl-5
prose-h2:before:absolute prose-h2:before:left-0 prose-h2:before:top-1/2 prose-h2:before:-translate-y-1/2
prose-h2:before:h-[70%] prose-h2:before:w-[5px] prose-h2:before:rounded-full
prose-h2:before:bg-gradient-to-b prose-h2:before:from-sky-400 prose-h2:before:to-blue-600
prose-h3:!text-xl prose-h3:!mt-12 prose-h3:!mb-5 prose-h3:text-blue-700 prose-h3:border-b prose-h3:border-blue-100 prose-h3:pb-1
prose-h4:!text-lg prose-h4:!mt-8 prose-h4:!mb-3 prose-h4:text-gray-700
prose-p:my-6 prose-p:leading-relaxed md:prose-p:leading-loose
prose-strong:text-gray-900 prose-strong:font-semibold
prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[90%] prose-code:text-blue-700
prose-li:my-3 prose-ul:pl-6 prose-ol:pl-6 prose-ul:list-disc prose-ol:list-decimal prose-li:leading-relaxed prose-li:marker:text-blue-400
prose-a:text-blue-600 hover:prose-a:text-blue-700 hover:prose-a:underline transition-colors duration-150
prose-blockquote:bg-gradient-to-r prose-blockquote:from-gray-50 prose-blockquote:to-gray-100
prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:rounded-r-xl prose-blockquote:p-5 prose-blockquote:text-gray-700 prose-blockquote:italic prose-blockquote:shadow-sm
prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:mx-auto prose-img:border prose-img:border-gray-100 prose-img:bg-white
prose-table:my-8 prose-table:w-full prose-table:border prose-table:border-gray-200 prose-table:rounded-lg
prose-th:bg-gray-50 prose-th:font-semibold prose-th:px-4 prose-th:py-2 prose-th:text-gray-700
prose-td:px-4 prose-td:py-2 prose-td:border-t prose-td:border-gray-200 hover:prose-tr:bg-gray-50 transition-colors duration-150 prose-table:text-sm prose-table:leading-relaxed
[&>h1]:mt-10 [&>h2]:mt-14 [&>h3]:mt-10 [&>p]:my-5 [&>ul]:my-6 [&>ol]:my-6 [&>blockquote]:my-8
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
