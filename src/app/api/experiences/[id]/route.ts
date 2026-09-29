import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { experienceSchema } from "../route"; // Reuse the schema from the main route

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// PUT: Update a specific experience (Authenticated)
export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------

		const body = await req.json();

		const data = await experienceSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});

		const id = (await params).id;

		const updatedExperience = await prisma.experience.update({
			where: { id },
			data: {
				value: data.value,
				title: data.title,
				description: data.description,
				image: data.image,
				imageAlt: data.imageAlt,
			},
		});

		return NextResponse.json(
			{ ok: true, data: updatedExperience },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025") {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}
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

// DELETE: Remove a specific experience (Authenticated)
export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		// --- Auth Check ---
		const token = req.cookies.get("admin_token")?.value;
		if (!token) throw { message: "Unauthorized", status: 401 };

		const decoded = await verifyToken(token);
		if (!decoded) throw { message: "Invalid or expired session", status: 401 };
		// ------------------
		const id = (await params).id;
		await prisma.experience.delete({
			where: { id },
		});

		return NextResponse.json(
			{ ok: true, message: "Experience deleted successfully" },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025") {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ ok: false, error: e?.message || "SERVER_ERROR" },
			{ status: e?.status || 500 }
		);
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = (await params).id;
		const experience = await prisma.experience.findUnique({
			where: { id },
		});

		if (!experience) {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ ok: true, data: experience }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}
