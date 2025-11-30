"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import ResumeDisplay from "@/components/ResumeDisplay";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import SEOStructuredData from "@/components/SEOStructuredData";

export default function Home() {
  const [input, setInput] = useState("");
  const [resumeData, setResumeData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isFallbackResume, setIsFallbackResume] = useState(false);

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
    setIsFallbackResume(false);

    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experience: input, lang }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      setResumeData(data.resume);
      setIsFallbackResume(!!data.fallback);
      try {
        if (typeof window !== "undefined" && data.resume) {
          // Check if user is authenticated before storing with user ID
          const {
            data: { user },
          } = await supabase.auth.getUser();
          
          window.localStorage.setItem(
            "lastmona_resume",
            JSON.stringify(data.resume)
          );
          window.localStorage.setItem("lastmona_prompt", input);
          
          // Only store user ID if user is authenticated
          // If not authenticated, leave user_id empty so it gets cleared when another user logs in
          if (user) {
            window.localStorage.setItem("lastmona_user_id", user.id);
          } else {
            // Remove user_id if user is not authenticated
            // This ensures data is cleared when a different user logs in
            window.localStorage.removeItem("lastmona_user_id");
          }
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
        <SEOStructuredData type="home" />
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
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  {lang === "en"
                    ? "Describe your experience, skills, and achievements. Our AI transforms them into a professional, ATS-friendly resume that stands out."
                    : "Décrivez votre expérience, vos compétences et vos réalisations. Notre IA les transforme en un CV professionnel, compatible ATS, qui se démarque."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {!isAuthenticated && (
                    <Link
                      href="/signup"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors text-center"
                    >
                      {lang === "en" ? "Get started for free" : "Commencer gratuitement"}
                    </Link>
                  )}
                  {isAuthenticated && (
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors text-center"
                    >
                      {lang === "en" ? "Go to dashboard" : "Aller au tableau de bord"}
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Side - Resume Preview */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
                  <ResumeDisplay
                    resumeData={resumeData}
                    isLoading={isLoading}
                    mode="preview"
                  />
                </div>
              </div>
            </div>

            {/* Input Section */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {lang === "en" ? "Create your resume" : "Créez votre CV"}
                  </h2>
                  <div className="inline-flex items-center rounded-full bg-gray-100 px-1 py-1 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={`px-3 py-1 rounded-full ${
                        lang === "en"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:text-indigo-600"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("fr")}
                      className={`px-3 py-1 rounded-full ${
                        lang === "fr"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-600 hover:text-indigo-600"
                      }`}
                    >
                      FR
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {lang === "en"
                    ? "Describe your experience, skills, and what you're proud of. We'll turn it into a structured resume you can edit."
                    : "Décrivez votre expérience, vos compétences et ce dont vous êtes fier. Nous en ferons un CV structuré que vous pourrez modifier."}
                </p>

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
                  className="w-full min-h-[160px] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={
                    lang === "en"
                      ? "Write in English or French. Other languages are not supported."
                      : "Écrivez en français ou en anglais. Les autres langues ne sont pas prises en charge."
                  }
                />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {wordCount} / {maxWords} {lang === "en" ? "words" : "mots"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lang === "en" ? "Max" : "Max"} {maxChars} {lang === "en" ? "characters" : "caractères"}
                  </span>
                </div>

                {error && (
                  <p className="mt-3 text-sm text-red-600">{error}</p>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      isLoading ||
                      !input.trim() ||
                      wordCount > maxWords ||
                      input.length > maxChars
                    }
                    className="px-6 py-3 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? lang === "en"
                        ? "Generating..."
                        : "Génération..."
                      : lang === "en"
                      ? "Generate resume"
                      : "Générer un CV"}
                  </button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {lang === "en" ? "AI-Powered" : "Alimenté par l'IA"}
                </h3>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Smart algorithms transform your experience into professional achievements"
                    : "Des algorithmes intelligents transforment votre expérience en réalisations professionnelles"}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {lang === "en" ? "ATS-Friendly" : "Compatible ATS"}
                </h3>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Optimized format that passes applicant tracking systems"
                    : "Format optimisé qui passe les systèmes de suivi des candidatures"}
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {lang === "en" ? "Fully Editable" : "Entièrement modifiable"}
                </h3>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Customize every detail to match your style and preferences"
                    : "Personnalisez chaque détail pour correspondre à votre style et vos préférences"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
