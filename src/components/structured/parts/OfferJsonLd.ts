export default function OfferJsonLd({
  city,
  paytype,
  offerRate,
  offerDescription,
  validFrom,
  validThrough,
  url,
  onePayLimit,
  fullPayLimit,
}) {
  const onePayFormatted = Number(onePayLimit).toLocaleString();
  const fullPayFormatted = Number(fullPayLimit).toLocaleString();
  const offerLimitDescription = `最大${offerRate}％ポイント還元。1回あたり最大${onePayFormatted}円、期間合計最大${fullPayFormatted}円まで。`;

  return {
    "@type": "Offer",
    name: `最大${offerRate}％ポイント還元キャンペーン（${city} × ${paytype}）`,
    description: offerDescription,
    priceCurrency: "JPY",
    validFrom,
    validThrough,
    url,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      priceCurrency: "JPY",
      description: offerLimitDescription,
    },
  };
}
