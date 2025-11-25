"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ResumeDisplay from "@/components/ResumeDisplay";

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

export default function DashboardPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      // Load resume from localStorage if present
      try {
        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem("lastmona_resume");
          if (stored) {
            const parsed = JSON.parse(stored);
            setResume(parsed);
          }
        }
      } catch {
        // ignore parse errors
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

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = heightLeft - imgHeight;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("lastmona-resume.pdf");
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
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
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
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
            Main
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium"
          >
            <span>Dashboard</span>
          </button>
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
              View, edit and export your generated resume.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
            >
              Download / print PDF
            </button>
          </div>
        </header>

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
                        setResume(updated);
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem(
                            "lastmona_resume",
                            JSON.stringify(updated)
                          );
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                          setResume(updated);
                          if (typeof window !== "undefined") {
                            window.localStorage.setItem(
                              "lastmona_resume",
                              JSON.stringify(updated)
                            );
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                          setResume(updated);
                          if (typeof window !== "undefined") {
                            window.localStorage.setItem(
                              "lastmona_resume",
                              JSON.stringify(updated)
                            );
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        setResume(updated);
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem(
                            "lastmona_resume",
                            JSON.stringify(updated)
                          );
                        }
                      }}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        setResume(updated);
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem(
                            "lastmona_resume",
                            JSON.stringify(updated)
                          );
                        }
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
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        setResume(updated);
                        if (typeof window !== "undefined") {
                          window.localStorage.setItem(
                            "lastmona_resume",
                            JSON.stringify(updated)
                          );
                        }
                      }}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
      </main>
    </div>
  );
}


