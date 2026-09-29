import Link from "next/link";
import { BlogsList } from "@/components/admin/blogs/BlogsList";

export const metadata = {
	title: "Insights & Blogs | The Royal Partners Admin",
};

export default function BlogsPage() {
	return (
		<>
			<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-semibold text-[var(--ink)]">
						Insights & Blogs
					</h2>
					<p className="mt-2 text-base text-[var(--muted)]">
						Publish legal updates, thought leadership, and firm news.
					</p>
				</div>
				<Link
					href="/admin/blogs/create"
					className="flex items-center justify-center rounded-md bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)]">
					+ Write Article
				</Link>
			</div>

			<BlogsList />
		</>
	);
}
