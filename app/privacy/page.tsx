"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function PrivacyPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="pt-24 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {lang === "en" ? "Legal" : "Légal"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              {lang === "en" ? "Privacy Policy" : "Politique de confidentialité"}
            </h1>
            <p className="text-sm text-gray-500">
              {lang === "en"
                ? "Last updated: November 26, 2025"
                : "Dernière mise à jour : 26 novembre 2025"}
            </p>
          </header>

          <section className="space-y-4 text-sm leading-relaxed text-gray-700">
            <p>
              {lang === "en" ? (
                <>
                  This Privacy Policy explains how{" "}
                  <span className="font-semibold">Lastmona</span> (&quot;we&quot;, &quot;us&quot;,
                  &quot;our&quot;) collects, uses and protects your information when you use our
                  website and services to generate and manage resumes. By using Lastmona, you
                  agree to the practices described here.
                </>
              ) : (
                <>
                  Cette politique de confidentialité explique comment{" "}
                  <span className="font-semibold">Lastmona</span> (&quot;nous&quot;) collecte,
                  utilise et protège vos informations lorsque vous utilisez notre site et nos
                  services pour générer et gérer des CV. En utilisant Lastmona, vous acceptez
                  les pratiques décrites ci-dessous.
                </>
              )}
            </p>
          </section>

          {/* 1. Information we collect */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "1. Information we collect"
                : "1. Informations que nous collectons"}
            </h2>

            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en"
                  ? "1.1 Personal data"
                  : "1.1 Données personnelles"}
              </h3>
              <p>
                {lang === "en"
                  ? "We collect the minimum personal data needed to provide our service:"
                  : "Nous collectons le minimum de données personnelles nécessaires pour fournir notre service :"}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-semibold">
                    {lang === "en" ? "Email address" : "Adresse e-mail"}
                  </span>
                  {lang === "en"
                    ? " – used to authenticate you, send magic sign-in links, and communicate about your account."
                    : " – utilisée pour vous authentifier, envoyer des liens de connexion sécurisés et communiquer au sujet de votre compte."}
                </li>
                <li>
                  <span className="font-semibold">
                    {lang === "en" ? "Account information" : "Informations de compte"}
                  </span>
                  {lang === "en"
                    ? " – basic metadata created when you sign in (for example, technical identifiers from our authentication provider)."
                    : " – métadonnées de base créées lors de votre connexion (par exemple des identifiants techniques fournis par notre solution d’authentification)."}
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en"
                  ? "1.2 Content you provide"
                  : "1.2 Contenu que vous fournissez"}
              </h3>
              <p>
                {lang === "en"
                  ? "Lastmona is built around your experience and career story. To generate and manage resumes, we process and store:"
                  : "Lastmona est centrée sur votre expérience et votre parcours. Pour générer et gérer des CV, nous traitons et stockons :"}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <span className="font-semibold">
                    {lang === "en" ? "Prompts / input text" : "Prompts / texte saisi"}
                  </span>
                  {lang === "en"
                    ? " – what you write in the input box (your experience, skills, projects, etc.)."
                    : " – ce que vous écrivez dans la zone de texte (votre expérience, vos compétences, vos projets, etc.)."}
                </li>
                <li>
                  <span className="font-semibold">
                    {lang === "en" ? "Generated resumes" : "CV générés"}
                  </span>
                  {lang === "en"
                    ? " – the resume content created by our AI based on your prompts."
                    : " – le contenu de CV généré par notre IA à partir de vos prompts."}
                </li>
                <li>
                  <span className="font-semibold">
                    {lang === "en" ? "Edits and versions" : "Modifications et versions"}
                  </span>
                  {lang === "en"
                    ? " – any changes you make to a generated resume (for example, adjusting bullets, wording or contact details)."
                    : " – toutes les modifications que vous apportez à un CV généré (par exemple, correction de bullet points, reformulation, mise à jour de coordonnées)."}
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
              <h3 className="font-semibold">
                {lang === "en"
                  ? "1.3 Usage and technical data"
                  : "1.3 Données d’usage et techniques"}
              </h3>
              <p>
                {lang === "en"
                  ? "We may collect non-personal information about how you use Lastmona to help us keep the service reliable and improve it over time, for example:"
                  : "Nous pouvons collecter des informations non personnelles sur la manière dont vous utilisez Lastmona pour garder le service fiable et l’améliorer, par exemple :"}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  {lang === "en"
                    ? "Basic device and browser information (such as browser type and version)."
                    : "Informations de base sur l’appareil et le navigateur (type et version du navigateur, par exemple)."}
                </li>
                <li>
                  {lang === "en"
                    ? "Aggregate usage metrics (for example, which features are used most often)."
                    : "Statistiques d’usage agrégées (par exemple, quelles fonctionnalités sont le plus utilisées)."}
                </li>
              </ul>
            </div>
          </section>

          {/* 2. How we use your data */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "2. How we use your data"
                : "2. Comment nous utilisons vos données"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "We use the information we collect for the following purposes:"
                : "Nous utilisons les informations collectées pour les finalités suivantes :"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
              <li>
                <span className="font-semibold">
                  {lang === "en"
                    ? "Providing our core service"
                    : "Fournir notre service principal"}
                </span>{" "}
                {lang === "en"
                  ? "– generating resumes from your prompts, letting you view, edit and download them."
                  : "– générer des CV à partir de vos prompts et vous permettre de les visualiser, modifier et télécharger."}
              </li>
              <li>
                <span className="font-semibold">
                  {lang === "en"
                    ? "Personalizing your experience"
                    : "Personnaliser votre expérience"}
                </span>{" "}
                {lang === "en"
                  ? "– remembering your language preference and helping you access past resumes from your dashboard."
                  : "– mémoriser votre préférence de langue et vous permettre d’accéder à vos anciens CV depuis votre tableau de bord."}
              </li>
              <li>
                <span className="font-semibold">
                  {lang === "en"
                    ? "Improving our systems"
                    : "Améliorer nos systèmes"}
                </span>{" "}
                {lang === "en"
                  ? "– understanding how people use Lastmona so we can refine our AI prompts, resume structure and product decisions."
                  : "– comprendre comment Lastmona est utilisée afin d’affiner nos prompts IA, la structure des CV et nos décisions produit."}
              </li>
              <li>
                <span className="font-semibold">
                  {lang === "en"
                    ? "Analyzing usage patterns"
                    : "Analyser les usages"}
                </span>{" "}
                {lang === "en"
                  ? "– monitoring aggregated usage (for example, how often resumes are generated or downloaded) to keep the platform reliable."
                  : "– suivre des indicateurs agrégés (par exemple, fréquence de génération ou de téléchargement de CV) pour garder la plateforme fiable."}
              </li>
              <li>
                <span className="font-semibold">
                  {lang === "en" ? "Security and abuse prevention" : "Sécurité et prévention des abus"}
                </span>{" "}
                {lang === "en"
                  ? "– protecting Lastmona, our infrastructure and our users from abuse, fraud or misuse."
                  : "– protéger Lastmona, notre infrastructure et nos utilisateurs contre les abus, la fraude ou une utilisation inappropriée."}
              </li>
            </ul>
          </section>

          {/* 3. Data storage and security */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "3. Data storage and security"
                : "3. Stockage et sécurité des données"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en" ? (
                <>
                  We store your information with trusted providers and take reasonable technical
                  and organizational measures to protect it against unauthorized access, loss or
                  alteration. No online service can be 100% secure, but we work to keep your data
                  protected and limit what we store to what is necessary to operate Lastmona.
                </>
              ) : (
                <>
                  Nous stockons vos informations auprès de prestataires de confiance et appliquons
                  des mesures techniques et organisationnelles raisonnables pour les protéger
                  contre tout accès non autorisé, perte ou altération. Aucun service en ligne ne
                  peut être sécurisé à 100 %, mais nous travaillons à protéger vos données et
                  limitons ce que nous stockons à ce qui est nécessaire au fonctionnement de
                  Lastmona.
                </>
              )}
            </p>
          </section>

          {/* 4. Data sharing */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "4. Data sharing"
                : "4. Partage de données"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "We do not sell your personal data. We may share limited information in these situations:"
                : "Nous ne vendons pas vos données personnelles. Nous pouvons partager des informations limitées dans les situations suivantes :"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
              <li>
                {lang === "en"
                  ? "With service providers who help us operate Lastmona (for example, hosting, databases, analytics), under appropriate confidentiality and security terms."
                  : "Avec des prestataires qui nous aident à faire fonctionner Lastmona (hébergement, bases de données, analyse), dans le cadre d’accords de confidentialité et de sécurité appropriés."}
              </li>
              <li>
                {lang === "en"
                  ? "When required by law or to respond to valid legal requests."
                  : "Lorsque la loi l’exige ou pour répondre à des demandes légales valides."}
              </li>
            </ul>
          </section>

          {/* 5. Your rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "5. Your rights"
                : "5. Vos droits"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "Depending on where you live, you may have rights over your personal data, including:"
                : "Selon le pays où vous vivez, vous pouvez disposer de droits sur vos données personnelles, notamment :"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
              <li>
                {lang === "en"
                  ? "Accessing the personal data we hold about you."
                  : "Accéder aux données personnelles que nous détenons à votre sujet."}
              </li>
              <li>
                {lang === "en"
                  ? "Requesting correction of inaccurate or incomplete data."
                  : "Demander la correction de données inexactes ou incomplètes."}
              </li>
              <li>
                {lang === "en"
                  ? "Requesting deletion of certain data, when legally possible."
                  : "Demander la suppression de certaines données, lorsque la loi le permet."}
              </li>
              <li>
                {lang === "en"
                  ? "Objecting to or limiting certain types of processing."
                  : "Vous opposer à certains traitements ou demander leur limitation."}
              </li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "If you would like to exercise any of these rights, you can contact us using the details below."
                : "Pour exercer ces droits, vous pouvez nous contacter en utilisant les coordonnées ci-dessous."}
            </p>
          </section>

          {/* 6. Data retention */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "6. Data retention"
                : "6. Durée de conservation"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "We keep your account data, prompts and resumes for as long as your account is active or as needed to provide the service. We may retain certain information for a longer period if required by law or for legitimate business purposes (for example, security, preventing abuse)."
                : "Nous conservons vos données de compte, prompts et CV tant que votre compte est actif ou tant que nécessaire pour fournir le service. Certaines informations peuvent être conservées plus longtemps si la loi l’exige ou pour des raisons légitimes (sécurité, prévention des abus)."}
            </p>
          </section>

          {/* 7. Changes to this policy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "7. Changes to this policy"
                : "7. Modifications de cette politique"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "We may update this Privacy Policy from time to time as our product or legal requirements evolve. When we make material changes, we may notify you by email or by displaying a notice within Lastmona. The date at the top of this page shows when it was last updated."
                : "Nous pouvons mettre à jour cette politique de confidentialité à mesure que notre produit ou nos obligations légales évoluent. En cas de changement important, nous pourrons vous en informer par e-mail ou via un message dans Lastmona. La date en haut de cette page indique la dernière mise à jour."}
            </p>
          </section>

          {/* 8. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "8. Contact"
                : "8. Contact"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "If you have any questions about this Privacy Policy or how we handle your data, you can reach us via the contact details provided on our website."
                : "Si vous avez des questions concernant cette politique de confidentialité ou la manière dont nous traitons vos données, vous pouvez nous contacter via les coordonnées indiquées sur notre site."}
            </p>
          </section>
        </div>
      </main>

      {/* Footer – reuse same structure as landing */}
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


