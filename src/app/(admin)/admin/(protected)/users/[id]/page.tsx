import { UserForm } from "@/components/admin/users/UserForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit System User | Admin" };

export default async function EditUserPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const dbUser = await prisma.user.findUnique({
		where: { id },
		select: { id: true, email: true, fullName: true, role: true },
	});

	if (!dbUser) {
		notFound();
	}

	const user = { ...dbUser, name: dbUser.fullName };

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
					Edit System User
				</h2>
			</div>
			{/* Pass user to the form. It will not include a password field string by default, making the password input blank on mount. */}
			<UserForm initialData={{ ...user, password: "" }} />
		</>
	);
}
