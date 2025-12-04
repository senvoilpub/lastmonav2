"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  titleFr: string;
  excerpt: string;
  excerptFr: string;
  category: string;
  categoryFr: string;
  date: string;
  readTime: string;
  readTimeFr: string;
  image?: string;
}

// Sample blog posts - in a real app, these would come from a CMS or database
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Resume Mistakes That Are Costing You Interviews",
    titleFr: "10 erreurs de CV qui vous coûtent des entretiens",
    excerpt: "Learn about the most common resume mistakes that recruiters see every day and how to avoid them to increase your chances of landing your dream job.",
    excerptFr: "Découvrez les erreurs de CV les plus courantes que les recruteurs voient chaque jour et comment les éviter pour augmenter vos chances de décrocher le job de vos rêves.",
    category: "Resume Tips",
    categoryFr: "Conseils CV",
    date: "2025-01-15",
    readTime: "5 min read",
    readTimeFr: "5 min de lecture",
  },
  {
    id: "2",
    title: "How to Tailor Your Resume for Each Job Application",
    titleFr: "Comment adapter votre CV à chaque candidature",
    excerpt: "Discover the secrets of customizing your resume for different positions without starting from scratch every time.",
    excerptFr: "Découvrez les secrets pour personnaliser votre CV selon les différents postes sans repartir de zéro à chaque fois.",
    category: "Resume Tips",
    categoryFr: "Conseils CV",
    date: "2025-01-10",
    readTime: "7 min read",
    readTimeFr: "7 min de lecture",
  },
  {
    id: "3",
    title: "The Future of Hiring: AI and Human Connection",
    titleFr: "L'avenir du recrutement : IA et connexion humaine",
    excerpt: "Exploring how AI is transforming recruitment while maintaining the human touch that makes hiring meaningful.",
    excerptFr: "Exploration de la façon dont l'IA transforme le recrutement tout en préservant la dimension humaine qui rend le recrutement significatif.",
    category: "Industry Insights",
    categoryFr: "Insights de l'industrie",
    date: "2025-01-05",
    readTime: "8 min read",
    readTimeFr: "8 min de lecture",
  },
  {
    id: "4",
    title: "Career Pivots: How to Successfully Change Industries",
    titleFr: "Changements de carrière : comment changer d'industrie avec succès",
    excerpt: "A comprehensive guide to making a successful career transition, including how to highlight transferable skills on your resume.",
    excerptFr: "Un guide complet pour réussir une transition de carrière, y compris comment mettre en valeur vos compétences transférables sur votre CV.",
    category: "Career Growth",
    categoryFr: "Développement de carrière",
    date: "2024-12-28",
    readTime: "10 min read",
    readTimeFr: "10 min de lecture",
  },
  {
    id: "5",
    title: "What Recruiters Really Look For in 2025",
    titleFr: "Ce que les recruteurs recherchent vraiment en 2025",
    excerpt: "Insights from industry professionals about what makes a candidate stand out in today's competitive job market.",
    excerptFr: "Les insights de professionnels de l'industrie sur ce qui fait qu'un candidat se démarque sur le marché du travail actuel.",
    category: "Hiring Trends",
    categoryFr: "Tendances du recrutement",
    date: "2024-12-20",
    readTime: "6 min read",
    readTimeFr: "6 min de lecture",
  },
  {
    id: "6",
    title: "Building Trust in Recruitment: Our Mission",
    titleFr: "Construire la confiance dans le recrutement : notre mission",
    excerpt: "Why we're building Lastmona and how we plan to rebuild trust between talent and recruiters in the hiring process.",
    excerptFr: "Pourquoi nous construisons Lastmona et comment nous prévoyons de recréer la confiance entre les talents et les recruteurs dans le processus d'embauche.",
    category: "Industry Insights",
    categoryFr: "Insights de l'industrie",
    date: "2024-12-15",
    readTime: "5 min read",
    readTimeFr: "5 min de lecture",
  },
];

export default function BlogPage() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { en: "All", fr: "Tout", value: null },
    { en: "Resume Tips", fr: "Conseils CV", value: "Resume Tips" },
    { en: "Career Growth", fr: "Développement de carrière", value: "Career Growth" },
    { en: "Hiring Trends", fr: "Tendances du recrutement", value: "Hiring Trends" },
    { en: "Industry Insights", fr: "Insights de l'industrie", value: "Industry Insights" },
  ];

  const filteredPosts = selectedCategory
    ? blogPosts.filter((post) => post.category === selectedCategory)
    : blogPosts;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} onLangChange={setLang} />
      
      <div className="pt-24 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {lang === "en" ? (
                <>
                  The Lastmona{" "}
                  <span className="text-indigo-600">Blog</span>
                </>
              ) : (
                <>
                  Le{" "}
                  <span className="text-indigo-600">Blog</span> Lastmona
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {lang === "en"
                ? "Career insights, resume tips, and stories about building better careers and rebuilding trust in recruitment."
                : "Conseils de carrière, astuces CV et histoires sur la construction de meilleures carrières et la reconstruction de la confiance dans le recrutement."}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category.value || "all"}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.value
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {lang === "en" ? category.en : category.fr}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/blog/${post.id}`} className="block">
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                        {lang === "en" ? post.category : post.categoryFr}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(post.date)}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {lang === "en" ? post.title : post.titleFr}
                    </h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {lang === "en" ? post.excerpt : post.excerptFr}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {lang === "en" ? post.readTime : post.readTimeFr}
                      </span>
                      <span className="text-indigo-600 text-sm font-medium group-hover:underline">
                        {lang === "en" ? "Read more →" : "Lire la suite →"}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-8 md:p-12 text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {lang === "en" ? "Stay Updated" : "Restez informé"}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {lang === "en"
                ? "Get the latest career tips and insights delivered to your inbox."
                : "Recevez les derniers conseils de carrière et insights directement dans votre boîte mail."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={lang === "en" ? "Enter your email" : "Entrez votre email"}
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
              />
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors">
                {lang === "en" ? "Subscribe" : "S'abonner"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Section - Same as main site */}
        <footer className="mt-20 py-12 border-t border-gray-200">
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
                    ? "Our first mission: make it simple to build resumes people are proud to send. Everything else will build on top of that."
                    : "Notre première mission : rendre simple la création de CV dont les gens sont fiers. Tout le reste se construira dessus."}
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
                      href="https://lastmona.com/about"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "About us" : "À propos"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/contact"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Contact" : "Contact"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Main website" : "Site principal"}
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
                      href="https://lastmona.com/privacy"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Privacy" : "Confidentialité"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/terms"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      {lang === "en" ? "Terms of service" : "Conditions d'utilisation"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/security"
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
    </div>
  );
}

