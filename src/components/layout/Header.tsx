'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { PrefectureSelector } from "@/components/ui/selectors/RegionPrefectureSelector";
import Container from "@/components/layout/Container";
import MobileMenu from "@/components/ui/MobileMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // スクロールでヘッダー影
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ メニュー開閉でbodyスクロール制御
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-300 ${
          isScrolled ? "bg-white shadow" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <Container>
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex flex-col leading-tight group">
              <span className="text-xs sm:text-sm text-neutral-600">
                PayPay・au PAY・楽天ペイ・d払い還元体験
              </span>
              <span className="flex items-center gap-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                <Image
                  src="/logo.png"
                  alt="Payキャンロゴ"
                  width={32}
                  height={32}
                  className="w-8 h-8 hidden sm:block"
                />
                <span className="text-red-600">Pay</span>
                <span className="text-xl text-gray-800 font-medium">キャン</span>
                <span className="text-sm text-gray-600 font-medium hidden sm:inline">(ペイキャン)</span>
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <PrefectureSelector />
              <button
                onClick={() => setMenuOpen(true)}
                className="sm:hidden text-gray-700"
                aria-label="メニューを開く"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </>
  );
}
