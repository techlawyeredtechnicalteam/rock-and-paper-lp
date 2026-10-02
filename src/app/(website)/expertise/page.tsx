import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseGrid } from "@/components/expertise/expertise-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { Practice } from "@/components/home/practice-areas-section";
import { PageSection } from "@/generated/prisma/client";

export async function generateMetadata(): Promise<Metadata> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	let seo: any = {};

	try {
		const res = await fetch(`${baseUrl}/api/page-seo?page=expertise`, {
			next: { revalidate: 3600 },
		});
		if (res.ok) {
			const json = await res.json();
			seo = json.data || {};
		}
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
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let practices: Practice[] = [];
	let contents: PageSection[] = [];

	try {
		const [pracRes, contentRes] = await Promise.all([
			fetch(`${baseUrl}/api/practices`),
			fetch(`${baseUrl}/api/page-content?page=expertise`),
		]);

		if (pracRes.ok) {
			const json = await pracRes.json();
			practices = json.data || [];
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
