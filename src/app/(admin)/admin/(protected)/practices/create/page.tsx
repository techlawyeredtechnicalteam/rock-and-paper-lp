import { PracticeForm } from "@/components/admin/practices/PracticeForm";
import Link from "next/link";

export const metadata = {
	title: "Add Practice Area | The Royal Partners Admin",
};

export default function CreatePracticePage() {
	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/practices"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Practices
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Add New Practice Area
				</h2>
			</div>
			<PracticeForm />
		</>
	);
}
