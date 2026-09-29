import { BlogForm } from "@/components/admin/blogs/BlogForm";
import Link from "next/link";

export const metadata = {
	title: "Write Article | The Royal Partners Admin",
};

export default function CreateBlogPage() {
	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/blogs"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Blogs
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Write New Article
				</h2>
			</div>
			<BlogForm />
		</>
	);
}
