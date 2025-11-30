"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Lang = "en" | "fr";
type AuthMode = "signin" | "signup";
type AuthMethod = "magic" | "password";

export default function SignInPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError(lang === "en" ? "Please enter your email." : "Veuillez entrer votre email.");
      return;
    }

    if (authMethod === "password" && !password.trim()) {
      setError(
        lang === "en"
          ? "Please enter your password."
          : "Veuillez entrer votre mot de passe."
      );
      return;
    }

    if (authMethod === "password" && password.length < 6) {
      setError(
        lang === "en"
          ? "Password must be at least 6 characters."
          : "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    setLoading(true);
    try {
      if (authMethod === "magic") {
        // Magic link flow
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
      } else {
        // Password flow
        if (authMode === "signup") {
          // Sign up with password
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              emailRedirectTo:
                typeof window !== "undefined"
                  ? `${window.location.origin}/dashboard`
                  : undefined,
            },
          });

          if (signUpError) {
            setError(signUpError.message);
            return;
          }

          // Check if email confirmation is required
          if (data.user && !data.session) {
            setMessage(
              lang === "en"
                ? "Please check your email to confirm your account before signing in."
                : "Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter."
            );
          } else if (data.session) {
            // Auto-signed in, redirect
            router.replace("/dashboard");
          }
        } else {
          // Sign in with password
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
        }
      }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {authMode === "signin"
                ? lang === "en"
                  ? "Sign in to Lastmona"
                  : "Se connecter à Lastmona"
                : lang === "en"
                ? "Sign up for Lastmona"
                : "S'inscrire sur Lastmona"}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {authMethod === "magic"
                ? lang === "en"
                  ? "Enter your email to receive a secure sign-in link."
                  : "Entrez votre email pour recevoir un lien de connexion sécurisé."
                : lang === "en"
                ? "Enter your email and password to continue."
                : "Entrez votre email et mot de passe pour continuer."}
            </p>
          </div>

          {/* Mode Toggle: Sign in / Sign up */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  authMode === "signin"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {lang === "en" ? "Sign in" : "Se connecter"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  authMode === "signup"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {lang === "en" ? "Sign up" : "S'inscrire"}
              </button>
            </div>
          </div>

          {/* Auth Method Toggle: Magic link / Password */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("magic");
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  authMethod === "magic"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {lang === "en" ? "Magic link" : "Lien magique"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("password");
                  setError(null);
                  setMessage(null);
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  authMethod === "password"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {lang === "en" ? "Password" : "Mot de passe"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {lang === "en" ? "Email address" : "Adresse email"}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            {authMethod === "password" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {lang === "en" ? "Password" : "Mot de passe"}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={
                    lang === "en" ? "Enter your password" : "Entrez votre mot de passe"
                  }
                  autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                  required
                />
                {authMode === "signup" && (
                  <p className="mt-1 text-xs text-gray-500">
                    {lang === "en"
                      ? "At least 6 characters"
                      : "Au moins 6 caractères"}
                  </p>
                )}
              </div>
            )}

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
              className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {(() => {
                if (loading) {
                  if (authMethod === "magic") {
                    return lang === "en"
                      ? "Sending sign-in link..."
                      : "Envoi du lien de connexion...";
                  } else if (authMode === "signup") {
                    return lang === "en"
                      ? "Creating account..."
                      : "Création du compte...";
                  } else {
                    return lang === "en"
                      ? "Signing in..."
                      : "Connexion en cours...";
                  }
                } else {
                  if (authMethod === "magic") {
                    return lang === "en"
                      ? "Send sign-in link"
                      : "Envoyer le lien de connexion";
                  } else if (authMode === "signup") {
                    return lang === "en" ? "Sign up" : "S'inscrire";
                  } else {
                    return lang === "en" ? "Sign in" : "Se connecter";
                  }
                }
              })()}
            </button>
          </form>

          <p className="mt-6 text-[11px] text-gray-500 text-center leading-relaxed">
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


