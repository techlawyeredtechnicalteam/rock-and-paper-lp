import Link from "next/link";
import { OfficesList } from "@/components/admin/offices/OfficesList";

export const metadata = {
	title: "Office Locations | The Royal Partners Admin",
};

export default function OfficesPage() {
	return (
		<>
			<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-semibold text-[var(--ink)]">
						Office Locations
					</h2>
					<p className="mt-2 text-base text-[var(--muted)]">
						Manage physical office addresses, cities, and imagery.
					</p>
				</div>
				<Link
					href="/admin/offices/create"
					className="flex items-center justify-center rounded-md bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)]">
					+ Add Office
				</Link>
			</div>

			<OfficesList />
		</>
	);
}
