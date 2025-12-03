"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Experience {
  id: string;
  title?: string;
  company?: string;
  period?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({
    title: "",
    company: "",
    period: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/signin");
        return;
      }

      setEmail(user.email || null);
      setCheckingAuth(false);
      await loadExperiences();
    };

    init();
  }, [router]);

  const loadExperiences = async () => {
    try {
      setLoadingExperiences(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      const response = await fetch("/api/experiences", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExperiences(data.experiences || []);
      }
    } catch (error) {
      console.error("Error loading experiences:", error);
    } finally {
      setLoadingExperiences(false);
    }
  };

  const handleSaveExperience = async (exp: Partial<Experience>) => {
    try {
      setSaving(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      if (editingId) {
        // Update existing
        const response = await fetch(`/api/experiences/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(exp),
        });

        if (response.ok) {
          await loadExperiences();
          setEditingId(null);
        } else {
          alert(
            lang === "en"
              ? "Failed to update experience"
              : "Échec de la mise à jour de l'expérience"
          );
        }
      } else {
        // Create new
        const response = await fetch("/api/experiences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ experience: exp }),
        });

        if (response.ok) {
          await loadExperiences();
          setNewExperience({ title: "", company: "", period: "", description: "" });
          setShowAddForm(false);
        } else {
          alert(
            lang === "en"
              ? "Failed to create experience"
              : "Échec de la création de l'expérience"
          );
        }
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      alert(
        lang === "en"
          ? "Failed to save experience"
          : "Échec de l'enregistrement de l'expérience"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (
      !confirm(
        lang === "en"
          ? "Are you sure you want to delete this experience?"
          : "Êtes-vous sûr de vouloir supprimer cette expérience ?"
      )
    ) {
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return;
      }

      const response = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        await loadExperiences();
      } else {
        alert(
          lang === "en"
            ? "Failed to delete experience"
            : "Échec de la suppression de l'expérience"
        );
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert(
        lang === "en"
          ? "Failed to delete experience"
          : "Échec de la suppression de l'expérience"
      );
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/signin");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No session token available");
      }

      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete account");
      }

      await supabase.auth.signOut();
      router.replace("/");
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(
        lang === "en"
          ? "Failed to delete account. Please try again or contact us."
          : "Échec de la suppression du compte. Veuillez réessayer ou nous contacter."
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left sidebar - same as dashboard */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col md:sticky md:top-0 md:h-screen">
        {/* Top: Logo - Fixed */}
        <div className="px-4 sm:px-6 py-5 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
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

        {/* Middle: Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 min-h-0">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-1">
            Main
          </div>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* Bottom: Profile + Log out - Fixed */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2 flex-shrink-0">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium"
          >
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/");
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>{lang === "en" ? "Log out" : "Déconnexion"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                  {lang === "en" ? "Profile" : "Profil"}
                </h1>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Manage your account settings and all your experiences in one place."
                    : "Gérez les paramètres de votre compte et toutes vos expériences en un seul endroit."}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-gray-100 px-1 py-1 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setLang("en")}
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
                  onClick={() => setLang("fr")}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    lang === "fr"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  FR
                </button>
              </div>
            </div>

            {/* Email Section */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {lang === "en" ? "Email address" : "Adresse e-mail"}
              </label>
              <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                {email || "-"}
              </div>
            </div>

            {/* Experiences Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {lang === "en" ? "All Your Experiences" : "Toutes vos expériences"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {lang === "en"
                      ? "All experiences extracted from your resume inputs are stored here. You can add, edit, or delete them."
                      : "Toutes les expériences extraites de vos entrées de CV sont stockées ici. Vous pouvez les ajouter, les modifier ou les supprimer."}
                  </p>
                </div>
                {!showAddForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                  >
                    {lang === "en" ? "+ Add Experience" : "+ Ajouter une expérience"}
                  </button>
                )}
              </div>

              {/* Add Experience Form */}
              {showAddForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {lang === "en" ? "Add New Experience" : "Ajouter une nouvelle expérience"}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {lang === "en" ? "Job Title" : "Poste"}
                        </label>
                        <input
                          type="text"
                          value={newExperience.title || ""}
                          onChange={(e) =>
                            setNewExperience({ ...newExperience, title: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          {lang === "en" ? "Company" : "Entreprise"}
                        </label>
                        <input
                          type="text"
                          value={newExperience.company || ""}
                          onChange={(e) =>
                            setNewExperience({ ...newExperience, company: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {lang === "en" ? "Period" : "Période"}
                      </label>
                      <input
                        type="text"
                        value={newExperience.period || ""}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, period: e.target.value })
                        }
                        placeholder={lang === "en" ? "e.g., 2020 - Present" : "ex: 2020 - Aujourd'hui"}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {lang === "en" ? "Description" : "Description"}
                      </label>
                      <textarea
                        value={newExperience.description || ""}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, description: e.target.value })
                        }
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSaveExperience(newExperience)}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {saving
                          ? lang === "en"
                            ? "Saving..."
                            : "Enregistrement..."
                          : lang === "en"
                          ? "Save"
                          : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setNewExperience({ title: "", company: "", period: "", description: "" });
                        }}
                        className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {lang === "en" ? "Cancel" : "Annuler"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Experiences List */}
              {loadingExperiences ? (
                <p className="text-sm text-gray-500">
                  {lang === "en" ? "Loading experiences..." : "Chargement des expériences..."}
                </p>
              ) : experiences.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    {lang === "en"
                      ? "No experiences yet. They will be automatically added when you generate resumes, or you can add them manually above."
                      : "Aucune expérience pour le moment. Elles seront automatiquement ajoutées lorsque vous générerez des CV, ou vous pouvez les ajouter manuellement ci-dessus."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow"
                    >
                      {editingId === exp.id ? (
                        <ExperienceEditForm
                          experience={exp}
                          onSave={(updated) => {
                            handleSaveExperience(updated);
                          }}
                          onCancel={() => setEditingId(null)}
                          lang={lang}
                          saving={saving}
                        />
                      ) : (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-gray-900">
                                {exp.title || (lang === "en" ? "Untitled" : "Sans titre")}
                              </h3>
                              {exp.company && (
                                <p className="text-sm text-gray-600 mt-1">{exp.company}</p>
                              )}
                              {exp.period && (
                                <p className="text-xs text-gray-500 mt-1">{exp.period}</p>
                              )}
                              {exp.description && (
                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                type="button"
                                onClick={() => setEditingId(exp.id)}
                                className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              >
                                {lang === "en" ? "Edit" : "Modifier"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExperience(exp.id)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                {lang === "en" ? "Delete" : "Supprimer"}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delete Account Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {lang === "en" ? "Delete account" : "Supprimer le compte"}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {lang === "en"
                  ? "Once you delete your account, your email will be removed and your resumes will be anonymized. Data linked to this account will be permanently deleted after 1 week. If you have any questions, please contact us at builtpublic@gmail.com."
                  : "Une fois votre compte supprimé, votre e-mail sera retiré et vos CV seront anonymisés. Les données liées à ce compte seront définitivement supprimées après 1 semaine. Si vous avez des questions, contactez-nous à builtpublic@gmail.com."}
              </p>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 transition-colors"
                >
                  {lang === "en" ? "Delete account" : "Supprimer le compte"}
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">
                    {lang === "en"
                      ? "Are you sure you want to delete your account? This action cannot be undone."
                      : "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-semibold rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeleting
                        ? lang === "en"
                          ? "Deleting..."
                          : "Suppression..."
                        : lang === "en"
                        ? "Yes, delete my account"
                        : "Oui, supprimer mon compte"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {lang === "en" ? "Cancel" : "Annuler"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Experience Edit Form Component
function ExperienceEditForm({
  experience,
  onSave,
  onCancel,
  lang,
  saving,
}: {
  experience: Experience;
  onSave: (exp: Partial<Experience>) => void;
  onCancel: () => void;
  lang: "en" | "fr";
  saving: boolean;
}) {
  const [edited, setEdited] = useState<Partial<Experience>>({
    title: experience.title || "",
    company: experience.company || "",
    period: experience.period || "",
    description: experience.description || "",
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Job Title" : "Poste"}
          </label>
          <input
            type="text"
            value={edited.title || ""}
            onChange={(e) => setEdited({ ...edited, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {lang === "en" ? "Company" : "Entreprise"}
          </label>
          <input
            type="text"
            value={edited.company || ""}
            onChange={(e) => setEdited({ ...edited, company: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Period" : "Période"}
        </label>
        <input
          type="text"
          value={edited.period || ""}
          onChange={(e) => setEdited({ ...edited, period: e.target.value })}
          placeholder={lang === "en" ? "e.g., 2020 - Present" : "ex: 2020 - Aujourd'hui"}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {lang === "en" ? "Description" : "Description"}
        </label>
        <textarea
          value={edited.description || ""}
          onChange={(e) => setEdited({ ...edited, description: e.target.value })}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(edited)}
          disabled={saving}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving
            ? lang === "en"
              ? "Saving..."
              : "Enregistrement..."
            : lang === "en"
            ? "Save"
            : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {lang === "en" ? "Cancel" : "Annuler"}
        </button>
      </div>
    </div>
  );
}
