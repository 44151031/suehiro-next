// /components/sections/SearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from "lucide-react";

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      alert('市区町村または都道府県を入力してください');
      return;
    }
    router.push(`/campaigns/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <section className="-mt-6 z-10 relative">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl px-6 py-10 border border-border">
          <h2 className="text-3xl font-semibold text-muted-foreground text-center mb-8 tracking-tight">
            地域からキャンペーンを探す
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
            <div className="flex w-full max-w-xl rounded-full border bg-white shadow-md focus-within:ring-2 focus-within:ring-primary transition">
              <Input
                type="text"
                placeholder="市区町村や都道府県名を入力"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-full border-0 bg-transparent px-6 py-4 text-base focus-visible:ring-0"
              />
              <Button
                onClick={handleSearch}
                className="rounded-full rounded-l-none px-6 py-4 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Search className="mr-2 h-4 w-4" />
                検索
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
