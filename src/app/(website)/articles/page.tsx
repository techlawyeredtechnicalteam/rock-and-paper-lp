import type { Metadata } from "next";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { ArticleList, type Article } from "@/components/articles/articles-list";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	let seo: any = {};

	try {
		const res = await fetch(`${baseUrl}/api/page-seo?page=articles`, {
			next: { revalidate: 3600 },
		});
		if (res.ok) {
			const json = await res.json();
			seo = json.data || {};
		}
	} catch (error) {
		console.error("Failed to fetch articles page SEO:", error);
	}

	return await createPageMetadata({
		title: seo.title || "Articles",
		description:
			seo.description || "Practical legal perspectives from Rock & Paper LP.",
		ogImage: seo.ogImage || undefined,
		path: "/articles",
	});
}

interface ArticlesPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArticlesPage({
	searchParams,
}: ArticlesPageProps) {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	const resolvedParams = await searchParams;
	const page =
		typeof resolvedParams.page === "string"
			? parseInt(resolvedParams.page, 10)
			: 1;
	const limit = 1;

	let articles: Article[] = [];
	let totalPages = 1;

	try {
		const res = await fetch(
			`${baseUrl}/api/blogs?page=${page}&limit=${limit}&published=true`
		);

		if (res.ok) {
			const json = await res.json();
			articles = json.data || [];
			totalPages = json.meta?.totalPages || 1;
		}
	} catch (error) {
		console.error("Failed to fetch articles:", error);
	}

	return (
		<>
			<PageHero
				eyebrow="Articles"
				title="Practical perspectives."
				description="Our thinking on the legal, commercial, and regulatory developments shaping the markets we operate in."
			/>

			<ArticleList
				articles={articles}
				currentPage={page}
				totalPages={totalPages}
			/>

			<ContactCtaSection />
		</>
	);
}
