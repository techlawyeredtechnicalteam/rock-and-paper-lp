import Link from "next/link";
import { PeopleList } from "@/components/admin/people/PeopleList";

export const metadata = {
	title: "Team Members | The Royal Partners Admin",
};

export default function PeoplePage() {
	return (
		<>
			<div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-2xl font-semibold text-[var(--ink)]">
						Team Members
					</h2>
					<p className="mt-2 text-base text-[var(--muted)]">
						Manage lawyer profiles, expertise, and biographies.
					</p>
				</div>
				<Link
					href="/admin/people/create"
					className="flex items-center justify-center rounded-md bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)]">
					+ Add Team Member
				</Link>
			</div>

			<PeopleList />
		</>
	);
}
