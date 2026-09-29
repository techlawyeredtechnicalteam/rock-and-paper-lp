import { ExperienceForm } from "@/components/admin/experiences/ExperienceForm";
import Link from "next/link";

export const metadata = {
	title: "Add Experience | The Royal Partners Admin",
};

export default function CreateExperiencePage() {
	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/experiences"
					className="mb-4 inline-flex items-center text-sm font-medium text-[var(--muted)] hover:text-[var(--royal)]">
					&larr; Back to Experiences
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Add New Transaction Record
				</h2>
			</div>
			<ExperienceForm />
		</>
	);
}
