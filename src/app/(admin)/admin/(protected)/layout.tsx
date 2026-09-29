"use client";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ProtectedAdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<div className="min-h-screen bg-[var(--paper)]">
				<DashboardHeader />

				<main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
			</div>
		</QueryClientProvider>
	);
}
