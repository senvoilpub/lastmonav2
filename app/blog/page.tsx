"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BlogPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} onLangChange={setLang} />
      
      <div className="pt-24 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* EU Banner */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-full border border-purple-200">
              <Image
                src="/europeflag.png"
                alt="European Union Flag"
                width={24}
                height={18}
                className="object-contain"
              />
              <span className="text-sm text-gray-700 font-medium">
                {lang === "en"
                  ? "We are a European company dedicated to helping talent reach their dream careers."
                  : "Nous sommes une entreprise européenne dédiée à aider les talents à atteindre la carrière dont ils rêvent."}
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-12">
            {/* Left Side - Text Content */}
            <div className="space-y-8 pt-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {lang === "en" ? (
                  <>
                    Career insights, tips, and{" "}
                    <span className="text-indigo-600">stories that matter</span>
                  </>
                ) : (
                  <>
                    Conseils de carrière, astuces et{" "}
                    <span className="text-indigo-600">histoires qui comptent</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed min-h-[96px]">
                {lang === "en" ? (
                  <>
                    Welcome to the Lastmona blog. We share insights about resumes, career development,
                    and the future of hiring. Join us as we explore how to build better careers and
                    rebuild trust in recruitment.
                  </>
                ) : (
                  <>
                    Bienvenue sur le blog Lastmona. Nous partageons des conseils sur les CV, le développement
                    de carrière et l&apos;avenir du recrutement. Rejoignez-nous pour explorer comment construire
                    de meilleures carrières et recréer la confiance dans le recrutement.
                  </>
                )}
              </p>
              <div className="pt-4">
                <Link
                  href="https://lastmona.com"
                  className="inline-block px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all"
                >
                  {lang === "en" ? "Try Lastmona" : "Essayer Lastmona"}
                </Link>
              </div>
            </div>

            {/* Right Side - Blog Illustration */}
            <div className="flex flex-col h-[350px] items-center justify-center">
              <div className="w-full max-w-lg text-center space-y-6">
                <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-indigo-200 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {lang === "en" ? "Coming Soon" : "Bientôt disponible"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {lang === "en"
                        ? "We're preparing great content about careers, resumes, and hiring."
                        : "Nous préparons du contenu de qualité sur les carrières, les CV et le recrutement."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Topics Section */}
          <div className="mt-12 mb-16">
            <div className="max-w-7xl">
              <div className="space-y-12">
                <h2 className="text-4xl font-bold text-gray-900 leading-tight max-w-3xl">
                  {lang === "en"
                    ? "What we'll cover"
                    : "Ce que nous allons couvrir"}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl">
                  {lang === "en"
                    ? "Our blog will feature articles about resume writing, career development, hiring trends, and insights from the recruitment industry."
                    : "Notre blog présentera des articles sur la rédaction de CV, le développement de carrière, les tendances du recrutement et des insights de l'industrie du recrutement."}
                </p>

                <div className="relative">
                  {/* Connecting flow line - hidden on mobile */}
                  <div
                    className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 transform -translate-y-1/2 z-0"
                    style={{ marginLeft: "12%", marginRight: "12%" }}
                  ></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border-2 border-indigo-200 hover:border-indigo-300 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-indigo-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en" ? "Resume Tips" : "Conseils CV"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Learn how to write resumes that stand out and get you noticed by recruiters."
                          : "Apprenez à rédiger des CV qui sortent du lot et attirent l'attention des recruteurs."}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en" ? "Career Growth" : "Développement de carrière"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Strategies and insights to advance your career and reach your professional goals."
                          : "Stratégies et conseils pour faire progresser votre carrière et atteindre vos objectifs professionnels."}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-blue-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en" ? "Hiring Trends" : "Tendances du recrutement"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Stay updated on the latest trends in recruitment and what employers are looking for."
                          : "Restez informé des dernières tendances en recrutement et de ce que recherchent les employeurs."}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl border-2 border-indigo-300 hover:border-indigo-400 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center mb-4">
                        <svg
                          className="w-6 h-6 text-indigo-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en" ? "Industry Insights" : "Insights de l'industrie"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Deep dives into the recruitment industry and how we're working to improve it."
                          : "Analyses approfondies de l'industrie du recrutement et de la façon dont nous travaillons à l'améliorer."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
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
                      href="https://lastmona.com/about"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "About us" : "À propos"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/contact"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Contact" : "Contact"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Main website" : "Site principal"}
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
                      href="https://lastmona.com/privacy"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Privacy" : "Confidentialité"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/terms"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Terms of service" : "Conditions d'utilisation"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/security"
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
    </div>
  );
}

