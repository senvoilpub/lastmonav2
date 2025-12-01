"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Lang = "en" | "fr";

export default function SignInPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showEmailForm, setShowEmailForm] = useState(false);

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
        setLoading(false);
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: typeof window !== "undefined"
            ? `${window.location.origin}/dashboard`
            : undefined,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // If successful, user will be redirected to Google OAuth, then back to dashboard
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : lang === "en"
          ? "Something went wrong. Please try again."
          : "Une erreur s'est produite. Veuillez réessayer."
      );
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

            {/* Google Sign In Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>
                  {lang === "en"
                    ? "Sign in with Google"
                    : "Se connecter avec Google"}
                </span>
              </button>
            </div>

            {/* Sign in with Email Button */}
            <div className="mb-6">
              {!showEmailForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm(true);
                    setError(null);
                    setMessage(null);
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {lang === "en"
                      ? "Sign in with email"
                      : "Se connecter avec l'email"}
                  </span>
                </button>
              ) : (
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

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading
                        ? lang === "en"
                          ? "Sending link..."
                          : "Envoi du lien..."
                        : lang === "en"
                        ? "Send sign-in link"
                        : "Envoyer le lien de connexion"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailForm(false);
                        setError(null);
                        setMessage(null);
                        setEmail("");
                      }}
                      className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      {lang === "en" ? "Cancel" : "Annuler"}
                    </button>
                  </div>

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
                        ? "A link will be sent to your email"
                        : "Un lien sera envoyé à votre email"}
                    </span>
                  </p>
                </form>
              )}
            </div>

            {/* Divider */}
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

            {/* Sign in with Email & Password */}
            <div>
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
                      ? "Signing in..."
                      : "Connexion en cours..."
                    : lang === "en"
                    ? "Sign in"
                    : "Se connecter"}
                </button>
              </form>
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
