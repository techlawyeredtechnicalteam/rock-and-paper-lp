import { LoginForm } from "@/components/admin/login/LoginForm";
import Image from "next/image";

export const metadata = {
	title: "Admin Login",
};

export default function AdminLoginPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 sm:px-8">
			<div className="w-full max-w-md">
				{/* Brand / Logo Area */}
				<div className="mb-10 flex items-center justify-center">
					<Image
						src="/images/brand/rock-and-paper-mark.png"
						alt="The Royal Partners"
						width={1261}
						height={209}
						className="h-auto w-44 sm:w-36 lg:w-33"
						priority
						unoptimized
					/>
				</div>

				{/* Login Card */}
				<div className="rounded-xl border border-[var(--line)] bg-white p-8 shadow-sm sm:p-10">
					<div className="mb-8">
						<h2 className="text-xl font-semibold text-[var(--ink)]">
							Welcome back
						</h2>
						<p className="mt-1 text-sm text-[var(--muted)]">
							Please enter your details to sign in.
						</p>
					</div>

					<LoginForm />
				</div>

				<p className="mt-8 text-center text-xs text-[var(--muted)]">
					&copy; {new Date().getFullYear()} Rock & Paper LP. All rights
					reserved.
				</p>
			</div>
		</div>
	);
}
