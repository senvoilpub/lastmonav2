"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ResumeDisplay from "@/components/ResumeDisplay";
import Image from "next/image";
import Link from "next/link";

interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    period?: string;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    period?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;
  skills?: string[];
}

export default function PublicResumePage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params?.id as string;
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        setError("Resume ID is required");
        setLoading(false);
        return;
      }

      try {
        // Fetch public resume (no auth required)
        const { data, error: fetchError } = await supabase
          .from("resumes")
          .select("resume, is_public")
          .eq("id", resumeId)
          .eq("is_public", true)
          .single();

        if (fetchError || !data) {
          setError(
            lang === "en"
              ? "Resume not found or not publicly available"
              : "CV introuvable ou non disponible publiquement"
          );
          setLoading(false);
          return;
        }

        if (!data.is_public) {
          setError(
            lang === "en"
              ? "This resume is not publicly available"
              : "Ce CV n'est pas disponible publiquement"
          );
          setLoading(false);
          return;
        }

        setResume((data.resume as ResumeData) || null);
      } catch (err) {
        setError(
          lang === "en"
            ? "Failed to load resume"
            : "Échec du chargement du CV"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            {lang === "en" ? "Loading resume..." : "Chargement du CV..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {lang === "en" ? "Resume not found" : "CV introuvable"}
          </h1>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            {lang === "en" ? "Go to homepage" : "Aller à l'accueil"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Lastmona Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-lg font-bold text-indigo-600 tracking-tight">
              Lastmona
            </span>
          </Link>
          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                lang === "en"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                lang === "fr"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              FR
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 md:p-10">
          <ResumeDisplay resume={resume} mode="full" />
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {lang === "en"
              ? "Created with Lastmona"
              : "Créé avec Lastmona"}{" "}
            •{" "}
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              {lang === "en" ? "Create your own" : "Créez le vôtre"}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

