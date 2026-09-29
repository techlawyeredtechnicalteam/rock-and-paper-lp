"use client";

import { useEffect } from "react";

type AlertType = "success" | "error" | "info";

interface AlertProps {
	message: string;
	type?: AlertType;
	onClose: () => void;
}

export function Alert({ message, type = "info", onClose }: AlertProps) {
	// Auto-dismiss the alert after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 5000);
		return () => clearTimeout(timer);
	}, [onClose]);

	const styles = {
		success: "bg-green-50 border-green-200 text-green-800",
		error: "bg-red-50 border-red-200 text-red-800",
		info: "bg-blue-50 border-blue-200 text-blue-800",
	};

	return (
		<div className="fixed left-1/2 top-6 z-50 w-[90%] max-w-md -translate-x-1/2 animate-[slideDown_0.3s_ease-out]">
			<div
				className={`flex items-start justify-between gap-3 rounded-lg border p-4 shadow-xl ${styles[type]}`}>
				<p className="text-sm font-medium leading-relaxed">{message}</p>
				<button
					onClick={onClose}
					className="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:bg-black/5 hover:opacity-100"
					aria-label="Close alert">
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
