'use client';

import GetLocationButton from '@/components/common/GetLocationButton';

export default function LocationSortSection() {
  return (
    <section className="w-full bg-white py-1">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-center">
          <GetLocationButton />
        </div>
      </div>
    </section>
  );
}