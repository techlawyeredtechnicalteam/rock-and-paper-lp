"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { Alert } from "@/components/shared/Alert";
import { InputGroup } from "@/components/shared/InputGroup";

// 1. Predefined site structure to prevent typos
const SITE_STRUCTURE = {
	home: [
		{ key: "hero", label: "Hero Section" },
		{ key: "firm-intro", label: "Firm Introduction" },
		{ key: "ethos", label: "Ethos Section" },
	],
	about: [
		{ key: "hero", label: "Page Hero" },
		{ key: "narrative", label: "About Narrative" },
		{ key: "ethos", label: "About Ethos" },
		{ key: "experience", label: "About Experience" },
	],
	contact: [{ key: "hero", label: "Page Hero" }],
};

const sectionSchema = yup.object({
	eyebrow: yup.string().nullable(),
	title: yup.string().nullable(),
	description: yup.string().nullable(),
	image: yup.string().nullable(),
	linkUrl: yup.string().nullable(),
	linkLabel: yup.string().nullable(),
});

export function PageContentForm() {
	const [selectedPage, setSelectedPage] =
		useState<keyof typeof SITE_STRUCTURE>("home");
	const [selectedSection, setSelectedSection] = useState<string>("hero");

	const [pageData, setPageData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	// Fetch all sections for the selected page
	useEffect(() => {
		async function fetchPageContent() {
			setIsLoading(true);
			try {
				const res = await fetch(`/api/page-content?page=${selectedPage}`);
				if (res.ok) {
					const json = await res.json();
					setPageData(json.data || []);
				}
			} catch (error) {
				console.error("Failed to fetch page content", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchPageContent();

		setSelectedSection(SITE_STRUCTURE[selectedPage][0].key);
	}, [selectedPage]);

	const currentSectionData = pageData.find(
		(s) => s.sectionKey === selectedSection
	) || {
		eyebrow: "",
		title: "",
		description: "",
		image: "",
		linkUrl: "",
		linkLabel: "",
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

			setFieldValue("image", data.fileUrl);
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

			{/* Content Selector */}
			<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
							Select Page
						</label>
						<select
							value={selectedPage}
							onChange={(e) => setSelectedPage(e.target.value as any)}
							className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-navy)] focus:ring-1 focus:ring-[var(--color-navy)]">
							<option value="home">Home Page</option>
							<option value="about">About Page</option>
							<option value="contact">Contact Page</option>
						</select>
					</div>
					<div>
						<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
							Select Section to Edit
						</label>
						<select
							value={selectedSection}
							onChange={(e) => setSelectedSection(e.target.value)}
							className="w-full rounded-md border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-navy)] focus:ring-1 focus:ring-[var(--color-navy)]">
							{SITE_STRUCTURE[selectedPage].map((section) => (
								<option key={section.key} value={section.key}>
									{section.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			{isLoading ? (
				<div className="flex h-32 items-center justify-center rounded-xl border border-[var(--line)] bg-white">
					<span className="text-sm font-medium text-[var(--muted)]">
						Loading section data...
					</span>
				</div>
			) : (
				<Formik
					initialValues={currentSectionData}
					enableReinitialize={true}
					validationSchema={sectionSchema}
					onSubmit={async (values, { setSubmitting }) => {
						setAlert(null);
						try {
							const res = await fetch("/api/page-content", {
								method: "PUT",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									pageSlug: selectedPage,
									sectionKey: selectedSection,
									...values,
								}),
							});

							if (!res.ok) throw new Error("Failed to update section");

							// Refresh local state so it doesn't jump back on re-render
							const updatedRes = await fetch(
								`/api/page-content?page=${selectedPage}`
							);
							const updatedJson = await updatedRes.json();
							setPageData(updatedJson.data || []);

							setAlert({
								message: "Section updated successfully!",
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
									<span>Section Content</span>
									<span className="text-xs font-normal text-[var(--muted)] bg-gray-100 px-2 py-1 rounded">
										ID: {selectedPage} / {selectedSection}
									</span>
								</h3>

								<div className="grid gap-6">
									<InputGroup
										name="eyebrow"
										label="Eyebrow (Small text above title)"
										placeholder="e.g. Our ethos"
									/>
									<InputGroup
										name="title"
										label="Main Title"
										as="textarea"
										rows={2}
									/>
									<InputGroup
										name="description"
										label="Description / Subtext"
										as="textarea"
										rows={4}
									/>

									<div className="grid gap-6 md:grid-cols-2">
										<InputGroup
											name="linkLabel"
											label="Button Label (Optional)"
											placeholder="e.g. Learn more"
										/>
										<InputGroup
											name="linkUrl"
											label="Button URL (Optional)"
											placeholder="e.g. /about"
										/>
									</div>

									{/* Optional Section Image */}
									<div className="mt-4">
										<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
											Section Background/Feature Image (Optional)
										</label>
										{values.image && (
											<div className="mb-4 mt-2 h-48 w-full md:w-96 overflow-hidden rounded-md border border-[var(--line)] relative">
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={values.image}
													alt="Section"
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
												: values.image
												? "Change Image"
												: "Upload Image"}
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => handleImageUpload(e, setFieldValue)}
											/>
										</label>
										{values.image && (
											<button
												type="button"
												onClick={() => setFieldValue("image", "")}
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
									{isSubmitting ? "Saving..." : "Save Section"}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			)}
		</div>
	);
}
