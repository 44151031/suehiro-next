// components/sections/SearchForm.tsx

'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { prefectures } from '@/lib/prefectures';
import { campaigns } from '@/lib/campaigns';
import { Check } from 'lucide-react';

export default function SearchForm() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<{ name: string; slug: string } | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ✅ アクティブ都道府県（campaigns から取得）
  const activePrefectureSlugs = campaigns.map((c) => c.prefectureSlug);

  // ✅ 最近の選択を localStorage から読み込み
  useEffect(() => {
    const stored = localStorage.getItem("lastSelectedPrefecture");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedPrefecture(parsed);
      } catch (e) {
        console.warn("都道府県読み込み失敗", e);
      }
    }
  }, []);

  // ✅ 選択時に localStorage に保存
  const handleSelectPrefecture = (pref: { name: string; slug: string }) => {
    setSelectedPrefecture(pref);
    localStorage.setItem("lastSelectedPrefecture", JSON.stringify(pref));
    setOpen(false);
  };

  const handleSearch = () => {
    if (!selectedPrefecture) {
      alert('地域を選択してください');
      return;
    }
    router.push(`/campaigns/${selectedPrefecture.slug}`);
  };

  return (
    <section className="bg-white py-8 border-b">
      <div className="max-w-screen-md mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">
          地域からキャンペーンを探す
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Input
                readOnly
                placeholder="地域を選択"
                value={selectedPrefecture?.name || ''}
                className="flex-1 cursor-pointer bg-white"
              />
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>都道府県を選択してください</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {prefectures.map((pref) => {
                  const isActive = activePrefectureSlugs.includes(pref.slug);
                  const isSelected = selectedPrefecture?.slug === pref.slug;

                  return (
                    <Button
                      key={pref.slug}
                      variant={isSelected ? "default" : "ghost"}
                      onClick={() => isActive && handleSelectPrefecture(pref)}
                      className="justify-between"
                      disabled={!isActive}
                    >
                      {pref.name}
                      {isSelected && <Check className="w-4 h-4 ml-2" />}
                    </Button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            キャンペーン一覧を見る
          </Button>
        </div>
      </div>
    </section>
  );
}