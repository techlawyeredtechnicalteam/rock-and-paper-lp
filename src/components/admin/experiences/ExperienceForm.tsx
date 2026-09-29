"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";

const experienceSchema = yup.object({
	value: yup
		.string()
		.required("Value is required (e.g., US$100m, Undisclosed)"),
	title: yup.string().required("Title is required"),
	description: yup.string().required("Description is required"),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Image URL is required"),
	imageAlt: yup.string().required("Image alt text is required"),
});

const defaultValues = {
	value: "",
	title: "",
	description: "",
	image: "",
	imageAlt: "",
};

export function ExperienceForm({ experienceId }: { experienceId?: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	const { data: expData, isLoading } = useQuery({
		queryKey: ["experience", experienceId],
		queryFn: async () => {
			const res = await fetch(`/api/experiences/${experienceId}`);
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
		enabled: !!experienceId,
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

	if (experienceId && isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading record...
			</div>
		);
	}

	const initialValues = expData || defaultValues;

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
				validationSchema={experienceSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const url = experienceId
							? `/api/experiences/${experienceId}`
							: "/api/experiences";
						const method = experienceId ? "PUT" : "POST";

						const res = await fetch(url, {
							method,
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();
						if (!res.ok) throw new Error(json.error || "Failed to save record");

						queryClient.invalidateQueries({ queryKey: ["experiences"] });
						router.push("/admin/experiences");
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
								Transaction Details
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<InputGroup
									name="title"
									label="Headline / Title"
									placeholder="e.g. Energy investment"
								/>
								<InputGroup
									name="value"
									label="Value"
									placeholder="e.g. US$100m or HKIAC"
								/>
								<div className="md:col-span-2">
									<InputGroup
										name="description"
										label="Short Description"
										as="textarea"
										rows={3}
									/>
								</div>
							</div>
						</div>

						{/* Image Upload */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Transaction Cover Image
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Cover Image
									</label>
									<div className="mt-2 aspect-video w-full overflow-hidden rounded-md border border-[var(--line)] bg-gray-50 relative flex items-center justify-center">
										{values.image ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={values.image}
												alt="Cover"
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
										placeholder="e.g. High-voltage transmission towers at sunset"
									/>
								</div>
							</div>
						</div>

						{/* Submit */}
						<div className="sticky bottom-4 z-10 flex justify-end gap-4 rounded-xl border border-[var(--line)] bg-white/90 p-4 shadow-lg backdrop-blur-md">
							<button
								type="button"
								onClick={() => router.push("/admin/experiences")}
								className="px-6 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting
									? "Saving..."
									: experienceId
									? "Update Experience"
									: "Add Experience"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
