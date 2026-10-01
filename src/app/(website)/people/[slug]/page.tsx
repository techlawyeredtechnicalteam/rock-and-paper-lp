import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { PersonProfile } from "@/components/people/person-profile";
import { ContactCtaSection } from "@/components/home/contact-cta-section";

import { createPageMetadata } from "@/lib/seo";

async function getPerson(slug: string) {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	try {
		const res = await fetch(`${baseUrl}/api/people/${slug}`);
		if (!res.ok) return null;
		const json = await res.json();
		return json.data;
	} catch (error) {
		console.error(error);
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
