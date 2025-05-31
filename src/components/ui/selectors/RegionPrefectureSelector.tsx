'use client';

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
import { campaigns } from "@/lib/campaigns";
import { isCampaignActive } from "@/lib/campaignUtils";
import { useSortedCampaignsByDistance } from "@/hooks/useSortedCampaignsByDistance";
import { prefectures, prefectureGroups } from "@/lib/prefectures";

export function PrefectureSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const sortedCampaigns = useSortedCampaignsByDistance(campaigns);

  const fallbackCampaign =
    sortedCampaigns?.find((c) => isCampaignActive(c.endDate)) || null;

  const isOnTopPage = pathname === "/";

  const displayName = isOnTopPage && fallbackCampaign
    ? `${fallbackCampaign.prefecture} のキャンペーンはこちら`
    : "都道府県を選択してください";

  const activePrefectureSlugToCount = campaigns.reduce<Record<string, number>>((acc, c) => {
    if (isCampaignActive(c.endDate)) {
      acc[c.prefectureSlug] = (acc[c.prefectureSlug] || 0) + 1;
    }
    return acc;
  }, {});
  const activePrefectureSlugs = Object.keys(activePrefectureSlugToCount);

  const isGroupActive = (group: string) =>
    prefectures.some(
      (p) => p.group === group && activePrefectureSlugs.includes(p.slug)
    );

  const filteredPrefectures = selectedGroup
    ? prefectures.filter((p) => p.group === selectedGroup)
    : [];

  // ✅ トップページならそのまま遷移、それ以外はモーダル
  if (isOnTopPage && fallbackCampaign) {
    return (
      <Button
        variant="outline"
        className="rounded-full text-xs sm:text-sm"
        onClick={() =>
          router.push(`/campaigns/${fallbackCampaign.prefectureSlug}`)
        }
      >
        {displayName}
      </Button>
    );
  }

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
          {displayName}
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
