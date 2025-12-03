"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ResumeDisplay from "@/components/ResumeDisplay";
import MyLifeSection from "@/components/MyLifeSection";

const MAX_WORDS = 80;
const MAX_CHARS = 600;

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

interface DbResume {
  id: string;
  prompt: string | null;
  resume: ResumeData | null;
  created_at: string;
  is_public?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [resumes, setResumes] = useState<DbResume[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"editor" | "generator" | "mylife">("mylife");
  const [input, setInput] = useState("");
  const [genError, setGenError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genLang, setGenLang] = useState<"en" | "fr">("en");
  const [isTogglingPublic, setIsTogglingPublic] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      let localResume: ResumeData | null = null;
      let localPrompt: string | null = null;

      // Load resume + prompt from localStorage if present AND belongs to current user
      try {
        if (typeof window !== "undefined") {
          const storedUserId = window.localStorage.getItem("lastmona_user_id");
          // Only load localStorage data if it belongs to the current user
          if (storedUserId === user.id) {
            const stored = window.localStorage.getItem("lastmona_resume");
            const storedPrompt = window.localStorage.getItem("lastmona_prompt");
            if (stored) {
              localResume = JSON.parse(stored);
            }
            if (storedPrompt) {
              localPrompt = storedPrompt;
            }
          } else {
            // Clear localStorage if it belongs to a different user
            window.localStorage.removeItem("lastmona_resume");
            window.localStorage.removeItem("lastmona_prompt");
            window.localStorage.removeItem("lastmona_user_id");
          }
        }
      } catch {
        // ignore parse errors, but clear potentially corrupted data
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("lastmona_resume");
          window.localStorage.removeItem("lastmona_prompt");
          window.localStorage.removeItem("lastmona_user_id");
        }
      }

      // Fetch existing resumes for this user
      const { data: existing, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      let list: DbResume[] = existing || [];

      // If there is a locally generated resume + prompt, persist it as a new record
      if (!error && localResume && localPrompt) {
        const { data: inserted, error: insertError } = await supabase
          .from("resumes")
          .insert({
            user_id: user.id,
            prompt: localPrompt,
            resume: localResume,
          })
          .select("*")
          .single();

        if (!insertError && inserted) {
          list = [inserted as DbResume, ...list];
        }

        // Clear prompt so we don't re-insert the same resume again
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("lastmona_prompt");
        }
      }

      setResumes(list);

      if (list.length > 0) {
        setSelectedId(list[0].id);
        setResume((list[0].resume as ResumeData) || null);
        if (typeof window !== "undefined" && list[0].resume) {
          // Store with user ID to ensure data isolation
          window.localStorage.setItem("lastmona_resume", JSON.stringify(list[0].resume));
          window.localStorage.setItem("lastmona_user_id", user.id);
        }
      } else if (localResume) {
        // fallback: show local resume if no DB record yet (only if it belongs to current user)
        setResume(localResume);
      } else {
        setResume(null);
      }

      setCheckingAuth(false);
    };

    init();
  }, [router]);

  const handleDownloadPdf = async () => {
    if (typeof window === "undefined") return;
    const element = document.getElementById("resume-pdf");
    if (!element) return;

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Slight horizontal margins so PDF text is not oversized
    const marginX = 24;
    const imgWidth = pageWidth - marginX * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight;
        pdf.addImage(imgData, "PNG", marginX, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("lastmona-resume.pdf");
  };

  const handleTogglePublic = async () => {
    if (!selectedId) return;

    const currentResume = resumes.find((r) => r.id === selectedId);
    if (!currentResume) return;

    const newPublicStatus = !currentResume.is_public;
    setIsTogglingPublic(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/signin");
        return;
      }

      const response = await fetch("/api/toggle-resume-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          resumeId: selectedId,
          isPublic: newPublicStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update resume status");
      }

      // Update local state
      setResumes((prev) =>
        prev.map((r) =>
          r.id === selectedId ? { ...r, is_public: newPublicStatus } : r
        )
      );
    } catch (error) {
      console.error("Error toggling public status:", error);
      alert(
        lang === "en"
          ? "Failed to update resume status. Please try again."
          : "Échec de la mise à jour du statut du CV. Veuillez réessayer."
      );
    } finally {
      setIsTogglingPublic(false);
    }
  };

  const persistCurrentResume = async (updated: ResumeData) => {
    setResume(updated);

    if (typeof window !== "undefined") {
      // Get current user to store with resume data
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (user) {
        window.localStorage.setItem("lastmona_resume", JSON.stringify(updated));
        window.localStorage.setItem("lastmona_user_id", user.id);
      }
    }

    if (!selectedId) return;

    setResumes((prev) =>
      prev.map((r) =>
        r.id === selectedId ? { ...r, resume: updated } : r
      )
    );

    try {
      await supabase
        .from("resumes")
        .update({ resume: updated })
        .eq("id", selectedId);
    } catch {
      // ignore DB errors here
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (
      !confirm(
        lang === "en"
          ? "Are you sure you want to delete this resume? This action cannot be undone."
          : "Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible."
      )
    ) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/signin");
        return;
      }

      const response = await fetch("/api/delete-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ resumeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resume");
      }

      // Remove from local state
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));

      // If deleted resume was selected, clear selection
      if (selectedId === resumeId) {
        setSelectedId(null);
        setResume(null);
        setMode("generator");
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("lastmona_resume");
          window.localStorage.removeItem("lastmona_prompt");
        }
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert(
        lang === "en"
          ? "Failed to delete resume. Please try again."
          : "Échec de la suppression du CV. Veuillez réessayer."
      );
    }
  };

  const handleCreateResume = async () => {
    if (resumes.length >= 20) {
      setGenError(
        lang === "en"
          ? "You've reached the limit of 20 resumes. Please delete one to create a new one."
          : "Vous avez atteint la limite de 20 CV. Veuillez en supprimer un pour en créer un nouveau."
      );
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      setGenError("Please describe your experience before generating a resume.");
      return;
    }

    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length > MAX_WORDS) {
      setGenError(`Please limit your description to ${MAX_WORDS} words.`);
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      setGenError(`Please limit your description to ${MAX_CHARS} characters.`);
      return;
    }

    setIsGenerating(true);
    setGenError(null);

    try {
      // Get user ID (dashboard requires auth, so user should exist)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experience: trimmed, lang: genLang, userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      const generated: ResumeData = data.resume;

      // Re-check user (already have userId from above, but need user object for DB insert)
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        router.replace("/signin");
        return;
      }

      const { data: inserted, error } = await supabase
        .from("resumes")
        .insert({
          user_id: authUser.id,
          prompt: trimmed,
          resume: generated,
        })
        .select("*")
        .single();

      if (error || !inserted) {
        throw error || new Error("Failed to save resume");
      }

      setResumes((prev) => [inserted as DbResume, ...prev]);
      setSelectedId(inserted.id);
      setResume(generated);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("lastmona_resume", JSON.stringify(generated));
        window.localStorage.setItem("lastmona_user_id", authUser.id);
      }

      setMode("editor");
      setInput("");
    } catch (err) {
      setGenError(
        err instanceof Error
          ? err.message
          : "Failed to create resume. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col md:sticky md:top-0 md:h-screen">
        {/* Top: Logo - Fixed */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Lastmona Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg font-semibold text-indigo-600 tracking-tight">
              Lastmona
            </span>
          </Link>
        </div>

        {/* Middle: Dashboard + Resumes - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-2 min-h-0">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
            Main
          </div>
          <button
            type="button"
            onClick={() => setMode("generator")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
              mode === "generator"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("mylife")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
              mode === "mylife"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>My Life</span>
          </button>
          <div className="mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 sm:px-2 mb-2">
              All resumes
            </div>
            <div className="space-y-1">
              {resumes.length === 0 && (
                <p className="text-[11px] text-gray-500 px-2">
                  No resumes yet. Generate one from the homepage.
                </p>
              )}
              {resumes.map((r) => {
                const created = new Date(r.created_at);
                const labelDate = created.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                const name =
                  (r.resume && (r.resume as ResumeData).name) || "Untitled resume";
                const isActive = r.id === selectedId;
                return (
                  <div
                    key={r.id}
                    className={`group flex items-center gap-2 ${
                      isActive ? "bg-indigo-50" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMode("editor");
                        setSelectedId(r.id);
                        setResume((r.resume as ResumeData) || null);
                        if (typeof window !== "undefined" && r.resume) {
                          // Get current user to store with resume data
                          supabase.auth.getUser().then(({ data: { user } }) => {
                            if (user) {
                              window.localStorage.setItem(
                                "lastmona_resume",
                                JSON.stringify(r.resume)
                              );
                              window.localStorage.setItem("lastmona_user_id", user.id);
                            }
                          });
                        }
                      }}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-xs ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="truncate">{name}</div>
                      <div className="text-[10px] text-gray-400">
                        {labelDate}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteResume(r.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 transition-opacity"
                      title={lang === "en" ? "Delete resume" : "Supprimer le CV"}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom: Profile + Log out - Fixed */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2 flex-shrink-0">
          <Link
            href="/profile"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>Settings</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/");
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Right content area */}
      <main className="flex-1 flex flex-col">
        <header className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              {mode === "generator"
                ? "Create a new resume from your experience."
                : "View, edit and export your generated resume."}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {mode === "editor" && resume && selectedId && (
              <>
                {(() => {
                  const currentResume = resumes.find((r) => r.id === selectedId);
                  const isPublic = currentResume?.is_public || false;
                  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/resume/${selectedId}`;

                  return (
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      {/* Toggle Switch */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 hidden sm:inline">
                          {lang === "en" ? "Public" : "Public"}
                        </span>
                        <button
                          type="button"
                          onClick={handleTogglePublic}
                          disabled={isTogglingPublic}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            isPublic ? "bg-indigo-600" : "bg-gray-200"
                          } ${isTogglingPublic ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isPublic ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="text-xs text-gray-600 hidden sm:inline">
                          {lang === "en" ? "Private" : "Privé"}
                        </span>
                      </div>

                      {/* Share Link */}
                      {isPublic && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                          <input
                            type="text"
                            readOnly
                            value={publicUrl}
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            className="text-xs text-gray-700 bg-transparent border-none outline-none w-32 sm:w-48"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(publicUrl);
                              alert(
                                lang === "en"
                                  ? "Link copied to clipboard!"
                                  : "Lien copié dans le presse-papiers !"
                              );
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            title={lang === "en" ? "Copy link" : "Copier le lien"}
                          >
                            {lang === "en" ? "Copy" : "Copier"}
                          </button>
                        </div>
                      )}

                      {/* Download PDF Button */}
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                      >
                        {lang === "en" ? "Download PDF" : "Télécharger PDF"}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </header>

        {mode === "mylife" ? (
          <MyLifeSection lang={lang} />
        ) : mode === "generator" ? (
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6">
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm px-4 sm:px-6 py-5 sm:py-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {genLang === "en" ? "Create a new resume" : "Créer un nouveau CV"}
                </h2>
                <div className="inline-flex items-center rounded-full bg-gray-100 px-1 py-1 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setGenLang("en")}
                    className={`px-2.5 py-0.5 rounded-full ${
                      genLang === "en"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenLang("fr")}
                    className={`px-2.5 py-0.5 rounded-full ${
                      genLang === "fr"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                  >
                    FR
                  </button>
                </div>
              </div>

              {resumes.length >= 20 && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {genLang === "en"
                    ? "You've reached the limit of 20 resumes. Please delete one to create a new one."
                    : "Vous avez atteint la limite de 20 CV. Veuillez en supprimer un pour en créer un nouveau."}
                </div>
              )}

              {resumes.length < 20 && (
                <>
                  <p className="text-xs text-gray-600 mb-2">
                    {genLang === "en"
                      ? "Describe your experience, skills and what you’re proud of. We’ll turn it into a structured resume you can edit."
                      : "Décrivez votre expérience, vos compétences et ce dont vous êtes fier. Nous en ferons un CV structuré que vous pourrez modifier."}
                  </p>
                  <textarea
                    value={input}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (text.length <= MAX_CHARS) {
                        const words = text.trim().split(/\s+/).filter(Boolean);
                        if (words.length <= MAX_WORDS) {
                          setInput(text);
                          setGenError(null);
                        }
                      }
                    }}
                    className="w-full min-h-[160px] border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={
                      genLang === "en"
                        ? "Write in English or French. Other languages are not supported."
                        : "Écrivez en français ou en anglais. Les autres langues ne sont pas prises en charge."
                    }
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      {input.trim().split(/\s+/).filter(Boolean).length} / {MAX_WORDS} words
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Max {MAX_CHARS} characters
                    </span>
                  </div>

                  {genError && (
                    <p className="mt-2 text-xs text-red-600">{genError}</p>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCreateResume}
                      disabled={
                        isGenerating ||
                        !input.trim() ||
                        input.trim().split(/\s+/).filter(Boolean).length >
                          MAX_WORDS ||
                        input.length > MAX_CHARS
                      }
                      className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isGenerating
                        ? genLang === "en"
                          ? "Creating your resume..."
                          : "Création de votre CV..."
                        : genLang === "en"
                        ? "Generate resume"
                        : "Générer un CV"}
                    </button>
                  </div>
                </>
              )}

              {resumes.length >= 20 && (
                <p className="mt-3 text-[11px] text-gray-500">
                  {genLang === "en"
                    ? "You can still open and edit your existing resumes from the list on the left."
                    : "Vous pouvez toujours ouvrir et modifier vos CV existants depuis la liste à gauche."}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
          <section className="border-b lg:border-b-0 lg:border-r border-gray-200 max-h-full overflow-y-auto">
            <div className="px-4 sm:px-6 py-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                Resume data
              </h2>

              {!resume ? (
                <p className="text-sm text-gray-500">
                  No resume found yet. Generate one from the homepage and then
                  sign in to see it here.
                </p>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={resume.name || ""}
                      onChange={(e) => {
                        const updated = { ...resume, name: e.target.value };
                        persistCurrentResume(updated);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={resume.email || ""}
                        onChange={(e) => {
                          const updated = { ...resume, email: e.target.value };
                          persistCurrentResume(updated);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={resume.phone || ""}
                        onChange={(e) => {
                          const updated = { ...resume, phone: e.target.value };
                          persistCurrentResume(updated);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Professional summary
                    </label>
                    <textarea
                      value={resume.summary || ""}
                      onChange={(e) => {
                        const updated = { ...resume, summary: e.target.value };
                        persistCurrentResume(updated);
                      }}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Keep it short and focused on your key strengths.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-gray-800">
                        Work experience
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = resume.experience ?? [];
                          const updated = {
                            ...resume,
                            experience: [...currentList, { title: "", company: "", period: "", description: "" }],
                          };
                          persistCurrentResume(updated);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        + Add experience
                      </button>
                    </div>
                    {(resume.experience && resume.experience.length > 0 ? resume.experience : [{}]).map((exp, expIdx) => {
                      const updateExpField = (field: keyof typeof exp, value: string) => {
                        const currentList = resume.experience && resume.experience.length > 0 
                          ? resume.experience 
                          : [{}];
                        const newList = [...currentList];
                        if (!newList[expIdx]) {
                          newList[expIdx] = {};
                        }
                        newList[expIdx] = { ...newList[expIdx], [field]: value };
                        const updated = { ...resume, experience: newList };
                        persistCurrentResume(updated);
                      };
                      const removeExp = () => {
                        const currentList = resume.experience ?? [];
                        const newList = currentList.filter((_, idx) => idx !== expIdx);
                        const updated = { ...resume, experience: newList.length > 0 ? newList : undefined };
                        persistCurrentResume(updated);
                      };
                      return (
                        <div key={expIdx} className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">
                              Experience #{expIdx + 1}
                            </span>
                            {resume.experience && resume.experience.length > 1 && (
                              <button
                                type="button"
                                onClick={removeExp}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Job title
                                </label>
                                <input
                                  type="text"
                                  value={exp.title || ""}
                                  onChange={(e) => updateExpField("title", e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Company
                                </label>
                                <input
                                  type="text"
                                  value={exp.company || ""}
                                  onChange={(e) => updateExpField("company", e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Period
                              </label>
                              <input
                                type="text"
                                value={exp.period || ""}
                                onChange={(e) => updateExpField("period", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., 2020 - Present"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Responsibilities / achievements
                              </label>
                              <textarea
                                value={exp.description || ""}
                                onChange={(e) =>
                                  updateExpField("description", e.target.value)
                                }
                                rows={5}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <p className="mt-1 text-[11px] text-gray-500">
                                Each line will appear as a separate bullet point in your
                                resume.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-gray-800">
                        Education
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = resume.education ?? [];
                          const updated = {
                            ...resume,
                            education: [...currentList, { degree: "", institution: "", period: "" }],
                          };
                          persistCurrentResume(updated);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        + Add education
                      </button>
                    </div>
                    {(resume.education && resume.education.length > 0 ? resume.education : [{}]).map((edu, eduIdx) => {
                      const updateEduField = (field: keyof typeof edu, value: string) => {
                        const currentList = resume.education && resume.education.length > 0 
                          ? resume.education 
                          : [{}];
                        const newList = [...currentList];
                        if (!newList[eduIdx]) {
                          newList[eduIdx] = {};
                        }
                        newList[eduIdx] = { ...newList[eduIdx], [field]: value };
                        const updated = { ...resume, education: newList };
                        persistCurrentResume(updated);
                      };
                      const removeEdu = () => {
                        const currentList = resume.education ?? [];
                        const newList = currentList.filter((_, idx) => idx !== eduIdx);
                        const updated = { ...resume, education: newList.length > 0 ? newList : undefined };
                        persistCurrentResume(updated);
                      };
                      return (
                        <div key={eduIdx} className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">
                              Education #{eduIdx + 1}
                            </span>
                            {resume.education && resume.education.length > 1 && (
                              <button
                                type="button"
                                onClick={removeEdu}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Degree
                                </label>
                                <input
                                  type="text"
                                  value={edu.degree || ""}
                                  onChange={(e) => updateEduField("degree", e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Institution
                                </label>
                                <input
                                  type="text"
                                  value={edu.institution || ""}
                                  onChange={(e) => updateEduField("institution", e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Period
                              </label>
                              <input
                                type="text"
                                value={edu.period || ""}
                                onChange={(e) => updateEduField("period", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., 2015 - 2019"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-gray-800">
                        Certifications
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = resume.certifications ?? [];
                          const updated = {
                            ...resume,
                            certifications: [...currentList, { name: "", issuer: "", date: "" }],
                          };
                          persistCurrentResume(updated);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        + Add certification
                      </button>
                    </div>
                    {(resume.certifications && resume.certifications.length > 0 ? resume.certifications : [{}]).map((cert, certIdx) => {
                      const updateCertField = (field: keyof typeof cert, value: string) => {
                        const currentList = resume.certifications && resume.certifications.length > 0 
                          ? resume.certifications 
                          : [{}];
                        const newList = [...currentList];
                        if (!newList[certIdx]) {
                          newList[certIdx] = {};
                        }
                        newList[certIdx] = { ...newList[certIdx], [field]: value };
                        const updated = { ...resume, certifications: newList };
                        persistCurrentResume(updated);
                      };
                      const removeCert = () => {
                        const currentList = resume.certifications ?? [];
                        const newList = currentList.filter((_, idx) => idx !== certIdx);
                        const updated = { ...resume, certifications: newList.length > 0 ? newList : undefined };
                        persistCurrentResume(updated);
                      };
                      return (
                        <div key={certIdx} className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">
                              Certification #{certIdx + 1}
                            </span>
                            {resume.certifications && resume.certifications.length > 1 && (
                              <button
                                type="button"
                                onClick={removeCert}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Certification name
                                </label>
                                <input
                                  type="text"
                                  value={cert.name || ""}
                                  onChange={(e) => updateCertField("name", e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Issuer
                                </label>
                                <input
                                  type="text"
                                  value={cert.issuer || ""}
                                  onChange={(e) => updateCertField("issuer", e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="text"
                                value={cert.date || ""}
                                onChange={(e) => updateCertField("date", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., 2021"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-800 mb-2">
                      Skills
                    </h3>
                    <textarea
                      value={(resume.skills || []).join(", ")}
                      onChange={(e) => {
                        const skillsArray = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        const updated = { ...resume, skills: skillsArray };
                        persistCurrentResume(updated);
                      }}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Separate skills with commas (e.g. React, TypeScript, SQL).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="max-h-full overflow-y-auto bg-gray-100">
            <div className="h-full px-4 sm:px-6 py-5 sm:py-6">
              <div
                id="resume-pdf"
                className="h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <ResumeDisplay
                  resumeData={resume}
                  isLoading={false}
                  mode="full"
                />
              </div>
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
}


