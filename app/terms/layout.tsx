import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Lastmona",
  description: "Read Lastmona's terms of service to understand the rules and guidelines for using our AI-powered resume builder platform.",
  alternates: {
    canonical: "https://www.lastmona.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

