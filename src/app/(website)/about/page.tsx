import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { AboutNarrative } from "@/components/about/about-narrative";
import { AboutEthos } from "@/components/about/about-ethos";
import { AboutExperience } from "@/components/about/about-experience";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { PageSection } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let seo: any = {};

	try {
		const record = await prisma.pageSeo.findUnique({
			where: { pageSlug: "about" },
		});
		if (record) seo = record;
	} catch (error) {
		console.error("Failed to fetch about page SEO:", error);
	}

	return await createPageMetadata({
		title: seo.title || "About",
		description:
			seo.description ||
			"Learn about Rock & Paper LP, our approach and representative experience.",
		path: "/about",
		ogImage: seo.ogImage || undefined,
	});
}

export default async function AboutPage() {
	let contents: PageSection[] = [];

	try {
		contents = await prisma.pageSection.findMany({
			where: { pageSlug: "about" },
		});
	} catch (error) {
		console.error("Failed to fetch about page data:", error);
	}

	const formattedContents = contents.reduce((acc: any, section: any) => {
		acc[section.sectionKey] = section;
		return acc;
	}, {});

	const heroContent = formattedContents["hero"];

	return (
		<>
			<PageHero
				eyebrow={heroContent?.eyebrow || "About us"}
				title={
					heroContent?.title || "Legal depth with a practical point of view."
				}
				description={
					heroContent?.description ||
					"We combine careful legal analysis with a clear understanding of the businesses and people we advise."
				}
			/>
			<AboutNarrative content={formattedContents["narrative"]} />
			<AboutEthos content={formattedContents["approach"]} />
			<AboutExperience content={formattedContents["experience"]} />
			<ContactCtaSection />
		</>
	);
}
