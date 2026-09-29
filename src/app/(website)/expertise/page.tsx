import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseGrid } from "@/components/expertise/expertise-grid";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";
import { Practice } from "@/components/home/practice-areas-section";

export async function generateMetadata(): Promise<Metadata> {
	return await createPageMetadata({
		title: "Expertise",
		description: "Explore the practice areas of Rock & Paper LP.",
		path: "/expertise",
	});
}

export default async function ExpertisePage() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let practices: Practice[] = [];

	try {
		// Fetch both endpoints concurrently
		const [pracRes] = await Promise.all([
			fetch(`${baseUrl}/api/practices`, { next: { revalidate: 3600 } }),
		]);

		if (pracRes.ok) {
			const json = await pracRes.json();
			practices = json.data || [];
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

	return (
		<>
			<PageHero
				eyebrow="Our expertise"
				title="Connected thinking across legal disciplines."
				description="We advise through the full lifecycle of a business matter, bringing together transactional, regulatory and disputes experience."
			/>
			<ExpertiseGrid practices={practices} />
			<ContactCtaSection />
		</>
	);
}
