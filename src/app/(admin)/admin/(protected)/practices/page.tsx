import Link from "next/link";
import { PracticesList } from "@/components/admin/practices/PracticesList";

export const metadata = {
	title: "Practice Areas | The Royal Partners Admin",
};

export default function PracticesPage() {
	return (
		<>
			<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-semibold text-[var(--ink)]">
						Practice Areas
					</h2>
					<p className="mt-2 text-base text-[var(--muted)]">
						Manage the firm's legal practice areas and services.
					</p>
				</div>
				<Link
					href="/admin/practices/create"
					className="flex items-center justify-center rounded-md bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)]">
					+ Add New Practice
				</Link>
			</div>

			<PracticesList />
		</>
	);
}
