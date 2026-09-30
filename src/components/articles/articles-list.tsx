import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";

export type Article = {
	id: string;
	title: string;
	body: string;
	authorName: string;
	authorTitle?: string | null;
	authorImage?: string | null;
	image: string;
	createdAt: string | Date;
};

interface ArticleListProps {
	articles: Article[];
	currentPage: number;
	totalPages: number;
}

// Utility to convert rich text HTML into a clean plain text excerpt
function getExcerpt(html: string) {
	if (!html) return "";
	return html
		.replace(/<[^>]+>/g, " ") // Replace all HTML tags with a space
		.replace(/&nbsp;/g, " ") // Decode spaces
		.replace(/&amp;/g, "&") // Decode ampersands
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ") // Collapse multiple spaces into one
		.trim();
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
					{articles.map((article) => (
						<Link
							key={article.id}
							href={`/articles/${article.id}`}
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

								{/* 
                                    Using our getExcerpt helper to strip HTML tags so 
                                    the line-clamp-3 CSS works perfectly on pure text.
                                */}
								<p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">
									{getExcerpt(article.body)}
								</p>

								<div className="mt-8 flex items-center justify-between pt-4 border-t border-ink/5">
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
									<ArrowUpRight className="size-5 text-ink/30 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-taupe" />
								</div>
							</div>
						</Link>
					))}
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
