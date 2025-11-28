"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SecurityPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-24 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {lang === "en" ? "Security" : "Sécurité"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {lang === "en" ? "Security Policy" : "Politique de sécurité"}
            </h1>
            <p className="text-sm text-gray-500">
              {lang === "en"
                ? "Last updated: November 26, 2025"
                : "Dernière mise à jour : 26 novembre 2025"}
            </p>
          </header>

          {/* Contact for security issues */}
          <section className="space-y-4 text-sm leading-relaxed text-gray-700">
            <p>
              {lang === "en" ? (
                <>
                  If you discover a potential security vulnerability or have concerns about how we
                  protect your data, please contact us as soon as possible using the contact
                  details on our website. We take security reports seriously and will review them
                  promptly.
                </>
              ) : (
                <>
                  Si vous découvrez une vulnérabilité potentielle ou avez des questions sur la
                  protection de vos données, veuillez nous contacter dès que possible via les
                  coordonnées indiquées sur notre site. Nous prenons les signalements de sécurité
                  très au sérieux et les examinons rapidement.
                </>
              )}
            </p>
          </section>

          {/* How we secure your data */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "How we secure your data"
                : "Comment nous sécurisons vos données"}
            </h2>

            {/* Encryption */}
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en" ? "Data encryption" : "Chiffrement des données"}
              </h3>
              <p>
                {lang === "en" ? (
                  <>
                    We use HTTPS to encrypt data in transit between your browser and our services.
                    For sensitive information, we apply additional protections when it is stored.
                  </>
                ) : (
                  <>
                    Nous utilisons HTTPS pour chiffrer les données en transit entre votre
                    navigateur et nos services. Pour les informations sensibles, nous appliquons
                    des protections supplémentaires lors de leur stockage.
                  </>
                )}
              </p>
            </div>

            {/* Access controls */}
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en" ? "Access controls" : "Contrôles d’accès"}
              </h3>
              <p>
                {lang === "en" ? (
                  <>
                    We limit access to your data to people and systems that need it in order to
                    run Lastmona. Access is restricted based on roles and is regularly reviewed.
                  </>
                ) : (
                  <>
                    Nous limitons l’accès à vos données aux personnes et systèmes qui en ont
                    besoin pour faire fonctionner Lastmona. Les accès sont définis selon des rôles
                    et sont régulièrement revus.
                  </>
                )}
              </p>
            </div>

            {/* Monitoring and reviews */}
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en"
                  ? "Monitoring and security reviews"
                  : "Surveillance et revues de sécurité"}
              </h3>
              <p>
                {lang === "en" ? (
                  <>
                    We monitor our systems and periodically review our infrastructure and code to
                    identify and address potential security issues.
                  </>
                ) : (
                  <>
                    Nous surveillons nos systèmes et réalisons régulièrement des revues de notre
                    infrastructure et de notre code afin d’identifier et de corriger d’éventuels
                    problèmes de sécurité.
                  </>
                )}
              </p>
            </div>

            {/* Dependency management */}
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en"
                  ? "Dependency and platform updates"
                  : "Mises à jour des dépendances et de la plateforme"}
              </h3>
              <p>
                {lang === "en" ? (
                  <>
                    We keep our software dependencies and platform components reasonably up to
                    date to benefit from the latest security patches and improvements.
                  </>
                ) : (
                  <>
                    Nous maintenons nos dépendances logicielles et composants de plateforme
                    raisonnablement à jour afin de bénéficier des dernières corrections de
                    sécurité et améliorations.
                  </>
                )}
              </p>
            </div>

            {/* Data deletion */}
            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en"
                  ? "Data deletion rights"
                  : "Droit à la suppression des données"}
              </h3>
              <p>
                {lang === "en" ? (
                  <>
                    You can request deletion of your account and associated data. Subject to legal
                    requirements, we will delete or anonymize your personal information within a
                    reasonable time.
                  </>
                ) : (
                  <>
                    Vous pouvez demander la suppression de votre compte et des données associées.
                    Sous réserve des obligations légales, nous supprimerons ou anonymiserons vos
                    informations personnelles dans un délai raisonnable.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* Our commitment */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "Our commitment"
                : "Notre engagement"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en" ? (
                <>
                  Security is an ongoing effort. We regularly review and adjust our practices as
                  Lastmona evolves and as best practices change. If you have any questions or
                  concerns about our security measures, we encourage you to contact us.
                </>
              ) : (
                <>
                  La sécurité est un effort continu. Nous revoyons et adaptons régulièrement nos
                  pratiques à mesure que Lastmona évolue et que les bonnes pratiques changent. Si
                  vous avez des questions ou des préoccupations concernant nos mesures de sécurité,
                  n’hésitez pas à nous contacter.
                </>
              )}
            </p>
          </section>
        </div>
      </main>

      {/* Footer – same structure as other pages */}
      <footer className="mt-10 py-12 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left - Company Logo and Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Lastmona Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <span className="text-lg font-bold text-indigo-600 tracking-tight">
                  Lastmona
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {lang === "en"
                  ? "Our mission is to make it simple to build resumes people are proud to send."
                  : "Notre mission est de rendre simple la création de CV dont les gens sont fiers."}
              </p>
            </div>

            {/* Middle - Company Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {lang === "en" ? "Company" : "Entreprise"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "About us" : "À propos"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Contact" : "Contact"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right - Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {lang === "en" ? "Legal" : "Mentions légales"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Privacy" : "Confidentialité"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Terms of service" : "Conditions d'utilisation"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {lang === "en" ? "Security" : "Sécurité"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



