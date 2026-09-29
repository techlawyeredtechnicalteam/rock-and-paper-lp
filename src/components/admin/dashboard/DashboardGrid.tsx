"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

const adminModules = [
	{
		title: "Firm Details",
		description:
			"Manage global contact information, emails, phones, and operating hours.",
		href: "/admin/firm-detail",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
				/>
			</svg>
		),
	},
	{
		title: "Site Configuration",
		description:
			"Configure SEO metadata, site descriptions, and open-graph images.",
		href: "/admin/site-config",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
	},
	{
		title: "Practice Areas",
		description:
			"Add or update legal practice areas, descriptions, and specific services.",
		href: "/admin/practices",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
				/>
			</svg>
		),
	},
	{
		title: "Team Members",
		description:
			"Manage lawyer profiles, biographies, expertise, and headshots.",
		href: "/admin/people",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
		),
	},
	{
		title: "Experience & Transactions",
		description:
			"Showcase deal values, transaction highlights, and case studies.",
		href: "/admin/experiences",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
				/>
			</svg>
		),
	},
	{
		title: "Office Locations",
		description:
			"Update physical office addresses, cities, and location imagery.",
		href: "/admin/offices",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
	},
	{
		title: "Insights & Blogs",
		description:
			"Publish articles, legal updates, and thought leadership content.",
		href: "/admin/blogs",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.2-.9l-9-13a2 2 0 00-2.8 0L3.2 6.6"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M16 10h.01M16 14h.01M16 18h.01M8 10h.01M8 14h.01M8 18h.01M12 10h.01M12 14h.01M12 18h.01"
				/>
			</svg>
		),
	},
	{
		title: "Admin Users",
		description:
			"Manage staff access, passwords, and administrative privileges.",
		href: "/admin/users",
		icon: (
			<svg
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
		),
	},
];

type UserProfile = {
	id: string;
	role: "ADMIN" | "STAFF";
};

export function DashboardGrid() {
	const { data: user, isLoading } = useQuery<UserProfile>({
		queryKey: ["currentUser"],
		queryFn: async () => {
			const res = await fetch("/api/users/me");
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch user");
			return json.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<span className="text-sm font-medium text-[var(--muted)]">
					Loading dashboard modules...
				</span>
			</div>
		);
	}

	// Filter out "Admin Users" module if the current user is not an ADMIN
	const visibleModules = adminModules.filter((module) => {
		if (module.title === "Admin Users" && user?.role !== "ADMIN") {
			return false;
		}
		return true;
	});

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{visibleModules.map((module) => (
				<Link
					key={module.title}
					href={module.href}
					className="group flex flex-col justify-between rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm transition-all hover:border-[var(--color-navy)] hover:shadow-md">
					<div>
						<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--paper)] text-[var(--color-navy)] transition-colors group-hover:bg-[var(--color-navy)] group-hover:text-white">
							{module.icon}
						</div>
						<h3 className="mb-2 text-lg font-semibold text-[var(--ink)] group-hover:text-[var(--color-navy)] transition-colors">
							{module.title}
						</h3>
						<p className="text-sm text-[var(--muted)] leading-relaxed">
							{module.description}
						</p>
					</div>

					<div className="mt-6 flex items-center text-sm font-medium text-[var(--color-navy)] opacity-80 transition-opacity group-hover:opacity-100">
						Manage module
						<svg
							className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</Link>
			))}
		</div>
	);
}
