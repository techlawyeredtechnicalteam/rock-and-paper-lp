import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { SectorsGrid } from "@/components/sectors/sectors-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sectors",
  description: "Sector experience across Nigeria's evolving economy.",
  path: "/sectors",
});

export default function SectorsPage() {
  return (
    <>
      <PageHero eyebrow="Sector focus" title="Industry context sharpens legal advice." description="Our experience spans industries where regulation, capital, technology and complex commercial relationships meet." />
      <SectorsGrid />
      <ContactCtaSection />
    </>
  );
}
