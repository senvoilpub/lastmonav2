"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function TermsPage() {
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
              {lang === "en" ? "Terms of Service" : "Conditions d’utilisation"}
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
                  These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
                  <span className="font-semibold">Lastmona</span> (the &quot;Service&quot;). By
                  accessing or using Lastmona, you agree to be bound by these Terms. If you do
                  not agree, please do not use the Service.
                </>
              ) : (
                <>
                  Ces conditions d’utilisation (&quot;Conditions&quot;) régissent votre utilisation
                  de <span className="font-semibold">Lastmona</span> (le &quot;Service&quot;). En
                  accédant au Service ou en l’utilisant, vous acceptez d’être lié par ces
                  Conditions. Si vous n’êtes pas d’accord, veuillez ne pas utiliser le Service.
                </>
              )}
            </p>
          </section>

          {/* 1. Description */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "1. Description of Lastmona"
                : "1. Description de Lastmona"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en" ? (
                <>
                  Lastmona is a tool that helps you turn your experience and skills into modern,
                  well-structured resumes using AI. You can generate a resume from free text input,
                  review the result, edit it, and download it.
                </>
              ) : (
                <>
                  Lastmona est un outil qui vous aide à transformer votre expérience et vos
                  compétences en CV modernes et structurés grâce à l’IA. Vous pouvez générer un CV
                  à partir d’un texte libre, le relire, le modifier et le télécharger.
                </>
              )}
            </p>
          </section>

          {/* 2. Account and access */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "2. Account and access"
                : "2. Compte et accès"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "To access certain features (such as saving and managing multiple resumes), you need to create an account and sign in with your email."
                : "Pour accéder à certaines fonctionnalités (comme la sauvegarde et la gestion de plusieurs CV), vous devez créer un compte et vous connecter avec votre adresse e-mail."}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
              <li>
                {lang === "en"
                  ? "You are responsible for maintaining the security of your account and for all activity under it."
                  : "Vous êtes responsable de la sécurité de votre compte et de toute activité réalisée via celui-ci."}
              </li>
              <li>
                {lang === "en"
                  ? "You must provide accurate information and notify us if you suspect unauthorized use of your account."
                  : "Vous devez fournir des informations exactes et nous informer si vous soupçonnez une utilisation non autorisée de votre compte."}
              </li>
            </ul>
          </section>

          {/* 3. Prompts, resumes and content */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "3. Prompts, resumes and content"
                : "3. Prompts, CV et contenu"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "When you use Lastmona, you provide text about your experience and we generate resumes from it."
                : "Lorsque vous utilisez Lastmona, vous fournissez du texte sur votre expérience et nous générons des CV à partir de ces informations."}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
              <li>
                {lang === "en"
                  ? "You remain responsible for the accuracy and legality of the information you enter and of the resumes you use."
                  : "Vous restez responsable de l’exactitude et de la légalité des informations que vous saisissez et des CV que vous utilisez."}
              </li>
              <li>
                {lang === "en"
                  ? "You retain ownership of the prompts and resume content you create with Lastmona."
                  : "Vous conservez la propriété des prompts et du contenu de CV que vous créez avec Lastmona."}
              </li>
              <li>
                {lang === "en"
                  ? "By using the Service, you grant us a limited right to process this content only to operate, improve and provide Lastmona."
                  : "En utilisant le Service, vous nous accordez un droit limité de traiter ce contenu uniquement pour faire fonctionner, améliorer et fournir Lastmona."}
              </li>
            </ul>
          </section>

          {/* 4. Data and privacy */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "4. Data and privacy"
                : "4. Données et confidentialité"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en" ? (
                <>
                  We collect and use certain personal data (such as your email address, prompts and
                  generated resumes) to provide and improve the Service. For details about what we
                  collect and how we use it, please read our{" "}
                  <Link
                    href="/privacy"
                    className="text-indigo-600 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </>
              ) : (
                <>
                  Nous collectons et utilisons certaines données personnelles (comme votre adresse
                  e-mail, vos prompts et vos CV générés) pour fournir et améliorer le Service. Pour
                  plus de détails sur ce que nous collectons et comment nous l’utilisons, veuillez
                  consulter notre{" "}
                  <Link
                    href="/privacy"
                    className="text-indigo-600 underline underline-offset-2"
                  >
                    politique de confidentialité
                  </Link>
                  .
                </>
              )}
            </p>
          </section>

          {/* 5. Payments */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "5. Payments and plans"
                : "5. Paiement et offres"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "Lastmona may offer free access and/or paid plans. If we introduce paid plans, the applicable prices, billing terms and, where relevant, refund policies will be clearly presented at the time of purchase."
                : "Lastmona peut proposer un accès gratuit et/ou des offres payantes. Si nous introduisons des offres payantes, les prix applicables, modalités de facturation et, le cas échéant, politiques de remboursement seront clairement indiqués au moment de l’achat."}
            </p>
          </section>

          {/* 6. Acceptable use */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "6. Acceptable use"
                : "6. Utilisation acceptable"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "When using Lastmona, you agree not to:"
                : "En utilisant Lastmona, vous vous engagez à ne pas :"}
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 leading-relaxed">
              <li>
                {lang === "en"
                  ? "Use the Service in any way that violates applicable laws or regulations."
                  : "Utiliser le Service de manière contraire aux lois ou réglementations applicables."}
              </li>
              <li>
                {lang === "en"
                  ? "Upload or generate content that is unlawful, discriminatory, hateful or otherwise harmful."
                  : "Téléverser ou générer du contenu illégal, discriminatoire, haineux ou autrement nuisible."}
              </li>
              <li>
                {lang === "en"
                  ? "Attempt to interfere with or compromise the security or integrity of the Service."
                  : "Tenter de porter atteinte à la sécurité ou à l’intégrité du Service."}
              </li>
              <li>
                {lang === "en"
                  ? "Reverse engineer, copy or resell the Service without our written permission."
                  : "Procéder à de l’ingénierie inverse, copier ou revendre le Service sans notre autorisation écrite."}
              </li>
            </ul>
          </section>

          {/* 7. Suspension and termination */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "7. Suspension and termination"
                : "7. Suspension et résiliation"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "We may suspend or terminate your access to Lastmona if we reasonably believe that you are violating these Terms, using the Service in an abusive way, or creating a security risk for the platform or other users."
                : "Nous pouvons suspendre ou résilier votre accès à Lastmona si nous estimons raisonnablement que vous violez ces Conditions, que vous faites un usage abusif du Service ou que vous créez un risque pour la sécurité de la plateforme ou d’autres utilisateurs."}
            </p>
          </section>

          {/* 8. Disclaimer and limitation of liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "8. Disclaimer and limitation of liability"
                : "8. Limitation de responsabilité"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en" ? (
                <>
                  Lastmona is provided &quot;as is&quot; and &quot;as available&quot;. We do not
                  promise that the Service will be error-free or uninterrupted. To the fullest
                  extent permitted by law, Lastmona and its operators will not be liable for any
                  indirect, incidental or consequential damages arising out of your use of the
                  Service.
                </>
              ) : (
                <>
                  Lastmona est fourni &quot;en l’état&quot; et &quot;sous réserve de
                  disponibilité&quot;. Nous ne garantissons pas que le Service sera exempt
                  d’erreurs ou ininterrompu. Dans la mesure maximale permise par la loi,
                  Lastmona et ses exploitants ne sauraient être tenus responsables des dommages
                  indirects, accessoires ou consécutifs résultant de votre utilisation du Service.
                </>
              )}
            </p>
          </section>

          {/* 9. Governing law */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "9. Governing law"
                : "9. Droit applicable"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "These Terms are governed by the laws of the jurisdiction where Lastmona is operated, without regard to conflict of law rules."
                : "Les présentes Conditions sont régies par les lois de la juridiction dans laquelle Lastmona est exploitée, sans tenir compte des règles de conflit de lois."}
            </p>
          </section>

          {/* 10. Changes to these Terms */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "10. Changes to these Terms"
                : "10. Modifications des Conditions"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "We may update these Terms from time to time. When we make material changes, we may notify you by email or by displaying a notice in the Service. Your continued use of Lastmona after the changes take effect means you accept the updated Terms."
                : "Nous pouvons mettre à jour ces Conditions de temps à autre. En cas de modification importante, nous pourrons vous en informer par e-mail ou via un message dans le Service. Le fait de continuer à utiliser Lastmona après l’entrée en vigueur de ces changements vaut acceptation des Conditions mises à jour."}
            </p>
          </section>

          {/* 11. Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {lang === "en"
                ? "11. Contact"
                : "11. Contact"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {lang === "en"
                ? "If you have any questions about these Terms or how Lastmona works, you can reach us using the contact details available on our website."
                : "Si vous avez des questions concernant ces Conditions ou le fonctionnement de Lastmona, vous pouvez nous contacter via les coordonnées disponibles sur notre site."}
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



