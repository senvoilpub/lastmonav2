import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Lastmona",
  description: "Read Lastmona's privacy policy to understand how we collect, use, and protect your personal information when using our AI resume builder.",
  alternates: {
    canonical: "https://www.lastmona.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

