"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Practice = {
	id: string;
	title: string;
	slug: string;
	shortDescription: string;
	createdAt: string;
};

export function PracticesList() {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const {
		data: practices,
		isLoading,
		isError,
	} = useQuery<Practice[]>({
		queryKey: ["practices"],
		queryFn: async () => {
			const res = await fetch("/api/practices");
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
	});

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this practice area?")) return;
		setIsDeleting(id);
		try {
			const res = await fetch(`/api/practices/${id}`, { method: "DELETE" });
			if (res.ok) {
				// Invalidate and refetch
				queryClient.invalidateQueries({ queryKey: ["practices"] });
			} else {
				alert("Failed to delete practice.");
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
				Loading practices...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="py-10 text-center text-sm text-red-500">
				Failed to load practices.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm">
			<table className="w-full text-left text-sm text-[var(--ink)]">
				<thead className="border-b border-[var(--line)] bg-[var(--paper)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
					<tr>
						<th className="px-6 py-4">Title</th>
						<th className="px-6 py-4">Slug</th>
						<th className="hidden px-6 py-4 md:table-cell">
							Short Description
						</th>
						<th className="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[var(--line)]">
					{practices?.length === 0 ? (
						<tr>
							<td
								colSpan={4}
								className="px-6 py-8 text-center text-[var(--muted)]">
								No practice areas found. Create one to get started.
							</td>
						</tr>
					) : (
						practices?.map((practice) => (
							<tr
								key={practice.id}
								className="transition-colors hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">{practice.title}</td>
								<td className="px-6 py-4 text-[var(--muted)]">
									{practice.slug}
								</td>
								<td className="hidden px-6 py-4 text-[var(--muted)] md:table-cell">
									<span className="line-clamp-1">
										{practice.shortDescription}
									</span>
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-3">
										<Link
											href={`/admin/practices/${practice.id}`}
											className="font-medium text-[var(--royal)] hover:underline">
											Edit
										</Link>
										<button
											onClick={() => handleDelete(practice.id)}
											disabled={isDeleting === practice.id}
											className="font-medium text-red-500 hover:underline disabled:opacity-50">
											{isDeleting === practice.id ? "..." : "Delete"}
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
