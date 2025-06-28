export default function EventJsonLd({
  city,
  prefecture,
  offerRate,
  validFrom,
  validThrough,
  url,
  imageUrl,
  officialUrl,
}) {
  return {
    "@type": "Event",
    name: `${city}のキャンペーン（最大${offerRate}％還元）`,
    startDate: validFrom,
    endDate: validThrough,
    eventStatus: "http://schema.org/EventScheduled",
    eventAttendanceMode: "http://schema.org/OnlineEventAttendanceMode",
    url,
    image: imageUrl,
    location: {
      "@type": "Place",
      name: `${prefecture}${city}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressRegion: prefecture,
        addressCountry: "JP",
      },
    },
    organizer: {
      "@type": "GovernmentOrganization",
      name: `${prefecture}${city}`,
      url: officialUrl || url,
    },
    performer: {
      "@type": "Organization",
      name: "Payキャン運用事務局",
    },
    description: `最大${offerRate}％ポイント還元。1回あたり最大5,000円、期間合計最大10,000円まで。`,
  };
}
