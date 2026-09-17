import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseGrid } from "@/components/expertise/expertise-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Expertise",
  description: "Explore the practice areas of Rock & Paper LP.",
  path: "/expertise",
});

export default function ExpertisePage() {
  return (
    <>
      <PageHero eyebrow="Our expertise" title="Connected thinking across legal disciplines." description="We advise through the full lifecycle of a business matter, bringing together transactional, regulatory and disputes experience." />
      <ExpertiseGrid />
      <ContactCtaSection />
    </>
  );
}
