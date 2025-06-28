export default function PlaceJsonLd({ prefecture, city }) {
  const isCity = Boolean(city);
  return {
    "@type": "Place",
    name: isCity ? `${prefecture}${city}` : prefecture,
    address: {
      "@type": "PostalAddress",
      addressRegion: prefecture,
      ...(isCity ? { addressLocality: city } : {}),
      addressCountry: "JP",
    },
  };
}
