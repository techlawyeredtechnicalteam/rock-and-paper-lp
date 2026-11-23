import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/page-hero";
import { ExpertiseDetail } from "@/components/expertise/expertise-detail";
import { ContactCtaSection } from "@/components/home/contact-cta-section";

import { createPageMetadata } from "@/lib/seo";
import { Practice } from "@/components/home/practice-areas-section";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPractice(slug: string): Promise<Practice | null> {
	try {
		return await prisma.practice.findUnique({
			where: { slug },
		});
	} catch (error) {
		console.error("Failed to fetch practice:", error);
		return null;
	}
}
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const practice = await getPractice(slug);
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
	const practice = await getPractice(slug);

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
