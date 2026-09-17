import type { Metadata } from "next";

export const siteConfig = {
  name: "Rock & Paper LP",
  shortName: "Rock & Paper LP",
  url: "https://rockandpaper.com",
  locale: "en_NG",
  description:
    "A Nigerian full-service law firm advising businesses, investors, institutions and individuals across transactions, disputes and regulation.",
  socialDescription: "Clear legal thinking for complex business decisions.",
  ogImage: "/opengraph-image",
  twitterImage: "/twitter-image",
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.socialDescription}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.twitterImage],
    },
  };
}
