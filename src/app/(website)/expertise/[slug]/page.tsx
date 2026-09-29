import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseDetail } from "@/components/expertise/expertise-detail";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { getPractice, practices } from "@/content/practices";
import { createPageMetadata } from "@/lib/seo";
import { Practice } from "@/components/home/practice-areas-section";

export function generateStaticParams() {
	return practices.map((practice) => ({ slug: practice.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const practice = getPractice(slug);
	if (!practice) return {};
	return await createPageMetadata({
		title: practice.title,
		description: practice.shortDescription,
		path: `/expertise/${practice.slug}`,
	});
}

export default async function PracticePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	let practice: Practice | null = null;

	try {
		// Fetch both endpoints concurrently
		const [pracRes] = await Promise.all([
			fetch(`${baseUrl}/api/practices/${slug}`, { cache: "no-store" }),
		]);

		if (pracRes.ok) {
			const json = await pracRes.json();
			practice = json.data || [];
		}
	} catch (error) {
		console.error("Failed to fetch homepage data:", error);
	}

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
