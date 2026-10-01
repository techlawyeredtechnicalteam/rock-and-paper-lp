"use client";

import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { Alert } from "@/components/shared/Alert";
import { InputGroup } from "@/components/shared/InputGroup";

// Define the pages available for SEO management
const PAGES = [
	{ key: "home", label: "Home Page" },
	{ key: "about", label: "About Page" },
	{ key: "expertise", label: "Expertise (Index) Page" },
	{ key: "people", label: "People (Index) Page" },
	{ key: "contact", label: "Contact Page" },
	{ key: "articles", label: "Articles (Index) Page" },
];

const seoSchema = yup.object({
	title: yup.string().nullable(),
	description: yup.string().nullable(),
	ogImage: yup.string().nullable(),
});

export function PageSeoForm() {
	const [selectedPage, setSelectedPage] = useState<string>("home");
	const [pageData, setPageData] = useState<any>({});
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	// Fetch SEO data when the selected page changes
	useEffect(() => {
		async function fetchPageSeo() {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/page-seo?page=${selectedPage}`);
				if (res.ok) {
					const json = await res.json();
					setPageData(json.data || {});
				}
			} catch (error) {
				console.error("Failed to fetch SEO content", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchPageSeo();
	}, [selectedPage]);

	const initialValues = {
		title: pageData?.title || "",
		description: pageData?.description || "",
		ogImage: pageData?.ogImage || "",
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		setFieldValue: (field: string, value: any) => void
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		setAlert(null);

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ contentType: file.type }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to get upload URL");

			const uploadRes = await fetch(data.uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			});
			if (!uploadRes.ok) throw new Error("Failed to upload image");

			setFieldValue("ogImage", data.fileUrl);
		} catch (error: any) {
			setAlert({
				message: error.message || "Image upload failed.",
				type: "error",
			});
		} finally {
			setIsUploading(false);
			e.target.value = "";
		}
	};

	return (
		<div className="space-y-8 pb-20">
			{alert && (
				<Alert
					message={alert.message}
					type={alert.type}
					onClose={() => setAlert(null)}
				/>
			)}

			{/* Page Selector */}
			<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
				<div className="max-w-md">
					<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
						Select Page to Edit SEO
					</label>
					<select
						value={selectedPage}
						onChange={(e) => setSelectedPage(e.target.value)}
						className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-navy)] focus:ring-1 focus:ring-[var(--color-navy)]">
						{PAGES.map((page) => (
							<option key={page.key} value={page.key}>
								{page.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{isLoading ? (
				<div className="flex h-32 items-center justify-center rounded-xl border border-[var(--line)] bg-white">
					<span className="text-sm font-medium text-[var(--muted)]">
						Loading SEO data...
					</span>
				</div>
			) : (
				<Formik
					initialValues={initialValues}
					enableReinitialize={true}
					validationSchema={seoSchema}
					onSubmit={async (values, { setSubmitting }) => {
						setAlert(null);
						try {
							const res = await fetch("/api/page-seo", {
								method: "PUT",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									pageSlug: selectedPage,
									...values,
								}),
							});

							if (!res.ok) throw new Error("Failed to update SEO");

							setAlert({
								message: "SEO updated successfully!",
								type: "success",
							});
						} catch (err: any) {
							setAlert({ message: err.message, type: "error" });
						} finally {
							setSubmitting(false);
						}
					}}>
					{({ isSubmitting, values, setFieldValue }) => (
						<Form className="flex flex-col gap-8">
							<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
								<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)] flex justify-between items-center">
									<span>Search Engine Optimization</span>
									<span className="text-xs font-normal text-[var(--muted)] bg-gray-100 px-2 py-1 rounded">
										Slug: /{selectedPage === "home" ? "" : selectedPage}
									</span>
								</h3>

								<div className="grid gap-6">
									<InputGroup
										name="title"
										label="Meta Title (Max 60 characters recommended)"
										placeholder="e.g. Rock & Paper LP | Leading Nigerian Law Firm"
									/>

									<InputGroup
										name="description"
										label="Meta Description (Max 160 characters recommended)"
										as="textarea"
										rows={3}
										placeholder="e.g. We advise companies, investors, and individuals across transactional, advisory and contentious matters."
									/>

									{/* Open Graph Image Upload */}
									<div className="mt-4">
										<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
											Social Share Image (Open Graph)
										</label>
										<p className="mb-4 text-xs text-[var(--muted)]">
											Recommended size: 1200 x 630 pixels. This image appears
											when the page is shared on LinkedIn, X (Twitter), or
											iMessage.
										</p>

										{values.ogImage && (
											<div className="mb-4 mt-2 h-48 w-full md:w-96 overflow-hidden rounded-md border border-[var(--line)] relative">
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={values.ogImage}
													alt="SEO Preview"
													className="h-full w-full object-cover"
												/>
											</div>
										)}
										<label
											className={`inline-flex cursor-pointer items-center justify-center rounded-md bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--ink)] border border-[var(--line)] transition-colors hover:bg-gray-100 ${
												isUploading ? "opacity-50 pointer-events-none" : ""
											}`}>
											{isUploading
												? "Uploading..."
												: values.ogImage
												? "Change Image"
												: "Upload Image"}
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => handleImageUpload(e, setFieldValue)}
											/>
										</label>
										{values.ogImage && (
											<button
												type="button"
												onClick={() => setFieldValue("ogImage", "")}
												className="ml-4 text-sm text-red-500 hover:underline">
												Remove Image
											</button>
										)}
									</div>
								</div>
							</div>

							<div className="fixed bottom-0 left-0 right-0 z-50 flex justify-end border-t border-[var(--line)] bg-white/90 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-md w-full">
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
									{isSubmitting ? "Saving..." : "Save SEO Settings"}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			)}
		</div>
	);
}
