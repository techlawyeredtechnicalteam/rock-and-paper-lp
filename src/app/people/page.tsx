import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PeopleGrid } from "@/components/people/people-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "People",
  description: "Meet the lawyers of Rock & Paper LP.",
  path: "/people",
});

export default function PeoplePage() {
  return (
    <>
      <PageHero eyebrow="Our people" title="Experience, closely involved." description="Our lawyers bring together complementary perspectives across commercial transactions, regulation, technology and disputes." />
      <PeopleGrid />
      <ContactCtaSection />
    </>
  );
}
