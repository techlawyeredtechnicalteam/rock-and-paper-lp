import Link from "next/link";
import { ExperiencesList } from "@/components/admin/experiences/ExperiencesList";

export const metadata = {
	title: "Experience & Transactions | The Royal Partners Admin",
};

export default function ExperiencesPage() {
	return (
		<>
			<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-semibold text-[var(--ink)]">
						Experience & Transactions
					</h2>
					<p className="mt-2 text-base text-[var(--muted)]">
						Manage deal values, case studies, and transaction highlights.
					</p>
				</div>
				<Link
					href="/admin/experiences/create"
					className="flex items-center justify-center rounded-md bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)]">
					+ Add Experience
				</Link>
			</div>

			<ExperiencesList />
		</>
	);
}
