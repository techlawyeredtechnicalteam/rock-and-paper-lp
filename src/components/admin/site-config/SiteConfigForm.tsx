"use client";

import { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";
import { Plus, X } from "lucide-react"; // Import some icons for the UI

const siteConfigSchema = yup.object({
	name: yup.string().required("Site name is required"),
	shortName: yup.string().required("Short name is required"),
	url: yup.string().url("Must be a valid URL").required("Site URL is required"),
	locale: yup.string().required("Locale is required"),
	description: yup.string().required("Site description is required"),
	socialDescription: yup
		.string()
		.required("Social sharing description is required"),
	ogImage: yup.string().required("Open Graph image URL is required"),
	twitterImage: yup.string().required("Twitter image URL is required"),
	// Validate keywords as an array of strings
	keywords: yup.array().of(yup.string().required("Keyword cannot be empty")),
});

const initialValues = {
	name: "Rock & Paper LP",
	shortName: "Rock & Paper LP",
	url: "https://rockandpaperlp.com",
	locale: "en_NG",
	description: "",
	socialDescription: "",
	ogImage: "",
	twitterImage: "",
	keywords: [] as string[], // Initialize keywords array
};

export function SiteConfigForm() {
	const [data, setData] = useState(initialValues);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>(
		{}
	);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	useEffect(() => {
		async function fetchConfig() {
			try {
				const res = await fetch("/api/site-config");
				if (res.ok) {
					const json = await res.json();
					if (json.data) {
						setData({
							...initialValues,
							...json.data,
						});
					}
				}
			} catch (error) {
				console.error("Failed to fetch site config", error);
			} finally {
				setIsLoadingData(false);
			}
		}
		fetchConfig();
	}, []);

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string,
		setFieldValue: (field: string, value: any) => void
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading((prev) => ({ ...prev, [fieldName]: true }));
		setAlert(null);

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ contentType: file.type }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Failed to get upload URL");

			const { uploadUrl, fileUrl } = data;

			const uploadRes = await fetch(uploadUrl, {
				method: "PUT",
				headers: { "Content-Type": file.type },
				body: file,
			});
			if (!uploadRes.ok) throw new Error("Failed to upload image to storage");

			setFieldValue(fieldName, fileUrl);
		} catch (error: any) {
			setAlert({
				message: error.message || "Image upload failed.",
				type: "error",
			});
		} finally {
			setIsUploading((prev) => ({ ...prev, [fieldName]: false }));
			e.target.value = "";
		}
	};

	if (isLoadingData) {
		return (
			<div className="flex h-64 items-center justify-center">
				<span className="text-sm font-medium text-[var(--muted)]">
					Loading configuration...
				</span>
			</div>
		);
	}

	return (
		<>
			{alert && (
				<Alert
					message={alert.message}
					type={alert.type}
					onClose={() => setAlert(null)}
				/>
			)}

			<Formik
				initialValues={data}
				enableReinitialize={true}
				validationSchema={siteConfigSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const res = await fetch("/api/site-config", {
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();
						if (!res.ok)
							throw new Error(json.error || "Failed to update configuration");

						setAlert({
							message: "Site configuration updated successfully!",
							type: "success",
						});
					} catch (err: any) {
						setAlert({ message: err.message, type: "error" });
					} finally {
						setSubmitting(false);
					}
				}}>
				{({ isSubmitting, values, setFieldValue, errors, touched }) => (
					<Form className="flex flex-col gap-10 pb-20">
						{/* --- SECTION 1: GLOBAL SETTINGS --- */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Global Settings
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<InputGroup name="name" label="Site Name" />
								<InputGroup name="shortName" label="Short Name" />
								<InputGroup name="url" label="Primary URL" type="url" />
								<InputGroup name="locale" label="Locale (e.g., en_NG)" />
							</div>
						</div>

						{/* --- SECTION 2: SEO METADATA & KEYWORDS --- */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Search Engine Optimization
							</h3>
							<div className="grid gap-6">
								<InputGroup
									name="description"
									label="Global Meta Description (For Google Search)"
									as="textarea"
									rows={3}
								/>
								<InputGroup
									name="socialDescription"
									label="Social Media Description (For LinkedIn, X, Facebook)"
									as="textarea"
									rows={2}
								/>

								{/* SEO Keywords Dynamic Array */}
								<div>
									<label className="mb-3 block text-sm font-medium text-[var(--ink)]">
										SEO Keywords (Tags)
									</label>
									<FieldArray name="keywords">
										{({ push, remove }) => (
											<div className="space-y-3">
												{values.keywords.map((keyword, index) => (
													<div key={index} className="flex items-center gap-3">
														<div className="flex-1">
															<InputGroup
																name={`keywords.${index}`}
																label=""
																placeholder="e.g. Nigerian law firm"
															/>
														</div>
														<button
															type="button"
															onClick={() => remove(index)}
															className="mt-1 flex size-10 items-center justify-center rounded-md border border-[var(--line)] bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
															title="Remove keyword">
															<X className="size-4" />
														</button>
													</div>
												))}
												<button
													type="button"
													onClick={() => push("")}
													className="flex items-center gap-2 rounded-md border border-dashed border-[var(--line)] bg-gray-50 px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-gray-100">
													<Plus className="size-4" />
													Add Keyword
												</button>
											</div>
										)}
									</FieldArray>
								</div>
							</div>
						</div>

						{/* --- SECTION 3: SOCIAL IMAGES --- */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Default Sharing Images
							</h3>
							<div className="grid gap-8 md:grid-cols-2">
								{/* Open Graph Image */}
								<div>
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Open Graph Image (1200x630px)
									</label>
									<div className="mt-2 flex aspect-[1200/630] items-center justify-center overflow-hidden rounded-md border border-[var(--line)] bg-gray-50 relative">
										{values.ogImage ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={values.ogImage}
												alt="OG"
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="text-sm text-[var(--muted)]">
												No image selected
											</span>
										)}
									</div>
									<div className="mt-4 flex items-center gap-3">
										<label
											className={`cursor-pointer rounded-md bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--ink)] border border-[var(--line)] transition-colors hover:bg-gray-100 ${
												isUploading.ogImage
													? "opacity-50 pointer-events-none"
													: ""
											}`}>
											{isUploading.ogImage ? "Uploading..." : "Upload Image"}
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) =>
													handleImageUpload(e, "ogImage", setFieldValue)
												}
											/>
										</label>
									</div>
									{errors.ogImage && touched.ogImage && (
										<p className="mt-2 text-xs font-medium text-red-500">
											{errors.ogImage as string}
										</p>
									)}
								</div>

								{/* Twitter Image */}
								<div>
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Twitter Card Image (1200x630px)
									</label>
									<div className="mt-2 flex aspect-[1200/630] items-center justify-center overflow-hidden rounded-md border border-[var(--line)] bg-gray-50 relative">
										{values.twitterImage ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={values.twitterImage}
												alt="Twitter"
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="text-sm text-[var(--muted)]">
												No image selected
											</span>
										)}
									</div>
									<div className="mt-4 flex items-center gap-3">
										<label
											className={`cursor-pointer rounded-md bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--ink)] border border-[var(--line)] transition-colors hover:bg-gray-100 ${
												isUploading.twitterImage
													? "opacity-50 pointer-events-none"
													: ""
											}`}>
											{isUploading.twitterImage
												? "Uploading..."
												: "Upload Image"}
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) =>
													handleImageUpload(e, "twitterImage", setFieldValue)
												}
											/>
										</label>
									</div>
									{errors.twitterImage && touched.twitterImage && (
										<p className="mt-2 text-xs font-medium text-red-500">
											{errors.twitterImage as string}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Submit Bar */}
						<div className="fixed bottom-0 left-0 right-0 z-50 w-full flex justify-end border-t border-[var(--line)] bg-white/90 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] backdrop-blur-md">
							<button
								type="submit"
								disabled={isSubmitting}
								className="cursor-pointer flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting ? "Saving..." : "Save Configuration"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
