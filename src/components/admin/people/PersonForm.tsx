"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";

const personSchema = yup.object({
	slug: yup
		.string()
		.matches(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Slug must be lowercase letters, numbers, and hyphens only"
		)
		.required("Slug is required"),
	name: yup.string().required("Name is required"),
	order: yup.number().integer("Order must be an integer").default(0), // Added order validation
	expertise: yup
		.array()
		.of(yup.string().required("Expertise cannot be empty"))
		.min(1, "At least one area of expertise is required")
		.required(),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Image URL is required"),
	imagePosition: yup.string().nullable().optional(),
	bio: yup
		.array()
		.of(yup.string().required("Bio paragraph cannot be empty"))
		.min(1, "At least one bio paragraph is required")
		.required(),
});

const defaultValues = {
	slug: "",
	name: "",
	order: 0, // Added default order
	expertise: [""],
	image: "",
	imagePosition: "50% 50%",
	bio: [""],
};

export function PersonForm({ personId }: { personId?: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	const { data: personData, isLoading } = useQuery({
		queryKey: ["person", personId],
		queryFn: async () => {
			const res = await fetch(`/api/people/${personId}`);
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
		enabled: !!personId,
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

	if (personId && isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading profile...
			</div>
		);
	}

	const initialValues = personData || defaultValues;

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
				initialValues={{
					...initialValues,
					imagePosition: initialValues.imagePosition || "50% 50%",
				}}
				enableReinitialize={true}
				validationSchema={personSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const url = personId ? `/api/people/${personId}` : "/api/people";
						const method = personId ? "PUT" : "POST";

						const res = await fetch(url, {
							method,
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();
						if (!res.ok) {
							if (res.status === 409)
								throw new Error("This slug is already in use.");
							throw new Error(json.error || "Failed to save person");
						}

						queryClient.invalidateQueries({ queryKey: ["people"] });
						router.push("/admin/people");
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
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								<InputGroup
									name="name"
									label="Full Name"
									placeholder="e.g. Sulaimon A. Badmus"
								/>
								<InputGroup
									name="slug"
									label="URL Slug"
									placeholder="e.g. sulaimon-a-badmus"
								/>
								<InputGroup
									name="order"
									label="Display Order"
									type="number"
									placeholder="e.g. 1"
								/>
							</div>
							<p className="mt-4 text-xs text-[var(--muted)]">
								* The <strong>Display Order</strong> field controls the sequence
								this person appears on the site. Lower numbers (e.g. 1) appear
								first. If left as 0, it defaults to the creation order.
							</p>
						</div>

						{/* Headshot & Positioning */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Headshot
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Profile Image
									</label>
									<div className="mt-2 aspect-[3/4] w-48 overflow-hidden rounded-md border border-[var(--line)] bg-gray-50 relative flex items-center justify-center">
										{values.image ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={values.image}
												alt="Headshot"
												className="h-full w-full object-cover"
												style={{
													objectPosition: values.imagePosition || "50% 50%",
												}}
											/>
										) : (
											<span className="text-sm text-[var(--muted)]">
												No image
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
								<div>
									<InputGroup
										name="imagePosition"
										label="CSS Object Position (Optional)"
										placeholder="e.g. 50% 50% or center top"
									/>
									<p className="mt-2 text-xs text-[var(--muted)]">
										Adjusts how the image is cropped. Default is 50% 50%.
									</p>
								</div>
							</div>
						</div>

						{/* Expertise Array */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Areas of Expertise
							</h3>
							<FieldArray name="expertise">
								{({ push, remove }) => (
									<div className="flex flex-col gap-4">
										{values.expertise.map((_: any, index: any) => (
											<div key={index} className="flex items-start gap-3">
												<div className="flex-1 md:w-1/2">
													<InputGroup
														name={`expertise.${index}`}
														label={`Expertise ${index + 1}`}
														placeholder="e.g. Corporate Advisory"
													/>
												</div>
												{values.expertise.length > 1 && (
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
											+ Add another area of expertise
										</button>
									</div>
								)}
							</FieldArray>
						</div>

						{/* Bio Paragraphs Array */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Biography
							</h3>
							<FieldArray name="bio">
								{({ push, remove }) => (
									<div className="flex flex-col gap-4">
										{values.bio.map((_: any, index: any) => (
											<div key={index} className="flex items-start gap-3">
												<div className="flex-1">
													<InputGroup
														name={`bio.${index}`}
														label={`Paragraph ${index + 1}`}
														as="textarea"
														rows={4}
													/>
												</div>
												{values.bio.length > 1 && (
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
											+ Add another paragraph
										</button>
									</div>
								)}
							</FieldArray>
						</div>

						{/* Submit */}
						<div className="sticky bottom-4 z-10 flex justify-end gap-4 rounded-xl border border-[var(--line)] bg-white/90 p-4 shadow-lg backdrop-blur-md">
							<button
								type="button"
								onClick={() => router.push("/admin/people")}
								className="px-6 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting
									? "Saving..."
									: personId
									? "Update Profile"
									: "Create Profile"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
