import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "lastmona - Your Next Big Thing",
  description: "Welcome to lastmona, where innovation meets excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

