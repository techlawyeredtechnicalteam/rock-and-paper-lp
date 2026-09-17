import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    host: "https://rockandpaper.com",
    sitemap: "https://rockandpaper.com/sitemap.xml",
  };
}
