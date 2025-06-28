export function generateFAQEntities(questions, answers) {
  return questions.map((q, i) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: answers[i],
    },
  }));
}
