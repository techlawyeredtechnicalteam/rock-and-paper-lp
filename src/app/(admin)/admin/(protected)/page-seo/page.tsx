import { PageSeoForm } from "@/components/admin/page-seo/PageSeoForm";

export const metadata = {
	title: "SEO Management | Admin Dashboard",
};

export default function SeoManagementPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-[var(--ink)]">
					SEO Management
				</h1>
				<p className="mt-1 text-sm text-[var(--muted)]">
					Manage meta titles, descriptions, and Open Graph images for your
					public pages to optimize search engine ranking and social sharing.
				</p>
			</div>

			<PageSeoForm />
		</div>
	);
}
