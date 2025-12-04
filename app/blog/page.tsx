"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import BlogImage from "@/components/BlogImage";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

interface FeaturedSaaS {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website: string;
  logo?: string;
}

// Sample data - in production, this would come from a database
const blogOfTheDay: BlogPost = {
  id: "day-1",
  title: "10 Resume Mistakes That Are Costing You Interviews",
  excerpt: "Learn about the most common resume mistakes that recruiters see every day and how to avoid them to increase your chances of landing your dream job.",
  category: "Resume Tips",
  date: "2025-01-15",
  readTime: "5 min read",
  author: "Sarah Johnson",
};

const blogOfTheWeek: BlogPost = {
  id: "week-1",
  title: "The Future of Hiring: AI and Human Connection",
  excerpt: "Exploring how AI is transforming recruitment while maintaining the human touch that makes hiring meaningful.",
  category: "Industry Insights",
  date: "2025-01-10",
  readTime: "8 min read",
  author: "Michael Chen",
};

const blogOfTheMonth: BlogPost = {
  id: "month-1",
  title: "Career Pivots: How to Successfully Change Industries",
  excerpt: "A comprehensive guide to making a successful career transition, including how to highlight transferable skills on your resume.",
  category: "Career Growth",
  date: "2024-12-28",
  readTime: "10 min read",
  author: "Emma Rodriguez",
};

const featuredSaaS: FeaturedSaaS = {
  id: "saas-1",
  name: "Example SaaS",
  tagline: "The best tool for your workflow",
  description: "A revolutionary SaaS platform that helps teams collaborate more effectively and achieve better results.",
  website: "https://example.com",
};

export default function BlogPage() {
  const [lang] = useState<"en" | "fr">("en");
  const [submissionForm, setSubmissionForm] = useState({
    title: "",
    author: "",
    email: "",
    category: "",
    content: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission - in production, this would send to an API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSubmissionForm({
        title: "",
        author: "",
        email: "",
        category: "",
        content: "",
        website: "",
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar lang={lang} onLangChange={() => {}} />
      
      <div className="pt-24 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              The Lastmona <span className="text-indigo-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A curated collection of high-quality content. We only feature blogs that provide real value and insights.
            </p>
          </div>

          {/* Featured Blogs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {/* Blog of the Day */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-200 text-yellow-900">
                  BLOG OF THE DAY
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {blogOfTheDay.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {blogOfTheDay.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{blogOfTheDay.author}</span>
                <span>{blogOfTheDay.readTime}</span>
              </div>
            </div>

            {/* Blog of the Week */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-200 text-purple-900">
                  BLOG OF THE WEEK
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {blogOfTheWeek.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {blogOfTheWeek.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{blogOfTheWeek.author}</span>
                <span>{blogOfTheWeek.readTime}</span>
              </div>
            </div>

            {/* Blog of the Month */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-200 text-indigo-900">
                  BLOG OF THE MONTH
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {blogOfTheMonth.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {blogOfTheMonth.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{blogOfTheMonth.author}</span>
                <span>{blogOfTheMonth.readTime}</span>
              </div>
            </div>
          </div>

          {/* Free Advertisement Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-8 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 text-sm font-bold rounded-full bg-emerald-200 text-emerald-900">
                FREE ADVERTISEMENT
              </span>
              <span className="text-sm text-gray-600">Today&apos;s Featured SaaS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {featuredSaaS.name}
                </h3>
                <p className="text-lg text-emerald-700 font-medium mb-3">
                  {featuredSaaS.tagline}
                </p>
                <p className="text-gray-700 mb-4">
                  {featuredSaaS.description}
                </p>
                <Link
                  href={featuredSaaS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-colors"
                >
                  Visit Website →
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-2xl bg-white border-2 border-emerald-200 flex items-center justify-center">
                  <span className="text-4xl font-bold text-emerald-600">
                    {featuredSaaS.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-600 text-center">
              We promote one new, high-quality SaaS for free each day. Interested?{" "}
              <Link href="#submit" className="text-emerald-600 hover:underline font-medium">
                Submit your SaaS
              </Link>
            </p>
          </div>

          {/* Blog Submission Section */}
          <div id="submit" className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Submit Your Blog
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We only feature high-quality blogs that provide real value. Share your expertise and help others learn from the best.
              </p>
            </div>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  ✓ Thank you for your submission! We&apos;ll review it and get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={submissionForm.title}
                    onChange={(e) =>
                      setSubmissionForm({ ...submissionForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Enter your blog title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={submissionForm.category}
                    onChange={(e) =>
                      setSubmissionForm({ ...submissionForm, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  >
                    <option value="">Select a category</option>
                    <option value="Resume Tips">Resume Tips</option>
                    <option value="Career Growth">Career Growth</option>
                    <option value="Hiring Trends">Hiring Trends</option>
                    <option value="Industry Insights">Industry Insights</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={submissionForm.author}
                    onChange={(e) =>
                      setSubmissionForm({ ...submissionForm, author: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={submissionForm.email}
                    onChange={(e) =>
                      setSubmissionForm({ ...submissionForm, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Content / URL *
                </label>
                <textarea
                  required
                  value={submissionForm.content}
                  onChange={(e) =>
                    setSubmissionForm({ ...submissionForm, content: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Paste your blog content or provide a URL to your published blog post"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Website (optional)
                </label>
                <input
                  type="url"
                  value={submissionForm.website}
                  onChange={(e) =>
                    setSubmissionForm({ ...submissionForm, website: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Blog"}
                </button>
              </div>
            </form>
          </div>

          {/* SaaS Submission Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 p-8 mb-16">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Submit Your SaaS for Free Promotion
              </h2>
              <p className="text-gray-600">
                New SaaS only. We promote one high-quality SaaS for free each day.
              </p>
            </div>
            <div className="text-center">
              <Link
                href="mailto:builtpublic@gmail.com?subject=SaaS Submission for Free Promotion"
                className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors"
              >
                Email Us to Submit Your SaaS
              </Link>
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
                  <BlogImage
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
                  Our first mission: make it simple to build resumes people are proud to send. Everything else will build on top of that.
                </p>
              </div>

              {/* Middle - Company Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="https://lastmona.com/about"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      About us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/contact"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Main website
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Right - Legal Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="https://lastmona.com/privacy"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/terms"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Terms of service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://lastmona.com/security"
                      className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      Security
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
