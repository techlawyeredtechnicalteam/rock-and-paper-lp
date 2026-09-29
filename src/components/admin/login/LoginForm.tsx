"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";

const loginSchema = yup.object({
	email: yup
		.string()
		.email("Please enter a valid email address")
		.required("Email is required"),
	password: yup.string().required("Password is required"),
});

export function LoginForm() {
	const router = useRouter();
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);

	return (
		<>
			{/* Reusable Fixed Alert Overlay */}
			{alert && (
				<Alert
					message={alert.message}
					type={alert.type}
					onClose={() => setAlert(null)}
				/>
			)}

			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={loginSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const res = await fetch("/api/auth/login", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(values),
						});

						const data = await res.json();

						if (!res.ok) {
							throw new Error(data.error || "Invalid credentials");
						}

						setAlert({
							message: "Login successful. Redirecting to dashboard...",
							type: "success",
						});
						router.push("/admin/dashboard");
						router.refresh();
					} catch (err: any) {
						setAlert({ message: err.message, type: "error" });
						setSubmitting(false); // Only stop loading if it failed
					}
				}}>
				{({ isSubmitting }) => (
					<Form className="flex flex-col gap-5">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="mb-2 block text-sm font-medium text-[var(--ink)]">
								Email Address
							</label>
							<Field name="email">
								{({ field, meta }: FieldProps) => (
									<input
										{...field}
										id="email"
										type="email"
										disabled={isSubmitting}
										placeholder="admin@royalpartnerslaw.com"
										className={`w-full rounded-md border bg-white px-4 py-3 text-[var(--ink)] outline-none transition-colors disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 ${
											meta.touched && meta.error
												? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
												: "border-[var(--line)] focus:border-[var(--royal)] focus:ring-1 focus:ring-[var(--royal)]"
										}`}
									/>
								)}
							</Field>
							<ErrorMessage
								name="email"
								component="p"
								className="mt-1.5 text-xs font-medium text-red-500"
							/>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="mb-2 block text-sm font-medium text-[var(--ink)]">
								Password
							</label>
							<Field name="password">
								{({ field, meta }: FieldProps) => (
									<input
										{...field}
										id="password"
										type="password"
										disabled={isSubmitting}
										placeholder="••••••••"
										className={`w-full rounded-md border bg-white px-4 py-3 text-[var(--ink)] outline-none transition-colors disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60 ${
											meta.touched && meta.error
												? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
												: "border-[var(--line)] focus:border-[var(--royal)] focus:ring-1 focus:ring-[var(--royal)]"
										}`}
									/>
								)}
							</Field>
							<ErrorMessage
								name="password"
								component="p"
								className="mt-1.5 text-xs font-medium text-red-500"
							/>
						</div>

						{/* Submit Button & Loader */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="relative mt-4 flex w-full overflow-hidden items-center justify-center rounded-md bg-[var(--color-navy)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:cursor-not-allowed">
							{/* Loader Spinner */}
							{isSubmitting ? (
								<span className="flex items-center gap-2">
									<svg
										className="h-4 w-4 animate-spin text-white"
										fill="none"
										viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Authenticating...
								</span>
							) : (
								"Sign In"
							)}

							{/* Dark Overlay when loading to show disabled state clearly */}
							{isSubmitting && (
								<div className="absolute inset-0 bg-black/10"></div>
							)}
						</button>
					</Form>
				)}
			</Formik>
		</>
	);
}
