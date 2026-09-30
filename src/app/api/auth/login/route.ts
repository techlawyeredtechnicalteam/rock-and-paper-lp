import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

// 1. Define the Yup Schema
const loginSchema = yup.object({
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	password: yup.string().required("Password is required"),
});

// Helper to format Yup errors into a clean object (e.g., { email: "Email is required" })
const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) {
			details[error.path] = error.message;
		}
	});
	return details;
};

export async function POST(req: Request) {
	try {
		const body = await req.json();

		// 2. Validate payload
		const data = await loginSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		console.log(data.email, data.password);

		// 3. Find user
		const user = await prisma.user.findUnique({
			where: { email: data.email },
		});

		console.log(user);

		if (!user) {
			throw { message: "Invalid credentials", status: 401 };
		}

		// 4. Verify password
		const passwordMatch = await bcrypt.compare(data.password, user.password);
		console.log(passwordMatch);
		if (!passwordMatch) {
			throw { message: "Invalid credentials", status: 401 };
		}

		// 5. Generate Token
		const token = await signToken({ userId: user.id, role: user.role });

		// Sanitize user object for the frontend
		const safeUser = {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			role: user.role,
		};

		// 6. Construct NextResponse and set cookies
		const res = NextResponse.json(
			{ ok: true, user: safeUser },
			{ status: 200 }
		);

		res.cookies.set("admin_token", token, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24, // 1 day
		});

		return res;
	} catch (e: any) {
		console.log(e);
		// Handle Yup Validation Errors
		if (e?.name === "ValidationError") {
			return NextResponse.json(
				{ ok: false, error: "VALIDATION_ERROR", details: yupErrorToDetails(e) },
				{ status: 400 }
			);
		}

		// Handle custom or server errors
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}
