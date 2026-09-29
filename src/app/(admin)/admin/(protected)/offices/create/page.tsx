import { OfficeForm } from "@/components/admin/offices/OfficeForm";
import Link from "next/link";

export const metadata = {
	title: "Add Office | The Royal Partners Admin",
};

export default function CreateOfficePage() {
	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/offices"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Offices
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Add New Office
				</h2>
			</div>
			<OfficeForm />
		</>
	);
}
