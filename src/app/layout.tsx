import type { Metadata } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { StructuredData } from "@/components/seo/structured-data";
import { siteConfig } from "@/lib/seo";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Rock & Paper LP | Commercial Legal Counsel",
    template: "%s | Rock & Paper LP",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Legal services",
  keywords: [
    "Nigerian law firm",
    "commercial lawyers Nigeria",
    "energy law Nigeria",
    "banking and finance law",
    "dispute resolution Nigeria",
    "intellectual property lawyers Nigeria",
    "corporate law Nigeria",
    "regulatory compliance Nigeria",
    "telecommunications law Nigeria",
  ],
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Rock & Paper LP | Commercial Legal Counsel",
    description: siteConfig.socialDescription,
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
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
    title: "Rock & Paper LP | Commercial Legal Counsel",
    description: siteConfig.socialDescription,
    images: [siteConfig.twitterImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${garamond.variable} ${manrope.variable}`}>
      <body>
        <StructuredData />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
