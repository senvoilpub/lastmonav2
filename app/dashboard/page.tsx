"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ResumeDisplay from "@/components/ResumeDisplay";

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
}

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [resumes, setResumes] = useState<DbResume[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"editor" | "generator">("editor");
  const [input, setInput] = useState("");
  const [genError, setGenError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genLang, setGenLang] = useState<"en" | "fr">("en");

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

      // Load resume + prompt from localStorage if present
      try {
        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem("lastmona_resume");
          const storedPrompt = window.localStorage.getItem("lastmona_prompt");
          if (stored) {
            localResume = JSON.parse(stored);
          }
          if (storedPrompt) {
            localPrompt = storedPrompt;
          }
        }
      } catch {
        // ignore parse errors
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
          window.localStorage.setItem(
            "lastmona_resume",
            JSON.stringify(list[0].resume)
          );
        }
      } else if (localResume) {
        // fallback: show local resume if no DB record yet
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

  const persistCurrentResume = async (updated: ResumeData) => {
    setResume(updated);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("lastmona_resume", JSON.stringify(updated));
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

  const handleCreateResume = async () => {
    if (resumes.length >= 3) {
      setGenError(
        "You’ve reached the limit of resumes you can create for now. We’re working hard to let you create more soon."
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
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ experience: trimmed, lang: genLang }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate resume");
      }

      const generated: ResumeData = data.resume;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      const { data: inserted, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
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

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
            Main
          </div>
          <button
            type="button"
            onClick={() => setMode("generator")}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium"
          >
            <span>Dashboard</span>
          </button>
          <div className="mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-2">
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
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setMode("editor");
                      setSelectedId(r.id);
                      setResume((r.resume as ResumeData) || null);
                      if (typeof window !== "undefined" && r.resume) {
                        window.localStorage.setItem(
                          "lastmona_resume",
                          JSON.stringify(r.resume)
                        );
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
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
                );
              })}
            </div>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>Profile</span>
          </button>
        </div>
      </aside>

      {/* Right content area */}
      <main className="flex-1 flex flex-col">
        <header className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
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
          <div className="flex items-center gap-3">
            {mode === "editor" && resume && (
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
              >
                Download PDF
              </button>
            )}
          </div>
        </header>

        {mode === "generator" ? (
          <div className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-6">
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

              {resumes.length >= 3 && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  {genLang === "en"
                    ? "You’ve reached the limit of resumes you can create for now. We’re working hard to let you create more CVs soon."
                    : "Vous avez atteint pour l’instant la limite de CV que vous pouvez créer. Nous travaillons pour vous permettre d’en créer davantage bientôt."}
                </div>
              )}

              {resumes.length < 3 && (
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

              {resumes.length >= 3 && (
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
          <section className="border-r border-gray-200 max-h-full overflow-y-auto">
            <div className="px-6 py-5">
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
                    <h3 className="text-xs font-semibold text-gray-800 mb-2">
                      Main experience
                    </h3>
                    {(() => {
                      const exp = (resume.experience && resume.experience[0]) || {};
                      const updateExpField = (field: keyof typeof exp, value: string) => {
                        const currentList = resume.experience ?? [{}];
                        const newList = [...currentList];
                        newList[0] = { ...newList[0], [field]: value };
                        const updated = { ...resume, experience: newList };
                        persistCurrentResume(updated);
                      };
                      return (
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Period
                              </label>
                              <input
                                type="text"
                                value={exp.period || ""}
                                onChange={(e) => updateExpField("period", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
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
                      );
                    })()}
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
            <div className="h-full p-6">
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


