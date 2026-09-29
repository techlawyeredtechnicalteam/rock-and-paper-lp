"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup"; // Adjust path to match your folder structure

// 1. Validation Schema (Matches the FirmDetail model)
const firmDetailSchema = yup.object({
	generalEmail: yup
		.string()
		.email("Must be a valid email")
		.required("General email is required"),
	partnerEmail: yup
		.string()
		.email("Must be a valid email")
		.required("Partner email is required"),
	phones: yup
		.array()
		.of(yup.string().required("Phone number cannot be empty"))
		.min(1, "At least one phone number is required")
		.required(),
	hours: yup.string().required("Operating hours are required"),
	xUrl: yup
		.string()
		.url("Must be a valid URL")
		.required("X (Twitter) URL is required"),
});

// Default empty state
const initialValues = {
	generalEmail: "",
	partnerEmail: "",
	phones: [""],
	hours: "",
	xUrl: "",
};

export function FirmDetailForm() {
	const [data, setData] = useState(initialValues);
	const [isLoadingData, setIsLoadingData] = useState(true);
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	// 2. Fetch existing details on mount
	useEffect(() => {
		async function fetchDetails() {
			try {
				const res = await fetch("/api/firm-detail");
				if (res.ok) {
					const json = await res.json();
					if (json.data) {
						// Merge fetched data with defaults
						setData({
							...initialValues,
							...json.data,
							phones: json.data.phones?.length ? json.data.phones : [""],
						});
					}
				}
			} catch (error) {
				console.error("Failed to fetch firm details", error);
			} finally {
				setIsLoadingData(false);
			}
		}
		fetchDetails();
	}, []);

	if (isLoadingData) {
		return (
			<div className="flex h-64 items-center justify-center">
				<span className="text-sm font-medium text-[var(--muted)]">
					Loading firm details...
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
				enableReinitialize={true} // Updates form when fetch completes
				validationSchema={firmDetailSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const res = await fetch("/api/firm-detail", {
							method: "PUT",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const json = await res.json();

						if (!res.ok)
							throw new Error(json.error || "Failed to update firm details");

						setAlert({
							message: "Firm details updated successfully!",
							type: "success",
						});
					} catch (err: any) {
						setAlert({ message: err.message, type: "error" });
					} finally {
						setSubmitting(false);
					}
				}}>
				{({ isSubmitting, values }) => (
					<Form className="flex flex-col gap-10">
						{/* --- SECTION 1: CONTACT INFORMATION --- */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Contact Information
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<InputGroup
									name="generalEmail"
									label="General Inquiries Email"
									type="email"
									placeholder="info@rockandpaperlp.com"
								/>
								<InputGroup
									name="partnerEmail"
									label="Partner Inquiries Email"
									type="email"
									placeholder="partners@rockandpaperlp.com"
								/>

								<div className="md:col-span-2">
									<InputGroup
										name="hours"
										label="Operating Hours"
										placeholder="Monday–Friday, 8:00am–6:00pm"
									/>
								</div>

								{/* FieldArray for Phone Numbers */}
								<div className="md:col-span-2">
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Phone Numbers
									</label>
									<FieldArray name="phones">
										{({ push, remove }) => (
											<div className="flex flex-col gap-3">
												{values.phones.map((_, index) => (
													<div key={index} className="flex items-start gap-3">
														<div className="flex-1 flex flex-col">
															<Field
																name={`phones.${index}`}
																className="w-full rounded-md border border-[var(--line)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--royal)] focus:outline-none transition-colors"
																placeholder="e.g. +234 816 797 5442"
															/>
															<ErrorMessage
																name={`phones.${index}`}
																component="p"
																className="mt-1 text-xs font-medium text-red-500"
															/>
														</div>
														{values.phones.length > 1 && (
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
													+ Add another phone number
												</button>
											</div>
										)}
									</FieldArray>
								</div>
							</div>
						</div>

						{/* --- SECTION 2: SOCIAL PROFILES --- */}
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<h3 className="mb-6 border-b border-[var(--line)] pb-4 text-lg font-semibold text-[var(--ink)]">
								Social Profiles
							</h3>
							<div className="grid gap-6 md:grid-cols-2">
								<div className="md:col-span-2">
									<InputGroup
										name="xUrl"
										label="X (Twitter) URL"
										type="url"
										placeholder="https://x.com/rockandpaperlp"
									/>
								</div>
							</div>
						</div>

						{/* Submit Bar */}
						<div className="sticky bottom-4 z-10 flex justify-end rounded-xl border border-[var(--line)] bg-white/90 p-4 shadow-lg backdrop-blur-md">
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting ? "Saving..." : "Save Details"}
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
