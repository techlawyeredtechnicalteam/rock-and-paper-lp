"use client";

import { Field, ErrorMessage, FieldProps } from "formik";

interface InputGroupProps {
	name: string;
	label: string;
	type?: string;
	as?: "input" | "textarea";
	rows?: number;
	placeholder?: string;
}

export function InputGroup({
	name,
	label,
	type = "text",
	as = "input",
	rows = 3,
	placeholder = "",
}: InputGroupProps) {
	return (
		<div className="flex flex-col">
			<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
				{label}
			</label>
			<Field name={name}>
				{({ field, meta }: FieldProps) =>
					as === "textarea" ? (
						<textarea
							{...field}
							rows={rows}
							placeholder={placeholder}
							className={`w-full resize-none rounded-md border px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors ${
								meta.touched && meta.error
									? "border-red-500 focus:border-red-500"
									: "border-[var(--line)] focus:border-[var(--royal)]"
							}`}
						/>
					) : (
						<input
							{...field}
							type={type}
							placeholder={placeholder}
							className={`w-full rounded-md border px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors ${
								meta.touched && meta.error
									? "border-red-500 focus:border-red-500"
									: "border-[var(--line)] focus:border-[var(--royal)]"
							}`}
						/>
					)
				}
			</Field>
			<ErrorMessage
				name={name}
				component="p"
				className="mt-1 text-xs font-medium text-red-500"
			/>
		</div>
	);
}
