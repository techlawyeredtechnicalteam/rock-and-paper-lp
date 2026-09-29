import { BlogForm } from "@/components/admin/blogs/BlogForm";
import Link from "next/link";

export const metadata = {
	title: "Edit Article | The Royal Partners Admin",
};

export default async function EditBlogPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;

	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/blogs"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Blogs
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Edit Article
				</h2>
			</div>
			<BlogForm blogId={id} />
		</>
	);
}
