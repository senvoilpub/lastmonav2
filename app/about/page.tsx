"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-24 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-20">
          {/* Hero heading + intro */}
          <section className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                {lang === "en" ? "About us" : "À propos"}
              </h1>
            </div>

            <div className="mt-4 flex justify-start">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl text-left">
                {lang === "en"
                  ? "We’re a European startup dedicated to helping talent move toward the jobs they aspire to. At a time when recruiting feels noisy and dominated by a few giants, we’re focused on rebuilding the experience from the ground up. With smart, ethical use of AI, we help you transform your story into a resume that opens doors."
                  : "Nous sommes une startup européenne dédiée à aider les talents à se rapprocher des postes auxquels ils aspirent. À une époque où le recrutement est bruyant et dominé par quelques géants, nous voulons reconstruire l’expérience depuis la base. Avec une utilisation intelligente et responsable de l’IA, nous vous aidons à transformer votre histoire en un CV qui ouvre des portes."}
              </p>
            </div>
          </section>

          {/* (All additional sections below the intro have been removed intentionally) */}
        </div>
      </main>

      {/* Footer Section (same structure as landing) */}
      <footer className="mt-20 py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left - Company Logo and Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Lastmona Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-lg font-bold text-indigo-600 tracking-tight">
                  Lastmona
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {lang === "en"
                  ? "Our first mission: make it simple to build resumes people are proud to send. Everything else will build on top of that."
                  : "Notre première mission : rendre simple la création de CV dont les gens sont fiers. Tout le reste se construira dessus."}
              </p>
            </div>

            {/* Middle - Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {lang === "en" ? "Company" : "Entreprise"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "About us" : "À propos"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Contact" : "Contact"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right - Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {lang === "en" ? "Legal" : "Mentions légales"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Privacy" : "Confidentialité"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Terms of service" : "Conditions d'utilisation"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Security" : "Sécurité"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

