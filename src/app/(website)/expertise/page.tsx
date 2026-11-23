import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseGrid } from "@/components/expertise/expertise-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { Practice } from "@/components/home/practice-areas-section";
import { PageSection } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let seo: any = {};

	try {
		const record = await prisma.pageSeo.findUnique({
			where: { pageSlug: "expertise" },
		});
		if (record) seo = record;
	} catch (error) {
		console.error("Failed to fetch expertise page SEO:", error);
	}

	return await createPageMetadata({
		title: seo.title || "Expertise",
		description:
			seo.description || "Explore the practice areas of Rock & Paper LP.",
		ogImage: seo.ogImage || undefined,
		path: "/expertise",
	});
}

export default async function ExpertisePage() {
	let practices: Practice[] = [];
	let contents: PageSection[] = [];

	try {
		const [dbPractices, dbContents] = await Promise.all([
			prisma.practice.findMany({ orderBy: { title: "asc" } }),
			prisma.pageSection.findMany({ where: { pageSlug: "expertise" } }),
		]);

		practices = dbPractices;
		contents = dbContents;
	} catch (error) {
		console.error("Failed to fetch expertise page data:", error);
	}

	const formattedContents = contents.reduce((acc: any, section: any) => {
		acc[section.sectionKey] = section;
		return acc;
	}, {});

	const heroContent = formattedContents["hero"];

	return (
		<>
			<PageHero
				eyebrow={heroContent?.eyebrow || "Our expertise"}
				title={
					heroContent?.title || "Connected thinking across legal disciplines."
				}
				description={
					heroContent?.description ||
					"We advise through the full lifecycle of a business matter, bringing together transactional, regulatory and disputes experience."
				}
			/>
			<ExpertiseGrid practices={practices} />
			<ContactCtaSection />
		</>
	);
}
