'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  Home,
  Gift,
  Info,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PrefectureSelector } from "@/components/ui/selectors/RegionPrefectureSelector";
import Container from "@/components/layout/Container";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

const menuItems = [
  { name: "トップ", href: "/", icon: Home },
  { name: "キャンペーン一覧", href: "/campaigns", icon: Gift },
  { name: "サイトについて", href: "/about", icon: Info },
  { name: "お問い合わせ", href: "/contact", icon: Mail },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        isScrolled ? "bg-white shadow" : "bg-white/80 backdrop-blur-md"
      )}
    >
      <Container>
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm sm:text-base md:text-lg font-bold text-gray-800 hover:opacity-80"
          >
            PayPay・auPay・楽天pay・d払い市区町村キャンペーン体験
            <br className="block sm:hidden" />
            「<span className="text-red-500">キャンPay</span>(キャンペイ)」
          </Link>

          <div className="flex items-center space-x-4">
            {/* PrefectureSelector 内部ですべて自己完結 */}
            <PrefectureSelector />

            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="sm:hidden text-gray-600"
                  aria-label="メニュー"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-3/4 max-w-xs bg-white/80 backdrop-blur-md shadow-xl animate-in slide-in-from-left duration-300 flex flex-col"
              >
                <SheetTitle className="sr-only">メニューを開く</SheetTitle>

                <nav className="mt-8 space-y-4">
                  {menuItems.map(({ name, href, icon: Icon }) => (
                    <Link
                      key={name}
                      href={href}
                      className="flex items-center space-x-3 text-gray-800 font-medium text-base hover:text-orange-500 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">© 2025 Pay市</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
