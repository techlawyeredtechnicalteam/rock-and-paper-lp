"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Blog = {
	id: string;
	title: string;
	authorName: string;
	published: boolean;
	image: string;
	createdAt: string;
};

export function BlogsList() {
	const queryClient = useQueryClient();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const {
		data: blogs,
		isLoading,
		isError,
	} = useQuery<Blog[]>({
		queryKey: ["blogs"],
		queryFn: async () => {
			const res = await fetch("/api/blogs");
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
	});

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this article?")) return;
		setIsDeleting(id);
		try {
			const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
			if (res.ok) {
				queryClient.invalidateQueries({ queryKey: ["blogs"] });
			} else {
				alert("Failed to delete blog.");
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
				Loading insights...
			</div>
		);
	}

	if (isError) {
		return (
			<div className="py-10 text-center text-sm text-red-500">
				Failed to load insights.
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm">
			<table className="w-full text-left text-sm text-[var(--ink)]">
				<thead className="border-b border-[var(--line)] bg-[var(--paper)] text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
					<tr>
						<th className="px-6 py-4">Title</th>
						<th className="px-6 py-4">Author</th>
						<th className="px-6 py-4">Status</th>
						<th className="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[var(--line)]">
					{blogs?.length === 0 ? (
						<tr>
							<td
								colSpan={4}
								className="px-6 py-8 text-center text-[var(--muted)]">
								No articles found. Write one to get started.
							</td>
						</tr>
					) : (
						blogs?.map((blog) => (
							<tr key={blog.id} className="transition-colors hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">
									<div className="flex items-center gap-3">
										<div className="h-10 w-14 overflow-hidden rounded-md border border-[var(--line)] bg-gray-100 shrink-0">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={blog.image}
												alt={blog.title}
												className="h-full w-full object-cover"
											/>
										</div>
										<span className="line-clamp-2 max-w-xs">{blog.title}</span>
									</div>
								</td>
								<td className="px-6 py-4 text-[var(--muted)]">
									{blog.authorName}
								</td>
								<td className="px-6 py-4">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
											blog.published
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}>
										{blog.published ? "Published" : "Draft"}
									</span>
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-3">
										<Link
											href={`/admin/blogs/${blog.id}`}
											className="font-medium text-[var(--royal)] hover:underline">
											Edit
										</Link>
										<button
											onClick={() => handleDelete(blog.id)}
											disabled={isDeleting === blog.id}
											className="font-medium text-red-500 hover:underline disabled:opacity-50">
											{isDeleting === blog.id ? "..." : "Delete"}
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
