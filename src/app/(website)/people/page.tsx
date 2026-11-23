import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PeopleGrid } from "@/components/people/people-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { Person } from "@/components/home/team-section";
import { PageSection } from "@/generated/prisma/client";
import { people as fallbackPeople } from "@/content/people";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let seo: any = {};

	try {
		const record = await prisma.pageSeo.findUnique({
			where: { pageSlug: "people" },
		});
		if (record) seo = record;
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
	let people: Person[] = fallbackPeople;
	let contents: PageSection[] = [];

	try {
		const [dbPeople, dbContents] = await Promise.all([
			prisma.person.findMany({ orderBy: { order: "asc" } }),
			prisma.pageSection.findMany({ where: { pageSlug: "people" } }),
		]);

		if (dbPeople.length > 0) {
			people = dbPeople;
		}
		contents = dbContents;
	} catch (error) {
		console.error("Failed to fetch people page data:", error);
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
