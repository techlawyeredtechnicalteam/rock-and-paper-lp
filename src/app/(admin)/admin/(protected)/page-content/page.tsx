import { PageContentForm } from "@/components/admin/page-content/PageContentForm";

export const metadata = {
	title: "Manage Page Content | Admin Dashboard",
};

export default function AdminPageContent() {
	return (
		<div className="mx-auto max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold  text-[var(--ink)]">
					Page Content
				</h1>
				<p className="mt-2 text-sm text-[var(--muted)]">
					Update hero texts, section headings, and specific content across the
					site.
				</p>
			</div>

			<PageContentForm />
		</div>
	);
}
