"use client";

import dynamic from "next/dynamic";
import { useField, useFormikContext } from "formik";
// 1. Update the CSS import path
import "react-quill-new/dist/quill.snow.css";

// 2. Update the dynamic import package name
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
	name: string;
	label: string;
}

export function RichTextEditor({ name, label }: RichTextEditorProps) {
	const { setFieldValue } = useFormikContext();
	const [field, meta] = useField(name);

	const modules = {
		toolbar: [
			[{ header: [2, 3, 4, false] }],
			["bold", "italic", "underline"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "blockquote"],
			["clean"],
		],
	};

	return (
		<div className="flex flex-col">
			<label className="mb-2 block text-sm font-medium text-[var(--ink)]">
				{label}
			</label>

			<div
				className={`overflow-hidden rounded-md border bg-white transition-colors ${
					meta.touched && meta.error
						? "border-red-500"
						: "border-[var(--line)] focus-within:border-[var(--royal)]"
				}`}>
				<ReactQuill
					theme="snow"
					value={field.value}
					onChange={(content) => setFieldValue(name, content)}
					modules={modules}
					className="min-h-[300px]"
				/>
			</div>

			{meta.touched && meta.error && (
				<p className="mt-1 text-xs font-medium text-red-500">{meta.error}</p>
			)}

			<style jsx global>{`
				.ql-toolbar.ql-snow {
					border: none !important;
					border-bottom: 1px solid var(--line) !important;
					background-color: var(--paper);
					font-family: inherit;
				}
				.ql-container.ql-snow {
					border: none !important;
					min-height: 300px;
					font-family: inherit;
					font-size: 1rem;
				}
				.ql-editor {
					min-height: 300px;
				}
			`}</style>
		</div>
	);
}
