"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Lang = "en" | "fr";

interface NavbarProps {
  lang?: Lang;
  onLangChange?: (lang: Lang) => void;
}

export default function Navbar({ lang = "en", onLangChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full bg-white transition-shadow ${
        scrolled ? "border-b border-gray-200 shadow-sm" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Lastmona Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-xl font-bold text-indigo-600 tracking-tight">
              Lastmona
            </span>
          </Link>

          {/* Middle Navigation - currently empty (Blog removed) */}
          <div className="hidden md:flex md:items-center" />

          {/* Right side - Language switcher + CTA */}
          <div className="flex items-center gap-4 min-w-[220px] justify-end">
            <div className="hidden sm:flex items-center gap-1 rounded-full bg-gray-100 px-1 py-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => onLangChange && onLangChange("en")}
                className={`px-3 py-1 rounded-full transition-colors ${
                  lang === "en"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLangChange && onLangChange("fr")}
                className={`px-3 py-1 rounded-full transition-colors ${
                  lang === "fr"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                FR
              </button>
            </div>

            <Link
              href="/signin"
              className="w-[130px] text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-700 transition-all"
            >
              {lang === "en" ? "Sign in" : "Se connecter"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

