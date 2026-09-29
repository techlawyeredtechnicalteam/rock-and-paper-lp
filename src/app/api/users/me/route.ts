import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// Schema for updating the self profile
const updateMeSchema = yup.object({
	name: yup.string().optional(),
	profilePicture: yup.string().nullable(),
});

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// ==========================================
// GET SELF ACCOUNT
// ==========================================
export async function GET(req: NextRequest) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded: any = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };

		// Depending on how you signed your JWT, the user identifier is usually id, userId, or email.
		const userId = decoded.id || decoded.userId;
		const userEmail = decoded.email;

		// Fetch the user
		const user = await prisma.user.findFirst({
			where: userId ? { id: userId } : { email: userEmail },
			select: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				profilePicture: true,
			},
		});

		if (!user) throw { message: "Account not found", status: 404 };

		// Map DB 'fullName' to 'name' for the frontend
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
// UPDATE SELF ACCOUNT (Profile Picture / Name)
// ==========================================
export async function PUT(req: NextRequest) {
	try {
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded: any = await verifyToken(token);
		if (!decoded) throw { message: "Invalid session", status: 401 };

		const userId = decoded.id || decoded.userId;
		const userEmail = decoded.email;

		const body = await req.json();
		const data = await updateMeSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		// Prepare the update payload based on what they sent
		const updateData: any = {};
		if (data.name) updateData.fullName = data.name; // Map back to DB field
		if (data.profilePicture !== undefined)
			updateData.profilePicture = data.profilePicture;

		const updatedUser = await prisma.user.updateMany({
			where: userId ? { id: userId } : { email: userEmail },
			data: updateData,
		});

		if (updatedUser.count === 0) {
			throw { message: "Failed to update profile", status: 400 };
		}

		// Fetch the fresh user data to return
		const freshUser = await prisma.user.findFirst({
			where: userId ? { id: userId } : { email: userEmail },
			select: {
				id: true,
				email: true,
				fullName: true,
				role: true,
				profilePicture: true,
			},
		});

		// Format for frontend
		const formattedUser = freshUser
			? { ...freshUser, name: freshUser.fullName }
			: null;

		return NextResponse.json(
			{ ok: true, data: formattedUser },
			{ status: 200 }
		);
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
