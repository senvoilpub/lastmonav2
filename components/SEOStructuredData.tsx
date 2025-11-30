"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  type: "home" | "about" | "contact";
}

export default function SEOStructuredData({ type }: StructuredDataProps) {
  useEffect(() => {
    const baseUrl = "https://www.lastmona.com";

    let structuredData: any = {};

    if (type === "home") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Lastmona Resume Builder",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "150",
        },
        description:
          "AI-powered resume builder that helps job seekers create professional, ATS-friendly resumes in minutes.",
        url: baseUrl,
      };
    } else if (type === "about") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Lastmona",
        description:
          "Learn about Lastmona, a European startup dedicated to helping talent reach their dream careers.",
        url: `${baseUrl}/about`,
      };
    } else if (type === "contact") {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Lastmona",
        description: "Get in touch with Lastmona. Questions, feedback, ideas.",
        url: `${baseUrl}/contact`,
        mainEntity: {
          "@type": "Organization",
          name: "Lastmona",
          email: "builtpublic@gmail.com",
        },
      };
    }

    // Remove existing script if present
    const existingScript = document.getElementById(
      `structured-data-${type}`
    );
    if (existingScript) {
      existingScript.remove();
    }

    // Add new script
    const script = document.createElement("script");
    script.id = `structured-data-${type}`;
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(
        `structured-data-${type}`
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type]);

  return null;
}

