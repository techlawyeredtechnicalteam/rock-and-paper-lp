import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { AboutNarrative } from "@/components/about/about-narrative";
import { AboutEthos } from "@/components/about/about-ethos";
import { AboutExperience } from "@/components/about/about-experience";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: "Learn about Rock & Paper LP, our approach and representative experience.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Legal depth with a practical point of view." description="We combine careful legal analysis with a clear understanding of the businesses and people we advise." />
      <AboutNarrative />
      <AboutEthos />
      <AboutExperience />
      <ContactCtaSection />
    </>
  );
}
