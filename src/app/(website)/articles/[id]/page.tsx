import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";

// Import Quill styles so the rendered HTML matches your admin editor perfectly
import "react-quill-new/dist/quill.snow.css";

// Helper to strip HTML for SEO and calculations
function stripHtml(html: string) {
	if (!html) return "";
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

// Helper to generate excerpt for SEO description
function getExcerpt(html: string, length = 160) {
	const text = stripHtml(html);
	return text.length > length ? text.substring(0, length) + "..." : text;
}

// Helper to calculate estimated read time (avg 200 words per minute)
function getReadTime(html: string) {
	const text = stripHtml(html);
	const wordCount = text.split(/\s+/).length;
	const minutes = Math.ceil(wordCount / 200);
	return `${minutes} MIN READ`;
}

async function getArticle(id: string) {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	try {
		const res = await fetch(`${baseUrl}/api/blogs/${id}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) return null;
		const json = await res.json();
		return json.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}

// Dynamic SEO metadata
export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const article = await getArticle(resolvedParams.id);

	if (!article) return {};

	return await createPageMetadata({
		title: article.title,
		description: getExcerpt(article.body),
		path: `/articles/${article.id}`,
		// ogImage: article.image,
	});
}

export default async function ArticlePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	const article = await getArticle(resolvedParams.id);

	if (!article) {
		notFound();
	}

	const readTime = getReadTime(article.body);

	return (
		<>
			<article className="pb-20 sm:pb-32">
				{/* Minimalist Top Navigation Bar */}
				<div className="border-b border-ink/10">
					<Container>
						<div className="py-6 sm:py-8">
							<Link
								href="/articles"
								className="group inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink">
								<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
								Back to articles
							</Link>
						</div>
					</Container>
				</div>

				{/* Article Header (Centered & Impactful) */}
				<header className="pt-16 pb-12 sm:pt-24 sm:pb-16">
					<Container>
						<div className="mx-auto max-w-4xl text-center">
							<div className="mb-8 flex items-center justify-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-taupe">
								<span>Insight</span>
								<span className="h-1 w-1 rounded-full bg-ink/20" />
								<time dateTime={article.createdAt}>
									{new Date(article.createdAt).toLocaleDateString("en-NG", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</time>
								<span className="h-1 w-1 rounded-full bg-ink/20" />
								<span>{readTime}</span>
							</div>

							<h1 className="font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-[4.5rem] lg:leading-[1.05] text-balance">
								{article.title}
							</h1>
						</div>
					</Container>
				</header>

				{/* Wide Feature Image */}
				{article.image && (
					<Container className="mb-12 sm:mb-16">
						<div className="mx-auto max-w-5xl">
							<div className="relative aspect-[21/9] w-full overflow-hidden bg-navy">
								<Image
									src={article.image}
									alt={article.title}
									fill
									priority
									sizes="(max-width: 1024px) 100vw, 1024px"
									className="object-cover saturate-[0.85] transition-all duration-700 hover:scale-105 hover:saturate-100"
								/>
							</div>
						</div>
					</Container>
				)}

				{/* Content Container (Narrower for optimal reading) */}
				<Container>
					<div className="mx-auto max-w-3xl">
						{/* Elegant Author Byline Divider */}
						<div className="mb-12 flex items-center gap-5 border-y border-ink/10 py-6 sm:mb-16 sm:py-8">
							{article.authorImage ? (
								<Image
									src={article.authorImage}
									alt={article.authorName}
									width={56}
									height={56}
									className="size-12 rounded-full object-cover sm:size-14"
								/>
							) : (
								<div className="flex size-12 items-center justify-center rounded-full bg-navy text-sm font-bold text-white uppercase sm:size-14">
									{article.authorName.charAt(0)}
								</div>
							)}
							<div className="flex flex-col justify-center">
								<p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-muted mb-1">
									Written By
								</p>
								<p className="text-base font-bold text-ink sm:text-lg leading-none">
									{article.authorName}
								</p>
								{article.authorTitle && (
									<p className="text-sm text-muted mt-1">
										{article.authorTitle}
									</p>
								)}
							</div>
						</div>

						{/* Rich Text Editor Content */}
						<div className="ql-snow">
							<div
								className="ql-editor-web !p-0 !min-h-0 text-ink/85 sm:text-lg"
								dangerouslySetInnerHTML={{ __html: article.body }}
							/>
						</div>
					</div>
				</Container>
			</article>

			<ContactCtaSection />
		</>
	);
}
