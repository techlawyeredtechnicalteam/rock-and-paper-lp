"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type User = {
	id: string;
	fullName: string;
	email: string;
	role: "ADMIN" | "STAFF";
	profilePicture: string | null;
};

export function UserList() {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const {
		data: users,
		isLoading,
		isError,
	} = useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			// Handles both {ok: true, data: []} and direct array responses
			return json.data || json;
		},
	});

	const handleDelete = async (id: string, fullName: string) => {
		if (
			!window.confirm(
				`Are you sure you want to permanently revoke access for ${fullName}?`
			)
		)
			return;

		setIsDeleting(id);
		try {
			const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
			const json = await res.json();

			if (res.ok) {
				queryClient.invalidateQueries({ queryKey: ["users"] });
			} else {
				alert(json.error || "Failed to delete user.");
			}
		} catch (error) {
			console.error("Delete error:", error);
			alert("An error occurred while trying to delete the user.");
		} finally {
			setIsDeleting(null);
		}
	};

	// Helper for avatar fallback
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.substring(0, 2)
			.toUpperCase();
	};

	if (isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading system users...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="py-10 text-center text-sm text-red-500">
				Failed to load system users.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm">
			<table className="w-full text-left text-sm text-[var(--ink)]">
				<thead className="border-b border-[var(--line)] bg-[var(--paper)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
					<tr>
						<th className="px-6 py-4">User</th>
						<th className="px-6 py-4">Email Address</th>
						<th className="px-6 py-4">Role</th>
						<th className="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[var(--line)]">
					{users?.length === 0 ? (
						<tr>
							<td
								colSpan={4}
								className="px-6 py-8 text-center text-[var(--muted)]">
								No users found.
							</td>
						</tr>
					) : (
						users?.map((user) => (
							<tr key={user.id} className="transition-colors hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--royal)]/10 text-xs font-bold text-[var(--royal)]">
											{user.profilePicture ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={user.profilePicture}
													alt={user.fullName}
													className="h-full w-full object-cover object-top"
												/>
											) : (
												getInitials(user.fullName)
											)}
										</div>
										{user.fullName}
									</div>
								</td>
								<td className="px-6 py-4 text-[var(--muted)]">{user.email}</td>
								<td className="px-6 py-4">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
											user.role === "ADMIN"
												? "bg-[var(--royal)]/10 text-[var(--royal)]"
												: "bg-gray-100 text-gray-800"
										}`}>
										{user.role}
									</span>
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-3">
										<Link
											href={`/admin/users/${user.id}`}
											className="font-medium text-[var(--royal)] hover:underline">
											Edit
										</Link>
										<button
											onClick={() => handleDelete(user.id, user.fullName)}
											disabled={isDeleting === user.id}
											className="font-medium text-red-500 hover:underline disabled:opacity-50">
											{isDeleting === user.id ? "..." : "Delete"}
										</button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
