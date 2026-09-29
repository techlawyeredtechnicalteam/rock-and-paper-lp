import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PeopleGrid } from "@/components/people/people-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { Person } from "@/components/home/team-section";

export async function generateMetadata(): Promise<Metadata> {
	return await createPageMetadata({
		title: "People",
		description: "Meet the lawyers of Rock & Paper LP.",
		path: "/people",
	});
}

export default async function PeoplePage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let people: Person[] = [];

	try {
		// Fetch both endpoints concurrently
		const [peopleRes] = await Promise.all([fetch(`${baseUrl}/api/people`)]);

		if (peopleRes.ok) {
			const json = await peopleRes.json();
			people = json.data || [];
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	return (
		<>
			<PageHero
				eyebrow="Our people"
				title="Experience, closely involved."
				description="Our lawyers bring together complementary perspectives across commercial transactions, regulation, technology and disputes."
			/>
			<PeopleGrid people={people} />
			<ContactCtaSection />
		</>
	);
}
