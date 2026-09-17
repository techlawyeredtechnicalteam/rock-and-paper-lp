import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseDetail } from "@/components/expertise/expertise-detail";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { getPractice, practices } from "@/content/practices";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return practices.map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) return {};
  return createPageMetadata({
    title: practice.title,
    description: practice.shortDescription,
    path: `/expertise/${practice.slug}`,
  });
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const practice = getPractice(slug);
  if (!practice) notFound();
  return (
    <>
      <PageHero
        eyebrow="Expertise"
        title={practice.title}
        description={practice.shortDescription}
        image={practice.image}
        imageAlt={practice.imageAlt}
      />
      <ExpertiseDetail practice={practice} />
      <ContactCtaSection />
    </>
  );
}
