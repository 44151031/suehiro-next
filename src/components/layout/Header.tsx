// components/layout/Header.tsx

'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PrefectureSelector } from "@/components/common/PrefectureSelector";

const menuItems = [
  { name: "トップ", href: "/" },
  { name: "キャンペーン一覧", href: "/campaigns" },
  { name: "サイトについて", href: "/about" },
  { name: "お問い合わせ", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled ? "bg-white shadow" : "bg-white/80 backdrop-blur-md"
        )}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-sm sm:text-base md:text-lg font-bold text-gray-800 hover:opacity-80">
            PayPay自治体クーポン体験「<span className="text-red-500">Pay市</span>（ペイイチ）」
          </Link>

          <div className="flex items-center space-x-4">
            <PrefectureSelector currentPrefecture="山梨県甲府市" storeCount={12} />
            <button
              className="sm:hidden text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <nav className="fixed top-0 left-0 w-3/4 h-full z-50 bg-white shadow-lg p-6 transition-transform duration-300">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block text-gray-800 font-medium text-base"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}