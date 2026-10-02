"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Person = {
	id: string;
	name: string;
	slug: string;
	order: number;
	expertise: string[];
	image: string;
};

export function PeopleList() {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const {
		data: people,
		isLoading,
		isError,
	} = useQuery<Person[]>({
		queryKey: ["people"],
		queryFn: async () => {
			const res = await fetch("/api/people");
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
	});

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this team member?")) return;
		setIsDeleting(id);
		try {
			const res = await fetch(`/api/people/${id}`, { method: "DELETE" });
			if (res.ok) {
				queryClient.invalidateQueries({ queryKey: ["people"] });
			} else {
				alert("Failed to delete person.");
			}
		} catch (error) {
			console.error("Delete error:", error);
		} finally {
			setIsDeleting(null);
		}
	};

	if (isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading team members...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="py-10 text-center text-sm text-red-500">
				Failed to load team members.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm">
			<table className="w-full text-left text-sm text-[var(--ink)]">
				<thead className="border-b border-[var(--line)] bg-[var(--paper)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
					<tr>
						<th className="px-6 py-4">Name</th>
						<th className="px-6 py-4 text-center">Order</th>
						<th className="px-6 py-4">Slug</th>
						<th className="hidden px-6 py-4 md:table-cell">Expertise</th>
						<th className="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[var(--line)]">
					{people?.length === 0 ? (
						<tr>
							<td
								colSpan={5}
								className="px-6 py-8 text-center text-[var(--muted)]">
								No team members found. Add one to get started.
							</td>
						</tr>
					) : (
						people?.map((person) => (
							<tr
								key={person.id}
								className="transition-colors hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">
									<div className="flex items-center gap-3">
										<div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[var(--line)] bg-gray-100">
											<img
												src={person.image}
												alt={person.name}
												className="h-full w-full object-cover"
											/>
										</div>
										{person.name}
									</div>
								</td>
								<td className="px-6 py-4 text-center font-mono text-[var(--muted)]">
									{person.order}
								</td>
								<td className="px-6 py-4 text-[var(--muted)]">{person.slug}</td>
								<td className="hidden px-6 py-4 text-[var(--muted)] md:table-cell">
									<span className="line-clamp-1">
										{person.expertise.join(", ")}
									</span>
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-3">
										<Link
											href={`/admin/people/${person.slug}`}
											className="font-medium text-[var(--royal)] hover:underline">
											Edit
										</Link>
										<button
											onClick={() => handleDelete(person.id)}
											disabled={isDeleting === person.id}
											className="font-medium text-red-500 hover:underline disabled:opacity-50">
											{isDeleting === person.id ? "..." : "Delete"}
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
