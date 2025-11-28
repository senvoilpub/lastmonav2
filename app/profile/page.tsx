"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

      setEmail(user.email || null);
      setCheckingAuth(false);
    };

    init();
  }, [router]);

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

      // Get the session token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("No session token available");
      }

      // Call API to handle account deletion and resume migration
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

      // Sign out the user
      await supabase.auth.signOut();

      // Redirect to landing page
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
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col h-screen md:h-screen">
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
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
                  {lang === "en" ? "Profile" : "Profil"}
                </h1>
                <p className="text-sm text-gray-600">
                  {lang === "en"
                    ? "Manage your account settings and information."
                    : "Gérez les paramètres et les informations de votre compte."}
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

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {lang === "en" ? "Email address" : "Adresse e-mail"}
                </label>
                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {email || "-"}
                </div>
              </div>
            </div>

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

