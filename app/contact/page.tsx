"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SEOStructuredData from "@/components/SEOStructuredData";

export default function ContactPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  const email = "builtpublic@gmail.com";

  return (
    <div className="min-h-screen bg-white">
      <SEOStructuredData type="contact" />
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-24 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {lang === "en" ? "Contact" : "Contact"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {lang === "en" ? "Get in touch" : "Entrer en contact"}
            </h1>
            <p className="text-sm text-gray-500">
              {lang === "en"
                ? "Questions, feedback, ideas — we’d love to hear from you."
                : "Questions, retours, idées — nous serons ravis d’échanger avec vous."}
            </p>
          </header>

          <section className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-700">
            <p>
              {lang === "en"
                ? "You can reach the Lastmona team directly by email. We read every message and do our best to respond as soon as we can."
                : "Vous pouvez joindre directement l’équipe Lastmona par e-mail. Nous lisons chaque message et faisons de notre mieux pour répondre rapidement."}
            </p>

            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {lang === "en" ? "Email" : "E-mail"}
                </p>
                <p className="mt-1 text-base font-medium text-gray-900">
                  <a
                    href={`mailto:${email}`}
                    className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
                  >
                    {email}
                  </a>
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {lang === "en"
                ? "Please avoid sending highly sensitive personal information by email."
                : "Merci d’éviter d’envoyer par e-mail des informations personnelles très sensibles."}
            </p>
          </section>
        </div>
      </main>

      {/* Footer – same structure as other pages */}
      <footer className="mt-10 py-12 border-t border-gray-100">
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
                  ? "Our mission is to make it simple to build resumes people are proud to send."
                  : "Notre mission est de rendre simple la création de CV dont les gens sont fiers."}
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


