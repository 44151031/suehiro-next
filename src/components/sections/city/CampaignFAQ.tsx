"use client";

import { generateCityCampaignFAQ } from "@/lib/FAQTemplateGenerator";

type Props = {
  prefecture: string;
  city: string;
  payLabel: string;
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
        よくある質問｜{city}の{payLabel}還元キャンペーン
      </h2>
      <div className="space-y-4">
        {questions.map((q, index) => (
          <details
            key={index}
            className="group rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-300"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-gray-900 hover:opacity-90">
              <h3 className="flex items-center text-base font-semibold text-gray-900">
                <span className="mr-2 text-red-500 font-bold">Q.</span>
                {q}
              </h3>
              <svg
                className="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 text-sm text-gray-700 leading-relaxed">
              {answers[index]}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
