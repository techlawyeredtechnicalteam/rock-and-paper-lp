import { FirmDetailForm } from "@/components/admin/firm-detail/FirmDetailForm";

export const metadata = {
	title: "Firm Settings | The Royal Partners Admin",
};

export default function FirmSettingsPage() {
	return (
		<>
			<div className="mb-10">
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Firm Details
				</h2>
				<p className="mt-2 text-base text-[var(--muted)]">
					Update global contact information, and social media links.
				</p>
			</div>

			<FirmDetailForm />
		</>
	);
}
