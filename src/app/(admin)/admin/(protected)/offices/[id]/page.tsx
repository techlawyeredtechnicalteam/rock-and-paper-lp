import { OfficeForm } from "@/components/admin/offices/OfficeForm";
import Link from "next/link";

export const metadata = {
	title: "Edit Office | The Royal Partners Admin",
};

export default async function EditOfficePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;

	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/offices"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Offices
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Edit Office Location
				</h2>
			</div>
			<OfficeForm officeId={id} />
		</>
	);
}
