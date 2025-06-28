import { generateCityCampaignFAQ } from "@/lib/FAQTemplateGenerator";

export default function FAQJsonLd({ prefecture, city, paytype }) {
  const { questions, answers } = generateCityCampaignFAQ(prefecture, city, paytype);
  return {
    "@type": "FAQPage",
    mainEntity: questions.map((q, i) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: answers[i],
      },
    })),
  };
}
