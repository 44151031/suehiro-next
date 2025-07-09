'use client';

import { useEffect, useState } from 'react';
import { ArrowDownCircle } from 'lucide-react'; // アイコン追加

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
    <div className="my-4 text-center">
      <a
        href="#shop-list-section"
        className="inline-flex items-center gap-2 bg-white text-[#e60000] border border-[#e60000] font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#e60000] hover:text-white transition-colors duration-300"
      >
        <ArrowDownCircle className="w-5 h-5" />
        今すぐ対象店舗を見る
      </a>
    </div>
  );
}
