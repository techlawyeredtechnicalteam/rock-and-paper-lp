import { DashboardGrid } from "@/components/admin/dashboard/DashboardGrid";

export const metadata = {
	title: "Dashboard | The Royal Partners Admin",
};

export default function AdminDashboardPage() {
	return (
		<>
			<div className="mb-10">
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					Welcome to the Dashboard
				</h2>
				<p className="mt-2 text-base text-[var(--muted)]">
					Select a module below to manage the website's content.
				</p>
			</div>

			<DashboardGrid />
		</>
	);
}
