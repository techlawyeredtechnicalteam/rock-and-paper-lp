import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeft,
	Linkedin,
	Twitter,
	Mail,
	Link as LinkIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactCtaSection } from "@/components/home/contact-cta-section";
import { createPageMetadata } from "@/lib/seo";

// Helper to strip HTML for SEO and calculations
function stripHtml(html: string) {
	if (!html) return "";
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

// Helper to generate excerpt
function getExcerpt(html: string, length = 160) {
	const text = stripHtml(html);
	return text.length > length ? text.substring(0, length) + "..." : text;
}

// Helper to calculate estimated read time (avg 200 words per minute)
function getReadTime(html: string) {
	const text = stripHtml(html);
	const wordCount = text.split(/\s+/).length;
	const minutes = Math.ceil(wordCount / 200);
	return `${minutes} min read`;
}

async function getArticle(id: string) {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	try {
		const res = await fetch(`${baseUrl}/api/blogs/${id}`);
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
	const currentUrl = `https://rockandpaperlp.com/articles/${article.id}`;

	return (
		<>
			<article className="pb-20 sm:pb-32">
				{/* Hero / Header Section */}
				<header className="pt-20 pb-12 sm:pt-32">
					<Container>
						<div className="mx-auto max-w-4xl">
							{/* Meta & Title */}
							<div className="text-center">
								<div className="mb-6 flex items-center justify-center gap-4 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-taupe">
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

								<h1 className="font-serif text-4xl leading-[1.15] text-ink sm:text-5xl lg:text-6xl lg:leading-[1.1] text-balance">
									{article.title}
								</h1>
							</div>
						</div>
					</Container>
				</header>

				{/* Structured Author & Image Bar */}
				<Container className="mb-16 sm:mb-24">
					<div className="mx-auto max-w-5xl">
						<div className="flex flex-col border-y border-ink/10 sm:flex-row sm:items-center">
							{/* Author Info */}
							<div className="flex items-center gap-4 border-b border-ink/10 py-6 sm:w-1/3 sm:border-b-0 sm:border-r sm:py-8 sm:pr-8">
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
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.1em] text-muted mb-1">
										Written By
									</p>
									<p className="text-sm font-bold text-ink">
										{article.authorName}
									</p>
									{article.authorTitle && (
										<p className="text-xs text-muted mt-0.5">
											{article.authorTitle}
										</p>
									)}
								</div>
							</div>

							{/* Feature Image inside the structure */}
							<div className="relative aspect-[21/9] w-full sm:w-2/3 bg-navy overflow-hidden">
								{article.image ? (
									<Image
										src={article.image}
										alt={article.title}
										fill
										priority
										sizes="(max-width: 1024px) 100vw, 800px"
										className="object-cover saturate-[0.85] transition-all duration-700 hover:scale-105 hover:saturate-100"
									/>
								) : (
									<div className="absolute inset-0 bg-ink/5" />
								)}
							</div>
						</div>
					</div>
				</Container>

				{/* Article Body Grid */}
				<Container>
					<div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-12">
						{/* Sticky Sidebar (Desktop) / Top Bar (Mobile) */}
						<div className="lg:col-span-3">
							<div className="sticky top-32 flex flex-row items-center justify-between border-b border-ink/10 pb-6 lg:flex-col lg:items-start lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
								<Link
									href="/articles"
									className="group flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink lg:mb-12">
									<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
									Back <span className="hidden lg:inline">to articles</span>
								</Link>

								<div className="flex items-center gap-5 text-muted lg:flex-col lg:items-start lg:gap-6">
									<span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.2em] lg:block">
										Share
									</span>
									<a
										href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`}
										target="_blank"
										rel="noreferrer"
										className="hover:text-ink transition-colors"
										aria-label="Share on LinkedIn">
										<Linkedin className="size-4" />
									</a>
									<a
										href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodeURIComponent(
											article.title
										)}`}
										target="_blank"
										rel="noreferrer"
										className="hover:text-ink transition-colors"
										aria-label="Share on Twitter">
										<Twitter className="size-4" />
									</a>
									<a
										href={`mailto:?subject=${encodeURIComponent(
											article.title
										)}&body=${currentUrl}`}
										className="hover:text-ink transition-colors"
										aria-label="Share via Email">
										<Mail className="size-4" />
									</a>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-8">
							<div
								className="ql-editor-web !p-0 text-ink/85"
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
