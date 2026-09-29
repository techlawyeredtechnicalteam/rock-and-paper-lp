import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { PersonProfile } from "@/components/people/person-profile";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { getPerson, people } from "@/content/people";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return {};
  return createPageMetadata({
    title: person.name,
    description: `${person.name} at Rock & Paper LP.`,
    path: `/people/${person.slug}`,
  });
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();
  return (
    <>
      <PageHero eyebrow="Our people" title={person.name} description={person.expertise.join(" · ")} />
      <PersonProfile person={person} />
      <ContactCtaSection />
    </>
  );
}
