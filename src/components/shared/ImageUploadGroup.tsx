"use client";

import { useState } from "react";
import { ErrorMessage } from "formik";

interface ImageUploadGroupProps {
	name: string;
	label: string;
	value: string;
	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export function ImageUploadGroup({
	name,
	label,
	value,
	setFieldValue,
}: ImageUploadGroupProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		setUploadError(null);

		try {
			// 1. Get Presigned URL from our backend
			const res = await fetch("/api/upload", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ contentType: file.type }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to get upload URL");

			const { url, key: finalUrl } = data;

			// 2. Upload file directly to S3
			const uploadRes = await fetch(url, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			});

			if (!uploadRes.ok) throw new Error("Failed to upload image to S3");

			// 3. Update Formik State with the raw DB key
			setFieldValue(name, finalUrl);
		} catch (error: any) {
			console.error("Upload Error:", error);
			setUploadError(error.message || "Failed to upload image.");
		} finally {
			setIsUploading(false);
			e.target.value = "";
		}
	};

	return (
		<div className="flex flex-col">
			<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
				{label}
			</label>

			<div className="flex items-start gap-4">
				{/* Image Preview Area */}
				{value ? (
					<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-[var(--line)] bg-gray-50">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={
								value.startsWith("http")
									? value
									: `/api/get-image?key=${encodeURIComponent(value)}`
							}
							alt="Profile preview"
							className="h-full w-full object-cover"
						/>
					</div>
				) : (
					<div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-[var(--line)] bg-gray-50 text-[var(--muted)]">
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}

				{/* Controls Area */}
				<div className="flex flex-1 flex-col justify-center gap-2">
					{value ? (
						<div>
							<p className="mb-2 truncate text-xs text-[var(--muted)]">
								{value}
							</p>
							<button
								type="button"
								onClick={() => setFieldValue(name, "")}
								className="text-sm font-medium text-red-600 hover:underline">
								Remove Image
							</button>
						</div>
					) : (
						<div>
							<label
								className={`inline-flex cursor-pointer items-center justify-center rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-gray-50 ${
									isUploading ? "opacity-50 pointer-events-none" : ""
								}`}>
								{isUploading ? "Uploading..." : "Select File"}
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleFileChange}
									disabled={isUploading}
								/>
							</label>
							<p className="mt-2 text-xs text-[var(--muted)]">
								JPEG, PNG, or WEBP up to 5MB
							</p>
						</div>
					)}
				</div>
			</div>

			{uploadError && (
				<p className="mt-2 text-xs font-medium text-red-500">{uploadError}</p>
			)}
			<ErrorMessage
				name={name}
				component="p"
				className="mt-2 text-xs font-medium text-red-500"
			/>
		</div>
	);
}
