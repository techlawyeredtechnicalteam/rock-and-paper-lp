import type { MetadataRoute } from "next";
import { practices } from "@/content/practices";
import { people } from "@/content/people";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rockandpaperlp.com";
  const routes = ["", "/about", "/expertise", "/people", "/articles", "/contact"];
  return [
    ...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...practices.map((practice) => ({ url: `${base}/expertise/${practice.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...people.map((person) => ({ url: `${base}/people/${person.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
