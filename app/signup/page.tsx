"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Lang = "en" | "fr";
type AuthMethod = "magic" | "password";

export default function SignUpPage() {
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
      const { error: signUpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
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

      setMessage(
        lang === "en"
          ? "Check your inbox for a secure sign-up link. You can close this window."
          : "Vérifiez votre boîte de réception pour un lien d'inscription sécurisé. Vous pouvez fermer cette fenêtre."
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

  const handlePasswordSignUp = async (e: FormEvent) => {
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

    if (password.length < 6) {
      setError(
        lang === "en"
          ? "Password must be at least 6 characters."
          : "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }

    setLoading(true);
    try {
      // First, check if the account already exists by attempting to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      // If sign-in succeeds, the account already exists
      if (signInData.user && signInData.session) {
        setError(
          lang === "en"
            ? "An account with this email already exists. Please sign in instead."
            : "Un compte avec cet email existe déjà. Veuillez vous connecter à la place."
        );
        setLoading(false);
        return;
      }

      // If sign-in fails with "Invalid login credentials", it could mean:
      // 1. Account doesn't exist (proceed with signup)
      // 2. Wrong password (but account exists - we should still show error)
      // 3. Account exists but email not confirmed (we should still show error)
      
      if (signInError) {
        const errorMessage = signInError.message.toLowerCase();
        // If it's not "invalid credentials", the account might exist with issues
        if (
          !errorMessage.includes("invalid login") &&
          !errorMessage.includes("invalid credentials") &&
          !errorMessage.includes("email not confirmed")
        ) {
          // Account might exist but has other issues
          setError(
            lang === "en"
              ? "An account with this email may already exist. Please try signing in instead."
              : "Un compte avec cet email pourrait déjà exister. Veuillez essayer de vous connecter à la place."
          );
          setLoading(false);
          return;
        }
        
        // If it's "email not confirmed", account exists
        if (errorMessage.includes("email not confirmed")) {
          setError(
            lang === "en"
              ? "An account with this email already exists. Please check your email to confirm your account, then sign in."
              : "Un compte avec cet email existe déjà. Veuillez vérifier votre email pour confirmer votre compte, puis connectez-vous."
          );
          setLoading(false);
          return;
        }
      }

      // Now attempt to sign up (account likely doesn't exist)
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
        // Check if the error indicates user already exists
        const errorMessage = signUpError.message.toLowerCase();
        const errorCode = signUpError.status || signUpError.code;
        
        if (
          errorMessage.includes("already registered") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("user already") ||
          errorMessage.includes("email already") ||
          errorMessage.includes("user with this email") ||
          errorCode === 422 || // Unprocessable Entity - often used for existing users
          errorCode === 400 // Bad Request - sometimes used for existing users
        ) {
          setError(
            lang === "en"
              ? "An account with this email already exists. Please sign in instead."
              : "Un compte avec cet email existe déjà. Veuillez vous connecter à la place."
          );
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Check if user was created
      if (!data.user) {
        setError(
          lang === "en"
            ? "Failed to create account. Please try again."
            : "Échec de la création du compte. Veuillez réessayer."
        );
        return;
      }

      // Check if email confirmation is required
      if (data.session) {
        // Auto-signed in (email confirmation disabled), redirect immediately
        router.replace("/dashboard");
      } else {
        // Email confirmation required - new account created
        setMessage(
          lang === "en"
            ? "Account created! Please check your email (including spam folder) to confirm your account. After confirmation, you can sign in with your password."
            : "Compte créé ! Veuillez vérifier votre email (y compris le dossier spam) pour confirmer votre compte. Après confirmation, vous pourrez vous connecter avec votre mot de passe."
        );
        // Clear password field for security
        setPassword("");
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
                {lang === "en" ? "Create your account" : "Créez votre compte"}
              </h1>
              <p className="text-sm text-gray-600">
                {lang === "en"
                  ? "Sign up to get started with Lastmona"
                  : "Inscrivez-vous pour commencer avec Lastmona"}
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
                  {lang === "en" ? "Sign up with password" : "S'inscrire avec un mot de passe"}
                </button>
              ) : (
                <form onSubmit={handlePasswordSignUp} className="space-y-4">
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
                        lang === "en" ? "Create a password" : "Créez un mot de passe"
                      }
                      autoComplete="new-password"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {lang === "en"
                        ? "At least 6 characters"
                        : "Au moins 6 caractères"}
                    </p>
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

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading
                        ? lang === "en"
                          ? "Creating account..."
                          : "Création du compte..."
                        : lang === "en"
                        ? "Sign up"
                        : "S'inscrire"}
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

            {/* Sign In Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-center text-gray-600">
                {lang === "en" ? "Already have an account?" : "Vous avez déjà un compte ?"}{" "}
                <Link
                  href="/signin"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  {lang === "en" ? "Sign in" : "Se connecter"}
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

