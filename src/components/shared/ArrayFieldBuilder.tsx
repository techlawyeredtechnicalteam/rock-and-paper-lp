"use client";

import { FieldArray, Field, ErrorMessage, FieldProps } from "formik";

interface ArrayFieldBuilderProps {
	name: string;
	label: string;
	values: string[];
	placeholder?: string;
	isTextArea?: boolean;
}

export function ArrayFieldBuilder({
	name,
	label,
	values,
	placeholder = "",
	isTextArea = false,
}: ArrayFieldBuilderProps) {
	return (
		<div className="flex flex-col border-l-2 border-[var(--royal)]/20 pl-4">
			<label className="mb-3 block text-sm font-semibold text-[var(--ink)]">
				{label}
			</label>
			<FieldArray name={name}>
				{({ push, remove }) => (
					<div className="flex flex-col gap-3">
						{values.map((_, index: number) => (
							<div key={index} className="flex items-start gap-3">
								<div className="flex-1">
									<Field name={`${name}.${index}`}>
										{({ field, meta }: FieldProps) =>
											isTextArea ? (
												<textarea
													{...field}
													rows={3}
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
										name={`${name}.${index}`}
										component="p"
										className="mt-1 text-xs text-red-500"
									/>
								</div>
								<button
									type="button"
									onClick={() => remove(index)}
									className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
									&times;
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => push("")}
							className="w-fit text-sm font-medium text-[var(--royal)] hover:underline">
							+ Add {label} Entry
						</button>
					</div>
				)}
			</FieldArray>
		</div>
	);
}
