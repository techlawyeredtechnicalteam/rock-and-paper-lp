"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, FieldArray } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";

const officeSchema = yup.object({
	city: yup.string().required("City is required"),
	address: yup
		.array()
		.of(yup.string().required("Address line cannot be empty"))
		.min(1, "At least one address line is required")
		.required(),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Image URL is required"),
	imageAlt: yup.string().required("Image alt text is required"),
});

const defaultValues = {
	city: "",
	address: [""],
	image: "",
	imageAlt: "",
};

export function OfficeForm({ officeId }: { officeId?: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isUploading, setIsUploading] = useState(false);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	const { data: officeData, isLoading } = useQuery({
		queryKey: ["office", officeId],
		queryFn: async () => {
			const res = await fetch(`/api/offices/${officeId}`);
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
		enabled: !!officeId,
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

	if (officeId && isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading office details...
			</div>
		);
	}

	const initialValues = officeData || defaultValues;

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
				validationSchema={officeSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const url = officeId ? `/api/offices/${officeId}` : "/api/offices";
						const method = officeId ? "PUT" : "POST";

						const res = await fetch(url, {
							method,
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();
						if (!res.ok) throw new Error(json.error || "Failed to save office");

						queryClient.invalidateQueries({ queryKey: ["offices"] });
						router.push("/admin/offices");
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
								Location Details
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<div className="md:col-span-2 lg:col-span-1">
									<InputGroup
										name="city"
										label="City"
										placeholder="e.g. Lagos"
									/>
								</div>

								<div className="md:col-span-2">
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Address Lines
									</label>
									<FieldArray name="address">
										{({ push, remove }) => (
											<div className="flex flex-col gap-3">
												{values.address.map((_: any, index: any) => (
													<div key={index} className="flex items-start gap-3">
														<div className="flex-1">
															<InputGroup
																name={`address.${index}`}
																label=""
																placeholder={`Address Line ${index + 1}`}
															/>
														</div>
														{values.address.length > 1 && (
															<button
																type="button"
																onClick={() => remove(index)}
																className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100">
																&times;
															</button>
														)}
													</div>
												))}
												<button
													type="button"
													onClick={() => push("")}
													className="w-fit mt-1 text-sm font-medium text-[var(--royal)] hover:underline">
													+ Add another address line
												</button>
											</div>
										)}
									</FieldArray>
								</div>
							</div>
						</div>

						{/* Image Upload */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Office Image
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
												alt="Office"
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
										placeholder="e.g. A landmark cable-stayed bridge in Lagos"
									/>
								</div>
							</div>
						</div>

						{/* Submit */}
						<div className="sticky bottom-4 z-10 flex justify-end gap-4 rounded-xl border border-[var(--line)] bg-white/90 p-4 shadow-lg backdrop-blur-md">
							<button
								type="button"
								onClick={() => router.push("/admin/offices")}
								className="px-6 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting
									? "Saving..."
									: officeId
									? "Update Office"
									: "Add Office"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
