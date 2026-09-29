"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Experience = {
	id: string;
	value: string;
	title: string;
	description: string;
	image: string;
};

export function ExperiencesList() {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const {
		data: experiences,
		isLoading,
		isError,
	} = useQuery<Experience[]>({
		queryKey: ["experiences"],
		queryFn: async () => {
			const res = await fetch("/api/experiences");
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
	});

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this experience record?"))
			return;
		setIsDeleting(id);
		try {
			const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
			if (res.ok) {
				queryClient.invalidateQueries({ queryKey: ["experiences"] });
			} else {
				alert("Failed to delete experience.");
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
				Loading experiences...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="py-10 text-center text-sm text-red-500">
				Failed to load experiences.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm">
			<table className="w-full text-left text-sm text-[var(--ink)]">
				<thead className="border-b border-[var(--line)] bg-[var(--paper)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
					<tr>
						<th className="px-6 py-4">Title</th>
						<th className="px-6 py-4">Value</th>
						<th className="hidden px-6 py-4 md:table-cell">Description</th>
						<th className="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[var(--line)]">
					{experiences?.length === 0 ? (
						<tr>
							<td
								colSpan={4}
								className="px-6 py-8 text-center text-[var(--muted)]">
								No experiences found. Add one to get started.
							</td>
						</tr>
					) : (
						experiences?.map((exp) => (
							<tr key={exp.id} className="transition-colors hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">
									<div className="flex items-center gap-3">
										<div className="h-10 w-14 overflow-hidden rounded-md border border-[var(--line)] bg-gray-100 shrink-0">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={exp.image}
												alt={exp.title}
												className="h-full w-full object-cover"
											/>
										</div>
										{exp.title}
									</div>
								</td>
								<td className="px-6 py-4 text-[var(--muted)]">{exp.value}</td>
								<td className="hidden px-6 py-4 text-[var(--muted)] md:table-cell">
									<span className="line-clamp-1">{exp.description}</span>
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-3">
										<Link
											href={`/admin/experiences/${exp.id}`}
											className="font-medium text-[var(--royal)] hover:underline">
											Edit
										</Link>
										<button
											onClick={() => handleDelete(exp.id)}
											disabled={isDeleting === exp.id}
											className="font-medium text-red-500 hover:underline disabled:opacity-50">
											{isDeleting === exp.id ? "..." : "Delete"}
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
