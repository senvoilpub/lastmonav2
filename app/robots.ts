import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.lastmona.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/profile", "/security", "/signin", "/signup"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

