"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";

const practiceSchema = yup.object({
	slug: yup
		.string()
		.matches(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase letters, numbers, and hyphens only"
		)
		.required("Slug is required"),
	title: yup.string().required("Title is required"),
	shortDescription: yup.string().required("Short description is required"),
	description: yup.string().required("Description is required"),
	services: yup
		.array()
		.of(yup.string().required("Service line cannot be empty"))
		.min(1, "At least one service is required")
		.required(),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Image URL is required"),
	imageAlt: yup.string().required("Image alt text is required"),
});

const defaultValues = {
	slug: "",
	title: "",
	shortDescription: "",
	description: "",
	services: [""],
	image: "",
	imageAlt: "",
};

export function PracticeForm({ practiceId }: { practiceId?: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	// Fetch data ONLY if we are editing an existing practice
	const { data: practiceData, isLoading } = useQuery({
		queryKey: ["practice", practiceId],
		queryFn: async () => {
			const res = await fetch(`/api/practices/${practiceId}`);
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
		enabled: !!practiceId, // TanStack Query feature: only run if practiceId exists
	});

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
			setAlert({ message: error.message || "Upload failed.", type: "error" });
		} finally {
			setIsUploading(false);
			e.target.value = "";
		}
	};

	if (practiceId && isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading practice details...
			</div>
		);
	}

	const initialValues = practiceData || defaultValues;

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
				initialValues={initialValues}
				enableReinitialize={true}
				validationSchema={practiceSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const url = practiceId
							? `/api/practices/${practiceId}`
							: "/api/practices";
						const method = practiceId ? "PUT" : "POST";

						const res = await fetch(url, {
							method,
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();
						if (!res.ok) {
							// Handle slug conflict specific error
							if (res.status === 409)
								throw new Error("This slug is already in use.");
							throw new Error(json.error || "Failed to save practice");
						}

						queryClient.invalidateQueries({ queryKey: ["practices"] });
						router.push("/admin/practices");
						router.refresh();
					} catch (err: any) {
						setAlert({ message: err.message, type: "error" });
						setSubmitting(false);
					}
				}}>
				{({ isSubmitting, values, setFieldValue, errors, touched }) => (
					<Form className="flex flex-col gap-8">
						{/* Core Details */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Core Information
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<InputGroup
									name="title"
									label="Practice Title"
									placeholder="e.g. Energy & Natural Resources"
								/>
								<InputGroup
									name="slug"
									label="URL Slug"
									placeholder="e.g. energy-natural-resources"
								/>
								<div className="md:col-span-2">
									<InputGroup
										name="shortDescription"
										label="Short Description (Card View)"
										as="textarea"
										rows={2}
									/>
								</div>
								<div className="md:col-span-2">
									<InputGroup
										name="description"
										label="Full Description (Page View)"
										as="textarea"
										rows={5}
									/>
								</div>
							</div>
						</div>

						{/* Services Array */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Specific Services
							</h3>
							<FieldArray name="services">
								{({ push, remove }) => (
									<div className="flex flex-col gap-4">
										{values.services.map((_: any, index: any) => (
											<div key={index} className="flex items-start gap-3">
												<div className="flex-1">
													<InputGroup
														name={`services.${index}`}
														label={`Service ${index + 1}`}
													/>
												</div>
												{values.services.length > 1 && (
													<button
														type="button"
														onClick={() => remove(index)}
														className="mt-7 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100">
														&times;
													</button>
												)}
											</div>
										))}
										<button
											type="button"
											onClick={() => push("")}
											className="w-fit text-sm font-medium text-[var(--royal)] hover:underline">
											+ Add another service
										</button>
									</div>
								)}
							</FieldArray>
						</div>

						{/* Image Upload */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Cover Image
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Practice Area Image
									</label>
									<div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-md border border-[var(--line)] bg-gray-50 relative flex items-center justify-center">
										{values.image ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={values.image}
												alt="Practice Cover"
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="text-sm text-[var(--muted)]">
												No image selected
											</span>
										)}
									</div>
									<div className="mt-4">
										<label
											className={`cursor-pointer inline-flex items-center justify-center rounded-md bg-[var(--paper)] px-4 py-2 text-sm font-medium text-[var(--ink)] border border-[var(--line)] transition-colors hover:bg-gray-100 ${
												isUploading ? "opacity-50 pointer-events-none" : ""
											}`}>
											{isUploading ? "Uploading..." : "Upload Image"}
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) => handleImageUpload(e, setFieldValue)}
											/>
										</label>
									</div>
									{errors.image && touched.image && (
										<p className="mt-2 text-xs font-medium text-red-500">
											{errors.image as string}
										</p>
									)}
								</div>
								<div className="mt-4 md:mt-0">
									<InputGroup
										name="imageAlt"
										label="Image Alt Text (Accessibility & SEO)"
										placeholder="e.g. Geometric glass facades of modern corporate towers"
									/>
								</div>
							</div>
						</div>

						{/* Submit */}
						<div className="sticky bottom-4 z-10 flex justify-end gap-4 rounded-xl border border-[var(--line)] bg-white/90 p-4 shadow-lg backdrop-blur-md">
							<button
								type="button"
								onClick={() => router.push("/admin/practices")}
								className="px-6 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting
									? "Saving..."
									: practiceId
									? "Update Practice"
									: "Create Practice"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
