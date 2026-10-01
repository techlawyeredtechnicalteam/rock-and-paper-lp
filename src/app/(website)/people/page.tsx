import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PeopleGrid } from "@/components/people/people-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { Person } from "@/components/home/team-section";
import { PageSection } from "@/generated/prisma/client";

export async function generateMetadata(): Promise<Metadata> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	let seo: any = {};

	try {
		const res = await fetch(`${baseUrl}/api/page-seo?page=people`, {
			next: { revalidate: 3600 },
		});
		if (res.ok) {
			const json = await res.json();
			seo = json.data || {};
		}
	} catch (error) {
		console.error("Failed to fetch people page SEO:", error);
	}

	return await createPageMetadata({
		title: seo.title || "People",
		description: seo.description || "Meet the lawyers of Rock & Paper LP.",
		ogImage: seo.ogImage || undefined,
		path: "/people",
	});
}

export default async function PeoplePage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let people: Person[] = [];
	let contents: PageSection[] = [];

	try {
		// Fetch both endpoints concurrently
		const [peopleRes, contentRes] = await Promise.all([
			fetch(`${baseUrl}/api/people`),
			fetch(`${baseUrl}/api/page-content?page=people`),
		]);

		if (peopleRes.ok) {
			const json = await peopleRes.json();
			people = json.data || [];
		}
		if (contentRes.ok) {
			const json = await contentRes.json();
			contents = json.data || [];
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	const formattedContents = contents.reduce((acc: any, section: any) => {
		acc[section.sectionKey] = section;
		return acc;
	}, {});

	const heroContent = formattedContents["hero"];

	return (
		<>
			<PageHero
				eyebrow={heroContent?.eyebrow || "Our people"}
				title={heroContent?.title || "Experience, closely involved."}
				description={
					heroContent?.description ||
					"Our lawyers bring together complementary perspectives across commercial transactions, regulation, technology and disputes."
				}
			/>
			<PeopleGrid people={people} />
			<ContactCtaSection />
		</>
	);
}
