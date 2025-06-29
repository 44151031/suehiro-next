type FAQEntity = {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
};

export function generateFAQEntities(
  questions: string[],
  answers: string[]
): FAQEntity[] {
  return questions.map((q, i) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: answers[i],
    },
  }));
}
