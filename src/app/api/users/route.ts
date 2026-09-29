import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// 1. Define the Yup Schema
const createUserSchema = yup.object({
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	// Accept 'name' from the frontend, but map it to 'fullName' for the DB
	name: yup.string().required("Name is required"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
	role: yup.string().oneOf(["ADMIN", "STAFF"], "Invalid role").default("STAFF"), // Set default to ADMIN if all users are admins
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// ==========================================
// GET ALL USERS
// ==========================================
export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };

		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				profilePicture: true,
			},
		});

		// Map 'fullName' from DB to 'name' for the frontend table
		const formattedUsers = users.map((user) => ({
			...user,
			name: user.fullName,
		}));

		return NextResponse.json(
			{ ok: true, data: formattedUsers },
			{ status: 200 }
		);
	} catch (e: any) {
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}

// ==========================================
// CREATE USER (POST)
// ==========================================
export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };

		// Depending on your setup, you might want only ADMINs to create users
		// if (decoded.role !== "ADMIN") throw { message: "Forbidden", status: 403 };

		const body = await req.json();

		const data = await createUserSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const existingUser = await prisma.user.findUnique({
			where: { email: data.email },
		});

		if (existingUser) {
			throw { message: "A user with this email already exists", status: 409 };
		}

		const hashedPassword = await bcrypt.hash(data.password, 12);

		const newUser = await prisma.user.create({
			data: {
				email: data.email,
				fullName: data.name, // Map frontend 'name' to DB 'fullName'
				password: hashedPassword,
				role: data.role as "ADMIN" | "STAFF",
			},
			select: { id: true, email: true, fullName: true, role: true },
		});

		return NextResponse.json({ ok: true, data: newUser }, { status: 201 });
	} catch (e: any) {
		if (e?.name === "ValidationError") {
			return NextResponse.json(
				{ ok: false, error: "VALIDATION_ERROR", details: yupErrorToDetails(e) },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}
