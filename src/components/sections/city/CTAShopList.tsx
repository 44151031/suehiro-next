'use client';

import { useEffect, useState } from 'react';

type Props = {
  prefectureSlug: string;
  citySlug: string;
  paytype: string;
};

export default function CTAShopList({
  prefectureSlug,
  citySlug,
  paytype,
}: Props) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const jsonPath = `/data/${prefectureSlug}-${citySlug}-${paytype}-shops.json`;
    fetch(jsonPath, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          setShowButton(true);
        }
      })
      .catch(() => {});
  }, [prefectureSlug, citySlug, paytype]);

  if (!showButton) return null;

  return (
    <div className="my-6 text-center">
      <a
        href="#shop-list-section"
        className="inline-block bg-[#ff5050] text-white font-bold py-3 px-6 rounded-md hover:bg-[#e64444] transition-colors duration-200"
      >
        今すぐ対象店舗を見る
      </a>
    </div>
  );
}
