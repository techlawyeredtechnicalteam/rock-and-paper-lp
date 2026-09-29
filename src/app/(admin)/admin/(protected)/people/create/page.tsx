import { PersonForm } from "@/components/admin/people/PersonForm";
import Link from "next/link";

export const metadata = {
	title: "Add Team Member | The Royal Partners Admin",
};

export default function CreatePersonPage() {
	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/people"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Team
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Add New Team Member
				</h2>
			</div>
			<PersonForm />
		</>
	);
}
