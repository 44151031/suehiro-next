"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { campaigns } from "@/lib/campaignMaster";
import { prefectures, prefectureGroups } from "@/lib/prefectures";
import { getCampaignStatus } from "@/lib/campaignUtils";

export function PrefectureSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const segments = pathname.split("/");
  const [_, __, prefSlug, citySlug, paytypeSlug] = segments;

  const isCityPage = !!prefSlug && !!citySlug && !paytypeSlug;
  const isCityPaytypePage = !!prefSlug && !!citySlug && !!paytypeSlug;

  const currentCampaign = campaigns.find(
    (c) =>
      c.prefectureSlug === prefSlug &&
      (isCityPage || isCityPaytypePage ? c.citySlug === citySlug : true)
  );

  const label = currentCampaign
    ? isCityPage || isCityPaytypePage
      ? `${currentCampaign.prefecture}${currentCampaign.city}｜エリア変更`
      : `${currentCampaign.prefecture}｜エリア変更`
    : "都道府県を選択してください";

  // ✅ 終了していないキャンペーンの都道府県スラッグ一覧
  const activePrefectureSlugs = Array.from(
    new Set(
      campaigns
        .filter(
          (c) => getCampaignStatus(c.startDate, c.endDate) !== "ended"
        )
        .map((c) => c.prefectureSlug)
    )
  );

  const isGroupActive = (group: string) =>
    prefectures.some(
      (p) => p.group === group && activePrefectureSlugs.includes(p.slug)
    );

  const filteredPrefectures = selectedGroup
    ? prefectures.filter((p) => p.group === selectedGroup)
    : [];

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSelectedGroup(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full text-xs sm:text-sm"
          onClick={() => setOpen(true)}
        >
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {selectedGroup ? `${selectedGroup}の都道府県を選択` : "エリアを選択"}
          </DialogTitle>
        </DialogHeader>

        {!selectedGroup && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {prefectureGroups.map((group) => {
              const active = isGroupActive(group);
              return (
                <Button
                  key={group}
                  variant="secondary"
                  className="text-sm"
                  onClick={() => active && setSelectedGroup(group)}
                  disabled={!active}
                >
                  {group}
                </Button>
              );
            })}
          </div>
        )}

        {selectedGroup && (
          <>
            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto mt-4">
              {filteredPrefectures.map((pref) => {
                const isActive = activePrefectureSlugs.includes(pref.slug);
                return (
                  <Button
                    key={pref.slug}
                    variant="ghost"
                    size="sm"
                    className="justify-start text-sm"
                    onClick={() => {
                      if (isActive) {
                        router.push(`/campaigns/${pref.slug}`);
                        setOpen(false);
                      }
                    }}
                    disabled={!isActive}
                  >
                    {pref.name}
                  </Button>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedGroup(null)}
              >
                ← エリアに戻る
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
