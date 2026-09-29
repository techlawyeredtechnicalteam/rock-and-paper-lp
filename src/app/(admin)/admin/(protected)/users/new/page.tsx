import { UserForm } from "@/components/admin/users/UserForm";
import Link from "next/link";

export const metadata = { title: "New System User | Admin" };

export default function NewUserPage() {
	return (
		<>
			<div className="mb-8">
				<Link
					href="/admin/users"
					className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--royal)]">
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Users
				</Link>
				<h2 className="text-2xl font-semibold text-[var(--ink)]">
					New System User
				</h2>
			</div>
			<UserForm />
		</>
	);
}
