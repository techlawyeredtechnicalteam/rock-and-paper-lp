import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { officeSchema } from "../route"; // Reuse the schema from the main route

const yupErrorToDetails = (err: yup.ValidationError) => {
	const details: Record<string, string> = {};
	err.inner.forEach((error) => {
		if (error.path) details[error.path] = error.message;
	});
	return details;
};

// PUT: Update a specific office (Authenticated)
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

		const data = await officeSchema.validate(body, {
			abortEarly: false,
			stripUnknown: true,
		});
		const id = (await params).id;
		const updatedOffice = await prisma.office.update({
			where: { id },
			data: {
				city: data.city,
				address: data.address, // Replaces the old array entirely
				image: data.image,
				imageAlt: data.imageAlt,
			},
		});

		return NextResponse.json(
			{ ok: true, data: updatedOffice },
			{ status: 200 }
		);
	} catch (e: any) {
		if (e?.code === "P2025") {
			// Prisma code for "Record not found"
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

// DELETE: Remove a specific office (Authenticated)
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
		await prisma.office.delete({
			where: { id },
		});

		return NextResponse.json(
			{ ok: true, message: "Office deleted successfully" },
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

// GET: Fetch a single office by ID
export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const id = (await params).id;
		const office = await prisma.office.findUnique({
			where: { id },
		});

		if (!office) {
			return NextResponse.json(
				{ ok: false, error: "NOT_FOUND" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ ok: true, data: office }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ ok: false, error: "SERVER_ERROR" },
			{ status: 500 }
		);
	}
}
