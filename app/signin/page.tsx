"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Lang = "en" | "fr";
type AuthMethod = "magic" | "password";

export default function SignInPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };

    checkUser();
  }, [router]);

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError(lang === "en" ? "Please enter your email." : "Veuillez entrer votre email.");
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/dashboard`
              : undefined,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setMessage(
        lang === "en"
          ? "Check your inbox for a secure sign-in link. You can close this window."
          : "Vérifiez votre boîte de réception pour un lien de connexion sécurisé. Vous pouvez fermer cette fenêtre."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "en"
          ? "Something went wrong. Please try again."
          : "Une erreur s'est produite. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError(lang === "en" ? "Please enter your email." : "Veuillez entrer votre email.");
      return;
    }

    if (!password.trim()) {
      setError(
        lang === "en"
          ? "Please enter your password."
          : "Veuillez entrer votre mot de passe."
      );
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      // Successfully signed in, redirect
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "en"
          ? "Something went wrong. Please try again."
          : "Une erreur s'est produite. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">
          {lang === "en" ? "Checking your session..." : "Vérification de votre session..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 px-8 py-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lang === "en" ? "Welcome back" : "Bon retour"}
              </h1>
              <p className="text-sm text-gray-600">
                {lang === "en"
                  ? "Sign in to your account to continue"
                  : "Connectez-vous à votre compte pour continuer"}
              </p>
            </div>

            {/* Magic Link Option - Primary */}
            {authMethod === "magic" && (
              <div className="mb-6">
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email-magic"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {lang === "en" ? "Email address" : "Adresse email"}
                    </label>
                    <input
                      id="email-magic"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  {message && (
                    <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading
                      ? lang === "en"
                        ? "Sending link..."
                        : "Envoi du lien..."
                      : lang === "en"
                      ? "Continue with email"
                      : "Continuer avec l'email"}
                  </button>

                  <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>
                      {lang === "en"
                        ? "A link will be sent to your email (recommended for security)"
                        : "Un lien sera envoyé à votre email (recommandé pour la sécurité)"}
                    </span>
                  </p>
                </form>
              </div>
            )}

            {/* Divider */}
            {authMethod === "magic" && (
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    {lang === "en" ? "Or" : "Ou"}
                  </span>
                </div>
              </div>
            )}

            {/* Password Option - Secondary */}
            <div>
              {authMethod === "magic" ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("password");
                    setError(null);
                    setMessage(null);
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                >
                  {lang === "en" ? "Sign in with password" : "Se connecter avec un mot de passe"}
                </button>
              ) : (
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email-password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {lang === "en" ? "Email address" : "Adresse email"}
                    </label>
                    <input
                      id="email-password"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {lang === "en" ? "Password" : "Mot de passe"}
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder={
                        lang === "en" ? "Enter your password" : "Entrez votre mot de passe"
                      }
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading
                        ? lang === "en"
                          ? "Signing in..."
                          : "Connexion en cours..."
                        : lang === "en"
                        ? "Sign in"
                        : "Se connecter"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod("magic");
                        setError(null);
                        setMessage(null);
                        setPassword("");
                      }}
                      className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      {lang === "en" ? "Back" : "Retour"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                {lang === "en" ? "Don't have an account?" : "Vous n'avez pas de compte ?"}{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  {lang === "en" ? "Sign up" : "S'inscrire"}
                </Link>
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
            {lang === "en" ? "By continuing, you agree to our" : "En continuant, vous acceptez nos"}{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-indigo-600"
            >
              {lang === "en" ? "Terms of Service" : "Conditions d'utilisation"}
            </Link>{" "}
            {lang === "en" ? "and" : "et"}{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-indigo-600"
            >
              {lang === "en" ? "Privacy Policy" : "Politique de confidentialité"}
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
