// components/sections/SearchForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  return (
    <section className="bg-muted py-12 border-b border-border">
      <div className="max-w-screen-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          地域からキャンペーンを探す
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <Input
            type="text"
            placeholder="市区町村や都道府県名を入力"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 bg-white"
          />
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground rounded-full px-6 py-2 transition"
          >
            キャンペーン一覧を見る
          </Button>
        </div>
      </div>
    </section>
  );
}
