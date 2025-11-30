import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Lastmona | Get in Touch",
  description: "Have questions, feedback, or ideas? Contact Lastmona. We'd love to hear from you about our AI-powered resume builder.",
  alternates: {
    canonical: "https://www.lastmona.com/contact",
  },
  openGraph: {
    title: "Contact Us - Lastmona",
    description: "Get in touch with Lastmona. Questions, feedback, ideas — we'd love to hear from you.",
    url: "https://www.lastmona.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

