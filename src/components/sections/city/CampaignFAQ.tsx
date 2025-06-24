// ✅ /components/sections/city/CityCampaignFAQ.tsx
"use client";

import { generateCityCampaignFAQ } from "@/lib/FAQTemplateGenerator";

type Props = {
  prefecture: string;
  city: string;
  payLabel: string; // 型定義を簡略化（PayService 削除）
};

export default function CityCampaignFAQ({ prefecture, city, payLabel }: Props) {
  const { questions, answers } = generateCityCampaignFAQ(
    prefecture,
    city,
    payLabel
  );

  return (
    <section className="mt-14">
      <h2 className="headline2 mb-6">
        {city}でよくある{payLabel}キャンペーンの質問
      </h2>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <details
            key={index}
            className="border rounded-lg bg-white px-4 py-3 shadow-sm"
          >
            <summary className="cursor-pointer font-semibold text-base text-gray-800">
              Q. {q}
            </summary>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">
              {answers[index]}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
