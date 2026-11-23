import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { PersonProfile } from "@/components/people/person-profile";
import { ContactCtaSection } from "@/components/home/contact-cta-section";

import { createPageMetadata } from "@/lib/seo";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPerson(slug: string) {
	try {
		const person = await prisma.person.findUnique({
			where: { slug },
		});
		if (!person) return null;
		return {
			...person,
			imagePosition: person.imagePosition ?? undefined,
		};
	} catch (error) {
		console.error("Failed to fetch person:", error);
		return null;
	}
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const person = await getPerson(slug);
	if (!person) return {};
	return createPageMetadata({
		title: person.name,
		description: `${person.name} at Rock & Paper LP.`,
		path: `/people/${person.slug}`,
	});
}

export default async function PersonPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const person = await getPerson(slug);
	if (!person) notFound();
	return (
		<>
			<PageHero
				eyebrow="Our people"
				title={person.name}
				description={person.expertise.join(" · ")}
			/>
			<PersonProfile person={person} />
			<ContactCtaSection />
		</>
	);
}
