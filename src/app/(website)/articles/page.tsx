import type { Metadata } from "next";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { PageHero } from "@/components/ui/page-hero";
import { ArticleList, type Article } from "@/components/articles/articles-list";
import { createPageMetadata } from "@/lib/seo";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	let seo: any = {};

	try {
		const record = await prisma.pageSeo.findUnique({
			where: { pageSlug: "articles" },
		});
		if (record) seo = record;
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
	const resolvedParams = await searchParams;
	const page =
		typeof resolvedParams.page === "string"
			? parseInt(resolvedParams.page, 10)
			: 1;
	const limit = 10;
	const skip = (page - 1) * limit;

	let articles: Article[] = [];
	let totalPages = 1;

	try {
		const where = { published: true };
		const [blogs, totalCount] = await Promise.all([
			prisma.blog.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.blog.count({ where }),
		]);

		articles = blogs;
		totalPages = Math.ceil(totalCount / limit) || 1;
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
