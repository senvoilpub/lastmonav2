"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import ResumeDisplay from "@/components/ResumeDisplay";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [input, setInput] = useState("");
  const [resumeData, setResumeData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const maxWords = 80;
  const maxChars = 600;

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError(
        lang === "en"
          ? "Please describe your experience"
          : "Merci de décrire votre expérience"
      );
      return;
    }

    if (wordCount > maxWords) {
      setError(
        lang === "en"
          ? `Please limit your description to ${maxWords} words`
          : `Limitez votre description à ${maxWords} mots`
      );
      return;
    }

    if (input.length > maxChars) {
      setError(
        lang === "en"
          ? `Please limit your description to ${maxChars} characters`
          : `Limitez votre description à ${maxChars} caractères`
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experience: input }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      setResumeData(data.resume);
      try {
        if (typeof window !== "undefined" && data.resume) {
          window.localStorage.setItem(
            "lastmona_resume",
            JSON.stringify(data.resume)
          );
          window.localStorage.setItem("lastmona_prompt", input);
        }
      } catch {
        // Ignore storage errors
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
                    Build a resume that{" "}
                    <span className="text-indigo-600">actually tells your story</span>
                  </>
                ) : (
                  <>
                    Créez un CV qui{" "}
                    <span className="text-indigo-600">raconte vraiment votre histoire</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed min-h-[96px]">
                {lang === "en" ? (
                  <>
                    Lastmona turns your raw experience into a clean, modern resume using AI.
                    We&apos;ll do more for hiring soon, but we&apos;re starting where trust begins:
                    with a resume that feels true to you.
                  </>
                ) : (
                  <>
                    Lastmona transforme votre expérience brute en un CV clair et moderne grâce à l&apos;IA.
                    On fera plus pour réinventer le recrutement, mais on commence là où tout commence :
                    avec un CV qui vous ressemble vraiment.
                  </>
                )}
              </p>
              <div className="pt-4">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="inline-block px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all"
                  >
                    {lang === "en" ? "Go to dashboard" : "Aller au tableau de bord"}
                  </Link>
                ) : (
                  <Link
                    href="/signin"
                    className="inline-block px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-full shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all"
                  >
                    {lang === "en" ? "Start now" : "Commencer maintenant"}
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side - Input or Output */}
            <div className="flex flex-col h-[350px] items-center">
              {isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h2 className="mt-6 text-lg font-semibold leading-tight mb-3 text-indigo-600">
                    {lang === "en"
                      ? "You’re signed in."
                      : "Vous êtes connecté."}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 max-w-sm">
                    {lang === "en"
                      ? "You can now manage everything from your dashboard."
                      : "Vous pouvez maintenant tout gérer depuis votre tableau de bord."}
                  </p>
                  <Link
                    href="/dashboard"
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-700 transition-all"
                  >
                    {lang === "en" ? "Open dashboard" : "Ouvrir le tableau de bord"}
                  </Link>
                </div>
              ) : !resumeData ? (
                <>
                  <h2 className="mt-6 text-lg font-semibold leading-tight mb-3 text-indigo-600 animated-text text-center">
                    {lang === "en"
                      ? "Test our AI resume builder, it’s free"
                      : "Testez notre générateur de CV avec IA, gratuitement"}
                  </h2>
                  <div className="w-full max-w-lg">
                    <textarea
                      value={input}
                      onChange={(e) => {
                        const text = e.target.value;
                        if (text.length <= maxChars) {
                          const words = text.trim().split(/\s+/).filter(Boolean);
                          if (words.length <= maxWords) {
                            setInput(text);
                            setError(null);
                          }
                        }
                      }}
                      placeholder={
                        lang === "en"
                          ? "Describe your experience, skills, and what you’re proud of. We’ll turn it into a resume."
                          : "Décrivez votre expérience, vos compétences et ce dont vous êtes fier. On en fera un CV."
                      }
                      className="w-full px-4 py-3 rounded-xl animated-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none text-gray-900 placeholder-gray-400 text-sm leading-relaxed transition-all"
                      style={{ minHeight: '250px' }}
                    />
                    <div className="mt-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                      {wordCount >= 50 && (
                        <span
                          className={`text-xs font-medium ${
                            wordCount >= maxWords
                              ? "text-red-500"
                              : "text-orange-500"
                          }`}
                        >
                          {wordCount} / {maxWords} {lang === "en" ? "words" : "mots"}
                        </span>
                      )}
                      {error && (
                        <span className="text-xs text-red-500">{error}</span>
                      )}
                    </div>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading || !input.trim() || wordCount > maxWords || input.length > maxChars}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-sm hover:shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isLoading
                          ? lang === "en"
                            ? "Creating your resume..."
                            : "Création de votre CV..."
                          : lang === "en"
                          ? "Generate my resume"
                          : "Générer mon CV"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex-shrink-0">
                    {lang === "en" ? "Your Resume" : "Votre CV"}
                  </h2>
                  <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm" style={{ minHeight: 0, maxHeight: "100%" }}>
                    <ResumeDisplay
                      resumeData={resumeData}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How it works Section - Focused on AI CV builder */}
          <div className="mt-12 mb-16">
            <div className="max-w-7xl">
              <div className="space-y-12">
                <h2 className="text-4xl font-bold text-gray-900 leading-tight max-w-3xl">
                  {lang === "en"
                    ? "From a few lines of text to a ready-to-use resume."
                    : "De quelques lignes de texte à un CV prêt à envoyer."}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl">
                  {lang === "en"
                    ? "We started Lastmona with one simple thing: make it painless to create a great resume. The rest of the platform will come on top of that."
                    : "On a commencé Lastmona avec une idée simple : rendre la création d’un bon CV enfin simple. Le reste de la plateforme viendra ensuite."}
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
                        <span className="text-indigo-700 font-bold text-lg">1</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en" ? "You write freely" : "Vous écrivez librement"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Type your story once: experience, skills, side projects, what you’re proud of."
                          : "Racontez votre histoire une fois : expériences, compétences, projets, ce dont vous êtes fier."}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-4">
                        <span className="text-purple-700 font-bold text-lg">2</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en"
                          ? "AI shapes your resume"
                          : "L’IA façonne votre CV"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Our AI rewrites it following resume best practices: clear structure, strong bullets, clean wording."
                          : "Notre IA réécrit le tout selon les bonnes pratiques CV : structure claire, bullet points efficaces, texte propre."}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-200 hover:border-blue-300 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                        <span className="text-blue-700 font-bold text-lg">3</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en"
                          ? "You preview it instantly"
                          : "Vous le voyez tout de suite"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "See a clean, PDF-like version on the right. Tweak your text and regenerate as many times as you want."
                          : "Visualisez une version propre type PDF à droite. Ajustez votre texte et regénérez autant de fois que vous voulez."}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl border-2 border-indigo-300 hover:border-indigo-400 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-indigo-300 flex items-center justify-center mb-4">
                        <span className="text-indigo-800 font-bold text-lg">4</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">
                        {lang === "en"
                          ? "Soon: 1 resume, many jobs"
                          : "Bientôt : 1 CV, plusieurs jobs"}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {lang === "en"
                          ? "Next steps: adapt your resume to each offer, avoid fake jobs, and rebuild trust between talent and companies."
                          : "Prochaine étape : adapter votre CV à chaque offre, éviter les faux jobs et recréer la confiance entre talents et entreprises."}
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
    </div>
  );
}
