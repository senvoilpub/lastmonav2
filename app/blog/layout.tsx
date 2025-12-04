import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lastmona Blog - Career Insights & Tips",
  description: "Career insights, resume tips, and stories about building better careers and rebuilding trust in recruitment.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

