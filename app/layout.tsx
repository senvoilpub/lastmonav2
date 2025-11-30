import type { Metadata } from "next";
import "./globals.css";

const canonicalUrl = "https://www.lastmona.com";

export const metadata: Metadata = {
  metadataBase: new URL(canonicalUrl),
  title: {
    default: "Lastmona - AI-Powered Resume Builder | Create Professional CVs",
    template: "%s | Lastmona",
  },
  description: "Create professional, ATS-friendly resumes in minutes with Lastmona's AI-powered resume builder. Transform your experience into a compelling CV that opens doors. Free resume generator for job seekers.",
  keywords: [
    "resume builder",
    "CV creator",
    "AI resume",
    "professional resume",
    "resume generator",
    "ATS resume",
    "resume maker",
    "online CV builder",
    "resume template",
    "job application",
  ],
  authors: [{ name: "Lastmona" }],
  creator: "Lastmona",
  publisher: "Lastmona",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonicalUrl,
    siteName: "Lastmona",
    title: "Lastmona - AI-Powered Resume Builder | Create Professional CVs",
    description: "Create professional, ATS-friendly resumes in minutes with Lastmona's AI-powered resume builder. Transform your experience into a compelling CV.",
    images: [
      {
        url: `${canonicalUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Lastmona - AI-Powered Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lastmona - AI-Powered Resume Builder",
    description: "Create professional, ATS-friendly resumes in minutes with AI.",
    images: [`${canonicalUrl}/logo.png`],
    creator: "@lastmona",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  category: "career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lastmona",
              url: canonicalUrl,
              logo: `${canonicalUrl}/logo.png`,
              description: "AI-powered resume builder helping job seekers create professional CVs",
              foundingLocation: {
                "@type": "Country",
                name: "European Union",
              },
              sameAs: [
                // Add your social media links here when available
                // "https://twitter.com/lastmona",
                // "https://linkedin.com/company/lastmona",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                email: "builtpublic@gmail.com",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Lastmona",
              url: canonicalUrl,
              description: "AI-powered resume builder for creating professional CVs",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${canonicalUrl}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

