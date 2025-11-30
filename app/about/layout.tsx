import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Lastmona | European AI Resume Builder",
  description: "Learn about Lastmona, a European startup dedicated to helping talent reach their dream careers. We use smart, ethical AI to transform your story into a professional resume.",
  alternates: {
    canonical: "https://www.lastmona.com/about",
  },
  openGraph: {
    title: "About Us - Lastmona",
    description: "A European startup dedicated to helping talent reach their dream careers with AI-powered resume building.",
    url: "https://www.lastmona.com/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

