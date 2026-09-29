import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const updateUserSchema = yup.object({
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	name: yup.string().required("Name is required"),
	// Password is optional during updates
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.nullable(),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// ==========================================
// GET SINGLE USER
// ==========================================
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };

		const user = await prisma.user.findUnique({
			where: { id },
			select: { id: true, email: true, fullName: true, role: true },
		});

		if (!user) throw { message: "User not found", status: 404 };

		// Map DB 'fullName' back to 'name' for the frontend form
		const formattedUser = { ...user, name: user.fullName };

		return NextResponse.json(
			{ ok: true, data: formattedUser },
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
// UPDATE USER (PUT)
// ==========================================
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid session", status: 401 };

		const body = await req.json();
		const data = await updateUserSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		// Ensure email isn't being taken by another account
		const existingEmail = await prisma.user.findFirst({
			where: { email: data.email, id: { not: id } },
		});

		if (existingEmail) {
			throw {
				message: "This email is already in use by another user",
				status: 409,
			};
		}

		// Prepare the update payload
		const updateData: any = {
			email: data.email,
			fullName: data.name, // Map frontend 'name' to DB 'fullName'
		};

		// Only hash and update the password if they actually typed a new one
		if (data.password) {
			updateData.password = await bcrypt.hash(data.password, 12);
		}

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
			select: { id: true, email: true, fullName: true },
		});

		return NextResponse.json({ ok: true, data: updatedUser }, { status: 200 });
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

// ==========================================
// DELETE USER
// ==========================================
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid session", status: 401 };

		// 1. Safety Check: Prevent admin from deleting their own account while logged in
		if (decoded.userId === id) {
			throw {
				message: "You cannot delete your own active session",
				status: 400,
			};
		}

		// 2. Fetch the target user to check their email
		const targetUser = await prisma.user.findUnique({
			where: { id },
			select: { email: true }, // We only need the email for this check
		});

		if (!targetUser) {
			return NextResponse.json(
				{ ok: false, error: "User not found" },
				{ status: 404 }
			);
		}

		// 3. Super Admin Protection Check
		if (targetUser.email === "admin@rockandpaperlp.com") {
			return NextResponse.json(
				{
					ok: false,
					error: "The primary system admin account cannot be deleted.",
				},
				{ status: 403 } // 403 Forbidden is the correct status here
			);
		}

		// 4. Proceed with deletion
		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json(
			{ ok: true, message: "User deleted" },
			{ status: 200 }
		);
	} catch (e: any) {
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}
