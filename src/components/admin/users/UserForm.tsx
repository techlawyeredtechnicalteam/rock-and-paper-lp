"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as yup from "yup";
import { Alert } from "../../shared/Alert";
import { InputGroup } from "../../shared/InputGroup";
import Link from "next/link";

type UserFormProps = {
	initialData?: any;
};

export function UserForm({ initialData }: UserFormProps) {
	const router = useRouter();
	const [alert, setAlert] = useState<{
		message: string;
		type: "error" | "success";
	} | null>(null);
	const [showPassword, setShowPassword] = useState(false);

	const isEditing = !!initialData;

	// Map initialData if the backend returned fullName instead of name
	const mappedInitialData = initialData
		? { ...initialData, name: initialData.name || initialData.fullName }
		: null;

	// Dynamic schema: password is required for new users, but optional for existing ones
	const userSchema = yup.object({
		name: yup.string().required("Full name is required"),
		email: yup
			.string()
			.email("Must be a valid email address")
			.required("Email is required"),
		role: yup.string().oneOf(["ADMIN", "STAFF"]).required("Role is required"),
		password: isEditing
			? yup.string().min(6, "Password must be at least 6 characters").nullable()
			: yup
					.string()
					.min(6, "Password must be at least 6 characters")
					.required("Password is required"),
	});

	const defaultValues = {
		name: "",
		email: "",
		role: "STAFF",
		password: "",
	};

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
				initialValues={mappedInitialData || defaultValues}
				validationSchema={userSchema}
				onSubmit={async (values, { setSubmitting }) => {
					setAlert(null);
					try {
						const endpoint = isEditing
							? `/api/users/${initialData.id}`
							: "/api/users";
						const method = isEditing ? "PUT" : "POST";

						// If editing and password is empty, don't send it to the backend
						const payload = { ...values };
						if (isEditing && !payload.password) {
							delete payload.password;
						}

						const res = await fetch(endpoint, {
							method,
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(payload),
						});

						const json = await res.json();
						if (!res.ok) throw new Error(json.error || "Failed to save user");

						setAlert({
							message: `User ${
								isEditing ? "updated" : "created"
							} successfully!`,
							type: "success",
						});

						setTimeout(() => {
							router.push("/admin/users");
							router.refresh();
						}, 1000);
					} catch (err: any) {
						setAlert({ message: err.message, type: "error" });
						setSubmitting(false);
					}
				}}>
				{({ isSubmitting }) => (
					<Form className="flex flex-col gap-8 max-w-2xl">
						<div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm md:p-8">
							<div className="grid gap-6">
								<InputGroup
									name="name"
									label="Full Name"
									placeholder="e.g. Jane Doe"
								/>

								<InputGroup
									name="email"
									label="Email Address"
									type="email"
									placeholder="e.g. jane@rockandpaperlp.com"
								/>

								{/* Role Dropdown */}
								<div className="flex flex-col">
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										Account Role
									</label>
									<Field name="role">
										{({ field, meta }: FieldProps) => (
											<select
												{...field}
												className={`w-full rounded-md border px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors ${
													meta.touched && meta.error
														? "border-red-500 focus:border-red-500"
														: "border-[var(--line)] focus:border-[var(--royal)]"
												}`}>
												<option value="STAFF">Staff (Standard Access)</option>
												<option value="ADMIN">Admin (Full Access)</option>
											</select>
										)}
									</Field>
									<ErrorMessage
										name="role"
										component="p"
										className="mt-1 text-xs font-medium text-red-500"
									/>
								</div>

								{/* Toggleable Password Field */}
								<div className="flex flex-col">
									<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
										{isEditing
											? "New Password (leave blank to keep current)"
											: "Password"}
									</label>
									<div className="relative">
										<Field name="password">
											{({ field, meta }: FieldProps) => (
												<input
													{...field}
													type={showPassword ? "text" : "password"}
													placeholder="••••••••"
													className={`w-full rounded-md border px-4 py-2.5 pr-12 text-sm text-[var(--ink)] outline-none transition-colors ${
														meta.touched && meta.error
															? "border-red-500 focus:border-red-500"
															: "border-[var(--line)] focus:border-[var(--royal)]"
													}`}
												/>
											)}
										</Field>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--muted)] hover:text-[var(--ink)] transition-colors focus:outline-none">
											{showPassword ? (
												// Eye Slash Icon (Hide)
												<svg
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
													/>
												</svg>
											) : (
												// Eye Icon (Show)
												<svg
													className="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
													/>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
													/>
												</svg>
											)}
										</button>
									</div>
									<ErrorMessage
										name="password"
										component="p"
										className="mt-1 text-xs font-medium text-red-500"
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<button
								type="submit"
								disabled={isSubmitting}
								className="flex min-w-[150px] items-center justify-center rounded-md bg-[var(--color-navy)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-ink)] disabled:opacity-70">
								{isSubmitting
									? "Saving..."
									: isEditing
									? "Update User"
									: "Create User"}
							</button>
							<Link
								href="/admin/users"
								className="text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
								Cancel
							</Link>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
}
