"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

type UserProfile = {
	id: string;
	name: string;
	email: string;
	profilePicture: string | null;
};

export function DashboardHeader() {
	const router = useRouter();
	const pathname = usePathname();
	const isDashboard = pathname === "/admin/dashboard";

	const [user, setUser] = useState<UserProfile | null>(null);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	// Fetch the current user on mount
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/users/me");
				const json = await res.json();
				if (json.ok && json.data) {
					setUser(json.data);
				}
			} catch (error) {
				console.error("Failed to load user profile:", error);
			}
		};
		fetchUser();
	}, []);

	const handleLogout = async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		router.push("/admin/login");
		router.refresh();
	};

	const handleProfilePicChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file || !user) return;

		setIsUploading(true);
		setUploadError(null);

		try {
			// 1. Get Presigned URL
			const res = await fetch("/api/upload", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ contentType: file.type }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to get upload URL");
			const { uploadUrl: url, fileUrl: finalUrl } = data;

			// 2. Upload to S3
			const uploadRes = await fetch(url, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			});
			if (!uploadRes.ok) throw new Error("Failed to upload image to S3");

			// 3. Update User Profile in DB
			const updateRes = await fetch("/api/users/me", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ profilePicture: finalUrl }),
			});
			const updateData = await updateRes.json();
			if (!updateRes.ok)
				throw new Error(updateData.error || "Failed to update profile");

			// Update local state
			setUser(updateData.data);
		} catch (error: any) {
			console.error("Profile Upload Error:", error);
			setUploadError(error.message || "Failed to update profile picture.");
		} finally {
			setIsUploading(false);
			e.target.value = ""; // Reset input
		}
	};

	const handleRemoveProfilePic = async () => {
		setIsUploading(true);
		setUploadError(null);
		try {
			const updateRes = await fetch("/api/users/me", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ profilePicture: null }),
			});
			const updateData = await updateRes.json();
			if (!updateRes.ok)
				throw new Error(updateData.error || "Failed to update profile");

			setUser(updateData.data);
		} catch (error: any) {
			setUploadError(error.message || "Failed to remove profile picture.");
		} finally {
			setIsUploading(false);
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

	return (
		<>
			<header className="sticky top-0 z-40 w-full border-b border-[var(--line)] bg-white/80 backdrop-blur-md">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<Link
						href="/admin/dashboard"
						className="group flex items-center gap-3">
						<Image
							src="/images/brand/rock-and-paper-mark.png"
							alt="Rock and paper"
							width={261}
							height={209}
							className="h-auto w-12"
							priority
							unoptimized
						/>
					</Link>

					<div className="flex items-center gap-6">
						{user && (
							<button
								onClick={() => setIsProfileModalOpen(true)}
								className="group flex items-center gap-3 text-left transition-opacity hover:opacity-80">
								<div className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[var(--line)] bg-[var(--royal)]/10 text-sm font-bold text-[var(--royal)] items-center justify-center">
									{user.profilePicture ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={user.profilePicture}
											alt={user.name}
											className="h-full w-full object-cover object-top"
										/>
									) : (
										getInitials(user.name)
									)}
								</div>
								<div className="hidden sm:block">
									<div className="text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--royal)] transition-colors">
										{user.name}
									</div>
									<div className="text-xs text-[var(--muted)]">My Profile</div>
								</div>
							</button>
						)}
						<div className="h-6 w-px bg-[var(--line)] hidden sm:block"></div>
						<button
							onClick={handleLogout}
							className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-red-600">
							Sign Out
						</button>
					</div>
				</div>

				{/* Conditionally show a 'Back to Dashboard' bar if they are inside a module */}
				{!isDashboard && (
					<div className="border-t border-[var(--line)] bg-[var(--paper)]">
						<div className="mx-auto max-w-7xl px-6 py-2">
							<Link
								href="/admin/dashboard"
								className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--royal)]">
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
								Back to Dashboard
							</Link>
						</div>
					</div>
				)}
			</header>

			{/* Profile Settings Modal */}
			{isProfileModalOpen && user && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
					<div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
						<div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
							<h3 className="text-lg font-semibold text-[var(--ink)]">
								Profile Settings
							</h3>
							<button
								onClick={() => setIsProfileModalOpen(false)}
								className="text-[var(--muted)] hover:text-[var(--ink)]">
								&times;
							</button>
						</div>
						<div className="p-6">
							<div className="flex flex-col items-center gap-4">
								<div className="flex h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-[var(--royal)]/10 shadow-md">
									{user.profilePicture ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={user.profilePicture}
											alt={user.name}
											className="h-full w-full object-cover object-top"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[var(--royal)]">
											{getInitials(user.name)}
										</div>
									)}
								</div>
								<div className="text-center">
									<div className="text-lg font-semibold text-[var(--ink)]">
										{user.name}
									</div>
									<div className="text-sm text-[var(--muted)]">
										{user.email}
									</div>
								</div>

								<div className="mt-4 flex w-full flex-col gap-3">
									<label
										className={`relative flex cursor-pointer items-center justify-center rounded-md bg-[var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] ${
											isUploading ? "opacity-70 pointer-events-none" : ""
										}`}>
										{isUploading ? "Uploading..." : "Upload New Picture"}
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleProfilePicChange}
											disabled={isUploading}
										/>
									</label>

									{user.profilePicture && (
										<button
											onClick={handleRemoveProfilePic}
											disabled={isUploading}
											className="flex items-center justify-center rounded-md border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-gray-50 disabled:opacity-70">
											Remove Picture
										</button>
									)}
								</div>

								{uploadError && (
									<p className="mt-2 text-center text-sm font-medium text-red-500">
										{uploadError}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
