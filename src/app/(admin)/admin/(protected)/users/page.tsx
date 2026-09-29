import Link from "next/link";
import { UserList } from "@/components/admin/users/UserList";

export const metadata = { title: "System Users | Admin" };

export default function UsersPage() {
	return (
		<>
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold text-[var(--ink)]">
						System Users
					</h2>
					<p className="mt-1 text-sm text-[var(--muted)]">
						Manage who has access to the CMS admin panel.
					</p>
				</div>
				<Link
					href="/admin/users/new"
					className="flex items-center justify-center rounded-md bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)]">
					<span className="text-white">+ Add User</span>
				</Link>
			</div>
			<UserList />
		</>
	);
}
