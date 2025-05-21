// components/common/PrefectureSelector.tsx

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { campaigns } from "@/lib/campaigns";
import { prefectures } from "@/lib/prefectures";

export function PrefectureSelector({
  currentPrefecture = "山梨県甲府市",
  storeCount = 12,
}: {
  currentPrefecture?: string;
  storeCount?: number;
}) {
  const [open, setOpen] = useState(false);

  const activePrefectureSlugs = campaigns.map((c) => c.prefectureSlug);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full text-xs sm:text-sm">
          {storeCount}件 {currentPrefecture} PayPay対象店舗
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>都道府県を選択してください</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto mt-4">
          {prefectures.map((pref) => {
            const isActive = activePrefectureSlugs.includes(pref.slug);
            return isActive ? (
              <Link
                key={pref.slug}
                href={`/campaigns/${pref.slug}`}
                onClick={() => setOpen(false)}
                className="text-blue-600 hover:underline text-sm"
              >
                {pref.name}
              </Link>
            ) : (
              <span key={pref.slug} className="text-gray-400 text-sm">
                {pref.name}
              </span>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}