import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight, Download } from "lucide-react";
import { Container } from "@/components/ui/container";

export type Article = {
	id: string;
	title: string;
	body?: string | null;
	fileUrl?: string | null;
	authorName: string;
	authorTitle?: string | null;
	authorImage?: string | null;
	image: string;
	createdAt: string | Date;
	slug: string;
};

interface ArticleListProps {
	articles: Article[];
	currentPage: number;
	totalPages: number;
}

// Check if rich text HTML actually contains non-empty text content
function hasBodyContent(html?: string | null) {
	if (!html) return false;
	const text = html
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.trim();
	return text.length > 0;
}

export function ArticleList({
	articles,
	currentPage,
	totalPages,
}: ArticleListProps) {
	if (!articles || articles.length === 0) {
		return (
			<section className="py-20 sm:py-32">
				<Container>
					<p className="text-center text-lg text-muted">
						No articles published yet. Check back later.
					</p>
				</Container>
			</section>
		);
	}

	return (
		<section className="py-20 sm:py-28">
			<Container>
				<div className="grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
					{articles.map((article) => {
						const showView = hasBodyContent(article.body);
						const showDownload = Boolean(article.fileUrl?.trim());

						return (
							<article
								key={article.id}
								className="group flex flex-col overflow-hidden">
								<div className="relative aspect-[4/3] w-full overflow-hidden bg-navy">
									{article.image ? (
										<Image
											src={article.image}
											alt={article.title}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover saturate-[0.75] transition duration-500 group-hover:scale-[1.035] group-hover:saturate-100"
										/>
									) : (
										<div className="absolute inset-0 bg-ink/5 transition-colors group-hover:bg-transparent" />
									)}
								</div>

								<div className="mt-6 flex flex-1 flex-col">
									<div className="mb-4 flex items-center justify-between text-[0.68rem] font-bold uppercase tracking-[0.18em] text-taupe">
										<span>Insight</span>
										<span>
											{new Date(article.createdAt).toLocaleDateString("en-NG", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</span>
									</div>

									<h3 className="font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-taupe">
										{article.title}
									</h3>

									{(showView || showDownload) && (
										<div className="mt-5 flex flex-wrap items-center gap-3">
											{showView && (
												<Link
													href={`/articles/${article.slug}`}
													className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white">
													View
													<ArrowUpRight className="size-3.5" />
												</Link>
											)}
											{showDownload && (
												<a
													href={article.fileUrl!}
													download
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 bg-navy px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink">
													Download
													<Download className="size-3.5" />
												</a>
											)}
										</div>
									)}

									<div className="mt-auto pt-6">
										<div className="flex items-center justify-between border-t border-ink/5 pt-4">
											<div className="flex items-center gap-3">
												{article.authorImage ? (
													<Image
														src={article.authorImage}
														alt={article.authorName}
														width={32}
														height={32}
														className="size-8 rounded-full object-cover"
													/>
												) : (
													<div className="flex size-8 items-center justify-center rounded-full bg-ink/5 text-xs font-bold text-ink uppercase">
														{article.authorName.charAt(0)}
													</div>
												)}
												<div className="flex flex-col">
													<span className="text-xs font-bold text-ink">
														{article.authorName}
													</span>
													{article.authorTitle && (
														<span className="text-[0.65rem] text-muted">
															{article.authorTitle}
														</span>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</article>
						);
					})}
				</div>

				{/* Pagination Controls */}
				{totalPages > 1 && (
					<div className="mt-20 flex items-center justify-between border-t border-ink/10 pt-8">
						{currentPage > 1 ? (
							<Link
								href={`/articles?page=${currentPage - 1}`}
								className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-taupe">
								<ArrowLeft className="size-4" /> Previous
							</Link>
						) : (
							<span />
						)}

						<span className="text-sm font-medium text-muted">
							Page {currentPage} of {totalPages}
						</span>

						{currentPage < totalPages ? (
							<Link
								href={`/articles?page=${currentPage + 1}`}
								className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-taupe">
								Next <ArrowRight className="size-4" />
							</Link>
						) : (
							<span />
						)}
					</div>
				)}
			</Container>
		</section>
	);
}
