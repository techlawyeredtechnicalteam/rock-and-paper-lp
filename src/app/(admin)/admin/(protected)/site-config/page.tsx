import { SiteConfigForm } from "@/components/admin/site-config/SiteConfigForm";

export const metadata = {
	title: "Site Configuration | The Royal Partners Admin",
};

export default function SiteConfigPage() {
	return (
		<>
			<div className="mb-10">
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Site Configuration
				</h2>
				<p className="mt-2 text-base text-[var(--muted)]">
					Manage SEO metadata, default sharing images, and site branding.
				</p>
			</div>

			<SiteConfigForm />
		</>
	);
}
