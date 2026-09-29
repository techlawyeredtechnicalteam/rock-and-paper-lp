"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";
import dynamic from "next/dynamic";
import { RichTextEditor } from "./RichTextEditor";
// const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
// 	ssr: false,
// });

const blogSchema = yup.object({
	title: yup.string().required("Title is required"),
	body: yup.string().required("Content body is required"),
	authorName: yup.string().required("Author name is required"),
	authorTitle: yup.string().nullable(),
	authorImage: yup.string().url("Must be a valid URL").nullable(),
	published: yup.boolean().default(false),
	image: yup
		.string()
		.url("Must be a valid URL")
		.required("Cover image is required"),
});

const defaultValues = {
	title: "",
	body: "",
	authorName: "",
	authorTitle: "",
	authorImage: "",
	published: false,
	image: "",
};

export function BlogForm({ blogId }: { blogId?: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();

	// Track loading states for our two different image uploads
	const [isUploading, setIsUploading] = useState<{
		cover: boolean;
		avatar: boolean;
	}>({
		cover: false,
		avatar: false,
	});

	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	const { data: blogData, isLoading } = useQuery({
		queryKey: ["blog", blogId],
		queryFn: async () => {
			const res = await fetch(`/api/blogs/${blogId}`);
			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Failed to fetch");
			return json.data;
		},
		enabled: !!blogId,
	});

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string,
		uploadType: "cover" | "avatar",
		setFieldValue: (field: string, value: any) => void
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsUploading((prev) => ({ ...prev, [uploadType]: true }));
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

			setFieldValue(fieldName, data.fileUrl);
		} catch (error: any) {
			setAlert({ message: error.message || "Upload failed.", type: "error" });
		} finally {
			setIsUploading((prev) => ({ ...prev, [uploadType]: false }));
			e.target.value = "";
		}
	};

	if (blogId && isLoading) {
		return (
			<div className="py-10 text-center text-sm text-[var(--muted)]">
				Loading article...
			</div>
		);
	}

	const initialValues = blogData || defaultValues;

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
				validationSchema={blogSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const url = blogId ? `/api/blogs/${blogId}` : "/api/blogs";
						const method = blogId ? "PUT" : "POST";

						const res = await fetch(url, {
							method,
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();
						if (!res.ok)
							throw new Error(json.error || "Failed to save article");

						queryClient.invalidateQueries({ queryKey: ["blogs"] });
						router.push("/admin/blogs");
						router.refresh();
					} catch (err: any) {
						setAlert({ message: err.message, type: "error" });
						setSubmitting(false);
					}
				}}>
				{({ isSubmitting, values, setFieldValue, errors, touched }) => (
					<Form className="flex flex-col gap-8">
						{/* Status Toggle */}
						<div className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
							<div>
								<h3 className="text-base font-semibold text-[var(--ink)]">
									Publication Status
								</h3>
								<p className="text-sm text-[var(--muted)]">
									Set to true to make this article visible on the live site.
								</p>
							</div>
							<label className="relative flex cursor-pointer items-center gap-3">
								<Field
									type="checkbox"
									name="published"
									className="sr-only peer"
								/>
								<div className="h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
								<span className="text-sm font-medium text-[var(--ink)]">
									{values.published ? "Published" : "Draft"}
								</span>
							</label>
						</div>

						{/* Article Content */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Article Content
							</h3>
							<div className="flex flex-col gap-6">
								<InputGroup name="title" label="Article Title" />
								{/* <InputGroup
									name="body"
									label="Article Body (Supports Markdown/HTML formatting if rendered on frontend)"
									as="textarea"
									rows={15}
								/> */}
								<RichTextEditor name="body" label="Article Content" />
							</div>
						</div>

						{/* Images & Author */}
						<div className="grid gap-8 lg:grid-cols-2">
							{/* Cover Image Upload */}
							<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
								<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
									Cover Image
								</h3>
								<div>
									<div className="aspect-video w-full overflow-hidden rounded-md border border-[var(--line)] bg-gray-50 relative flex items-center justify-center">
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
												isUploading.cover
													? "opacity-50 pointer-events-none"
													: ""
											}`}>
											{isUploading.cover
												? "Uploading..."
												: "Upload Cover Image"}
											<input
												type="file"
												accept="image/*"
												className="hidden"
												onChange={(e) =>
													handleImageUpload(e, "image", "cover", setFieldValue)
												}
											/>
										</label>
									</div>
									{errors.image && touched.image && (
										<p className="mt-2 text-xs font-medium text-red-500">
											{errors.image as string}
										</p>
									)}
								</div>
							</div>

							{/* Author Details */}
							<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8 flex flex-col gap-6">
								<h3 className="mb-2 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
									Author Attribution
								</h3>
								<div className="grid gap-6 md:grid-cols-2">
									<InputGroup
										name="authorName"
										label="Author Name"
										placeholder="e.g. Gideon Sado"
									/>
									<InputGroup
										name="authorTitle"
										label="Author Title"
										placeholder="e.g. Partner"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Author Avatar (Optional)
									</label>
									<div className="mt-2 flex items-center gap-4">
										<div className="h-16 w-16 overflow-hidden rounded-full border border-[var(--line)] bg-gray-50 relative flex items-center justify-center shrink-0">
											{values.authorImage ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={values.authorImage}
													alt="Avatar"
													className="h-full w-full object-cover"
												/>
											) : (
												<svg
													className="h-8 w-8 text-[var(--muted)] opacity-50"
													fill="currentColor"
													viewBox="0 0 24 24">
													<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
												</svg>
											)}
										</div>
										<div>
											<label
												className={`cursor-pointer inline-flex items-center justify-center rounded-md bg-[var(--paper)] px-4 py-2 text-xs font-medium text-[var(--ink)] border border-[var(--line)] transition-colors hover:bg-gray-100 ${
													isUploading.avatar
														? "opacity-50 pointer-events-none"
														: ""
												}`}>
												{isUploading.avatar ? "Uploading..." : "Upload Avatar"}
												<input
													type="file"
													accept="image/*"
													className="hidden"
													onChange={(e) =>
														handleImageUpload(
															e,
															"authorImage",
															"avatar",
															setFieldValue
														)
													}
												/>
											</label>
											{values.authorImage && (
												<button
													type="button"
													onClick={() => setFieldValue("authorImage", "")}
													className="ml-3 text-xs text-red-500 hover:underline">
													Remove
												</button>
											)}
										</div>
									</div>
									{errors.authorImage && touched.authorImage && (
										<p className="mt-2 text-xs font-medium text-red-500">
											{errors.authorImage as string}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Submit Bar */}
						<div className="sticky bottom-4 z-10 flex justify-end gap-4 rounded-xl border border-[var(--line)] bg-white/90 p-4 shadow-lg backdrop-blur-md">
							<button
								type="button"
								onClick={() => router.push("/admin/blogs")}
								className="px-6 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting
									? "Saving..."
									: blogId
									? "Update Article"
									: "Publish Article"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
