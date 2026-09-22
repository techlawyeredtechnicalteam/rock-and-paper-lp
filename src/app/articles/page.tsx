import type { Metadata } from "next";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Articles",
  description: "Practical legal perspectives from Rock & Paper LP.",
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <>
      <PageHero
        eyebrow="Articles"
        title="Articles."
        description="No article yet, check back later."
        // image="/images/expertise/regulatory-compliance.webp"
        // imageAlt="Structured architectural lines representing legal analysis"
      />
      <ContactCtaSection />
    </>
  );
}
