import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ContactDetails } from "@/components/contact/contact-details";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Contact Rock & Paper LP in Abuja or Lagos.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact us" title="Start with a clear conversation." description="Contact our Abuja or Lagos office to discuss how we may help with your matter." />
      <ContactDetails />
    </>
  );
}
